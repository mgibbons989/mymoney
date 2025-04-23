import datetime
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS
from flask_migrate import Migrate
from dotenv import load_dotenv
from datetime import timedelta
import os
import urllib.parse
import re

app = Flask(__name__)
CORS(app, supports_credentials=True, origins=["http://localhost:5173", "http://127.0.0.1:5173"])
load_dotenv()

DB_USER = os.getenv('DB_USER')
DB_PASSWORD = os.getenv('DB_PASSWORD')
encoded_password = urllib.parse.quote_plus(DB_PASSWORD) #in case there's a special character in the password
DB_HOST = os.getenv('DB_HOST')
DB_NAME = os.getenv('DB_NAME')

app.config['SQLALCHEMY_DATABASE_URI'] = f'mysql+pymysql://{DB_USER}:{encoded_password}@{DB_HOST}/{DB_NAME}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'tempsecretkey')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=2)
app.secret_key = "temp_secret_key29"

db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)
migrate = Migrate(app, db)

class Employee(db.Model): #USED TO BE Users
    id = db.Column(db.Integer, primary_key=True)

    email = db.Column(db.String(150), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    first_name = db.Column(db.String(150), nullable=False)
    last_name = db.Column(db.String(150), nullable=False)

    position_id = db.Column(db.Integer, db.ForeignKey('positions.id'), nullable=False)

    position = db.relationship('Positions', backref='employee', lazy=True)

class Timesheet(db.Model): #USED TO BE ClockInClockOut
    id = db.Column(db.Integer, primary_key=True)

    employee_id = db.Column(db.Integer, db.ForeignKey('employee.id'), nullable=False)

    date = db.Column(db.DateTime, nullable=True)
    clock_in = db.Column(db.DateTime, nullable=True)
    clock_out = db.Column(db.DateTime, nullable=True)
    # in code: if clock in exists, display clock out button
    # if clock out exists, display clock in button and calculate the hours worked since clock in for the date
    hours_Worked = db.Column(db.Float, nullable=True)

class Shifts(db.Model):
    id = db.Column(db.Integer, primary_key=True)

    employee_id = db.Column(db.Integer, db.ForeignKey('employee.id'), nullable=False)
    employee = db.relationship('Employee', backref='shifts')

    date = db.Column(db.DateTime, nullable=True)
    start_time = db.Column(db.DateTime, nullable=False)
    end_time = db.Column(db.DateTime, nullable=False)

class Positions(db.Model):
    id = db.Column(db.Integer, primary_key=True)

    positionName = db.Column(db.String(150), nullable=False)
    privs = db.Column(db.Boolean, default = False, nullable=False)
    hourly_wage = db.Column(db.Float, nullable=False)

# Create the database tables
with app.app_context():
    db.create_all()

@app.route('/')
def home():
    return jsonify({'message': 'Welcome to the Clock-In/Clock-Out API!'}), 200

# validate email and password
def valid_email(email):
    regex = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    if (re.match(regex,email)):
        return True
    return False

def valid_password(password):
    if len(password) < 8:
        return "Password must be at least 8 characters long."
    
    if not re.search(r'[A-Z]', password):
        return "Password must contain at least one uppercase letter."
    
    if not re.search(r'[a-z]', password):
        return "Password must contain at least one lowercase letter."
    
    if not re.search(r'\d', password):
        return "Password must contain at least one digit."
    
    if not re.search(r'[!@#$%^&*(),.?\":{}|<>]', password):
        return "Password must contain at least one special character."
    
    return True

@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    email = data['email']
    password = data['password']
    position_name = data['position']
    posit = Positions.query.filter_by(positionName=position_name).first()

    if not valid_email(email):
        return jsonify({"message": 'Invalid email address. Please try again.'}), 400
    
    pass_check = valid_password(password)
    if pass_check != True:
        return jsonify({"message": pass_check}), 400
    
    existing_user = Employee.query.filter_by(email=email).first()
    if existing_user:
        return jsonify({"message": 'Email already registered. Please log in.'}), 409
    
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    
    user = Employee(email=email, 
                    password_hash=hashed_password, 
                    first_name= data['fname'], 
                    last_name = data['lname'], 
                    position = posit)

    db.session.add(user)
    db.session.commit()
    return jsonify({'message': 'Employee registered successfully'}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    user = Employee.query.filter_by(email=data['email']).first()
    
    if user and bcrypt.check_password_hash(user.password_hash, data['password']):
        access_token = create_access_token(identity=str(user.id))
        return jsonify({'access_token': access_token, 'first_name': user.first_name}), 200
    
    return jsonify({'message': 'Invalid credentials. Please try again or signup'}), 401


# *******************TO DO*************************


#based on the chosen pay period, get pay from those dates and display them
#OPTIONAL: make a filter so that the user can go from least to greatest or over a certain number
@app.route('/getPayroll', methods = ['GET', 'POST'])
@jwt_required()
def getPayroll():
    pass


# if no shifts have been assigned, display either "no shift available" or blank if we're using a calendar format
@app.route('/getShifts', methods = ['GET'])
@jwt_required()
def getSchedule():
    employee_id = int(get_jwt_identity())
    # today = db.func.date(db.func.now())

    shifts = (
        Shifts.query
        .filter(Shifts.employee_id == employee_id)
        .order_by(Shifts.date.asc())
        .all()
    )

    shift_data = []

    for shift in shifts:

        shift_start = datetime.combine(shift.shift_date, shift.start_time)
        shift_end = datetime.combine(shift.shift_date, shift.end_time)

        duration = shift_end - shift_start

        hours_worked = duration.total_seconds() / 3600

        wage = shift.employee.position.hourly_wage

        total_earned = round(hours_worked * wage, 2)
        
        shift_data.append({
            "title": "Shift",
            "shift_date": shift.date.isoformat(),
            "start_time": shift.start_time.strftime("%H:%M"),
            "end_time": shift.end_time.strftime("%H:%M"),
            "hours": round(hours_worked, 2),
            "wage_per_hour": wage,
            "total_earned": total_earned,
        })
    

    return jsonify(shift_data), 200

# I need two methods for getting the positons list because i have two 
# pages that require the list, but one is public and the other requires the token

@app.route('/positions/public', methods=['GET'])
def public_positions():
    return get_positions()

@app.route('/positions', methods=['GET'])
@jwt_required()
def private_positions():
    return get_positions()

def get_positions():
    curr_pos = Positions.query.all()
    pos_data = []

    for pos in curr_pos:
        
        positionName = pos.positionName
        privs = pos.privs
        hourly_wage = pos.hourly_wage

        pos_data.append({
            "id": pos.id,
            "positionName": positionName,
            "privs": privs,
            "hourly_wage": hourly_wage,
        })
    
    return jsonify(pos_data), 200

@app.route('/addPosition', methods = ['POST'])
@jwt_required()
def addPosition():
    data = request.get_json()

    positionName = data.get('positionName')
    privs = data.get('privs', False)
    hourly_wage = data.get('hourly_wage')

    if not positionName or hourly_wage is None:
        return jsonify({'error': 'Missing required fields'}), 400

    position = Positions(
        positionName = positionName,
        privs = bool(privs),
        hourly_wage= float(hourly_wage)
    )

    db.session.add(position)
    db.session.commit()

    return jsonify({
        'id': position.id,
        'positionName': position.positionName,
        'privs': position.privs,
        'hourly_wage': position.hourly_wage
        }), 201


# for those with privileges, return a list of employees 
# we'll turn them into links to lead to employee information and for assigning shifts
@app.route('/employees')
@jwt_required()
def getEmployees():
    curr_emps = Employee.query.all()
    emp_data = []

    for emp in curr_emps:
        fname = emp.first_name
        lname = emp.last_name
        email = emp.email
        position = emp.position.positionName

        emp_data.append({
            "id" : emp.id,
            "fname": fname,
            "lname": lname,
            "email" : email,
            "position": position,
        })
    
    return jsonify(emp_data), 200

# display employee information for manager
@app.route('/info/<int:employee_id>', methods = ['GET'])
@jwt_required()
def displayEmployeeInfo(employee_id):
    pass

@app.route('/api/employee', methods=['GET'])
@jwt_required()
def curr_employee_info():
    employee_id = int(get_jwt_identity())
    employee = Employee.query.filter_by(id=employee_id).first()

    if employee:
        return jsonify({
            "first_name": employee.first_name,
            "last_name": employee.last_name,
            "email": employee.email,
            "privs": employee.position.privs
        }), 200
    else:
        return jsonify({"message": "Employee not found"}), 404

@app.route('/dashboard', methods=['GET'])
@jwt_required()
def dashboard():
    current_user_id = int(get_jwt_identity())
    user = Employee.query.get(current_user_id)
    return jsonify({'message': f'Welcome, {user.first_name}'}), 200

@app.route('/clock-in-status', methods = ['GET'])
@jwt_required()
def clock_status():
    employee_id = int(get_jwt_identity())
    today = db.func.date(db.func.now())

    time = Timesheet.query.filter_by(employee_id=employee_id, date=today).first()
    if time and time.clock_out is None:
        return jsonify({'clocked_in': True}), 200
    else:
        return jsonify({'clocked_in': False}), 200


@app.route('/clockin', methods=['POST'])
@jwt_required()
def clockin():
    current_user_id = int(get_jwt_identity())
    clockin_record = Timesheet(employee_id = current_user_id, 
                               date = db.func.date(db.func.now()), 
                               clock_in = db.func.time(db.func.now()))

    db.session.add(clockin_record)
    db.session.commit()

    return jsonify({'message': 'Clock-in successful'}), 200

@app.route('/clockout', methods=['POST'])
@jwt_required()
def clockout():
    current_user_id = int(get_jwt_identity())

    # NEED TO ADD EDGE CASE OF CLOCK OUT BEING THE NEXT DAY AND IF THERE ARE MULTIPLE CLOCK IN AND OUTS A DAY(split shift)

    clockin_record = Timesheet.query.filter_by(user_id=current_user_id, date = db.func.date(db.func.now()), clock_out=None).first()
    
    if clockin_record:
        clockin_record.clock_out = db.func.time(db.func.now())
        db.session.commit()
        return jsonify({'message': 'Clock-out successful'}), 200
    
    return jsonify({'message': 'No active clock-in found'}), 404


@app.route('/assign_shift', methods=['POST'])
@jwt_required()
def assign_shift():
    data = request.get_json()
    employee_id = data['employee_id']
    date = data['date']
    start_time = data['start_time']
    end_time = data['end_time']

    employee = Employee.query.get(employee_id)

    if not employee:
        return jsonify({"message": "Employee not found"}), 404

    new_shift = Shifts(date = date, start_time=start_time, end_time=end_time, employee_id=employee.id)
    db.session.add(new_shift)
    db.session.commit()
    return jsonify({"message": "Shift assigned successfully!"}), 201

if __name__ == '__main__':
    app.run(debug=True)
