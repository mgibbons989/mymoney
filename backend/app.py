from datetime import datetime
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS
from flask_migrate import Migrate
from dotenv import load_dotenv
from datetime import timedelta
import os
# import urllib.parse
import re

app = Flask(__name__)
CORS(app, supports_credentials=True, origins=["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:4173","http://127.0.0.1:4173",
                                              "https://mgibbons989.github.io", "http://localhost:3000", 
                                              "http://127.0.0.1:3000", "http://127.0.0.1:5000", "http://localhost:5000", "https://mymoney-production-c8a6.up.railway.app"])
# load_dotenv()

# DB_USER = os.getenv('DB_USER')
# DB_PASSWORD = os.getenv('DB_PASSWORD')
# encoded_password = urllib.parse.quote_plus(DB_PASSWORD) #in case there's a special character in the password
# DB_HOST = os.getenv('DB_HOST')
# DB_NAME = os.getenv('DB_NAME')

app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
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
@app.route('/getPayrolls', methods = ['GET'])
@jwt_required()
def getPayroll():
    employee_id = int(get_jwt_identity())

    wage = (db.session.query(Positions.hourly_wage)
            .join(Employee, Employee.position_id == Positions.id)
            .filter(Employee.id == employee_id).scalar()
    )

    shiftsWorked = (
        Timesheet.query
        .filter(Timesheet.employee_id == employee_id)
        .order_by(Timesheet.date.asc())
        .all()
    )

    shiftWorked_data = []

    for shift in shiftsWorked:

        #clock_in = datetime.combine(shift.date, shift.clock_in)
        #clock_out = datetime.combine(shift.date, shift.clock_out)

        duration = shift.clock_out - shift.clock_in

        hours_worked = duration.total_seconds() / 3600

        total_earned = round(hours_worked * wage, 2)
        
        shiftWorked_data.append({
            "title": "Payroll",
            "shift_date": shift.date.isoformat(),
            "start_time": shift.clock_in.strftime("%H:%M"),
            "end_time": shift.clock_out.strftime("%H:%M"),
            "hours": round(hours_worked, 2),
            "wage_per_hour": wage,
            "total_earned": total_earned,
        })
    
    return jsonify(shiftWorked_data), 200


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

        shift_start = shift.start_time
        shift_end = shift.end_time

        duration = shift_end - shift_start

        hours_worked = duration.total_seconds() / 3600

        wage = shift.employee.position.hourly_wage

        total_earned = round(hours_worked * wage, 2)
        
        shift_data.append({
            "shift_id": shift.id,
            "title": "Shift",
            "shift_date": shift.date.isoformat(),
            "start_time": shift.start_time.strftime("%H:%M"),
            "end_time": shift.end_time.strftime("%H:%M"),
            "hours": round(hours_worked, 2),
            "wage_per_hour": round(wage, 2),
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

# fetch only the employees and no managers
@app.route('/employeesOnly', methods = ['GET'])
@jwt_required()
def getEmployeesOnly():
    curr_emps = db.session.query(Employee).join(Positions).filter(Positions.privs== False).all()  # 0 for employees, 1 for managers
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

@app.route('/getEmployeeShifts/<int:employee_id>', methods = ['GET'])
@jwt_required()
def getEmpShifts(employee_id):
    time = request.args.get('period', 'week')
    today = datetime.today().date()

    allShifts = Shifts.query.filter_by(employee_id=employee_id)

    if time == 'week':
        start_week = today - timedelta(days=today.weekday())
        end_week = start_week + timedelta(days=6)
        allShifts = allShifts.filter(Shifts.date >= start_week, Shifts.date <= end_week)
    elif time == 'month':
        start_month = today.replace(day =1)
        if today.month == 12:
            end_month = today.replace(year = today.year + 1, month = 1, day = 1) - timedelta(days = 1)
            # if its decemeber then the end of the month is the next year - 1 day
        else:
            end_month = today.replace(month=today.month + 1, day=1) - timedelta(days=1)
        
        allShifts = allShifts.filter(Shifts.date > start_month, Shifts.date <= end_month)

    
    reshifts = allShifts.order_by(Shifts.date.asc()).all()
    shift_data = []
    for shift in reshifts:
        shift_start = shift.start_time
        shift_end = shift.end_time
        duration = shift_end - shift_start
        hours_worked = duration.total_seconds() / 3600
        wage = shift.employee.position.hourly_wage
        total_earned = round(hours_worked * wage, 2)

        shift_data.append({
            "id": shift.id,
            "title": "Shift",
            "date": shift.date.isoformat(),
            "start_time": shift.start_time.strftime("%H:%M"),
            "end_time": shift.end_time.strftime("%H:%M"),
            "hours": round(hours_worked, 2),
            "wage_per_hour": wage,
            "total_earned": total_earned,
        })

    return jsonify(shift_data), 200

@app.route('/edit_shift/<int:shift_id>', methods = ['PUT'])
@jwt_required()
def editShift(shift_id):
    shift = Shifts.query.filter_by(id=shift_id).first()
    data = request.get_json()
    
    date_str = data.get('date')
    start_time_str = data.get('start_time')
    end_time_str = data.get('end_time')

    if not date_str or not start_time_str or not end_time_str:
        return jsonify({"message": "Missing required fields"}), 400
    
    try:
        date = datetime.strptime(date_str, '%Y-%m-%d').date()
        start = datetime.strptime(f"{date_str} {start_time_str}", '%Y-%m-%d %H:%M')
        end = datetime.strptime(f"{date_str} {end_time_str}", '%Y-%m-%d %H:%M')

        shift.date = date
        shift.start_time = start
        shift.end_time = end

        db.session.commit()

        return jsonify({
            "id": shift.id,
            "date": shift.date.isoformat(),
            "start_time": shift.start_time.strftime('%H:%M'),
            "end_time": shift.end_time.strftime('%H:%M'),
            "employee_id": shift.employee_id
        }), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 500

@app.route('/delete_shift/<int:shift_id>', methods = ["DELETE"])
@jwt_required()
def delShift(shift_id):
    shift = Shifts.query.filter_by(id=shift_id).first()
    db.session.delete(shift)
    db.session.commit()
    
    return jsonify({"message": "Shift deleted successfully"}), 200

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

    clockin_record = Timesheet.query.filter_by(employee_id=current_user_id, clock_out=None).order_by(Timesheet.id.desc()).first()
    
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
    start_time_str = data["start_time"]
    end_time_str = data["end_time"]
    
    try:
        start_time = datetime.strptime(f"{date} {start_time_str}", "%Y-%m-%d %H:%M")
        end_time = datetime.strptime(f"{date} {end_time_str}", "%Y-%m-%d %H:%M")
    except ValueError:
        return jsonify({"message" :"Incorrect format"})
    

    if not all([employee_id, date, start_time, end_time]):
        return jsonify({"message": "Missing required fields"}), 400


    employee = Employee.query.filter_by(id=employee_id).first()
    if not employee:
        return jsonify({"message": "Employee not found"}), 404

    new_shift = Shifts(date = date, start_time=start_time, end_time=end_time, employee_id=employee.id)
    db.session.add(new_shift)
    db.session.commit()

    hours_worked = (end_time - start_time).seconds / 3600

    return jsonify({
        "id": new_shift.id,
        "date": date,
        "start_time": start_time.strftime('%H:%M'),
        "end_time": end_time.strftime('%H:%M'),
        "hours": round(hours_worked, 2)
    }), 201

if __name__ == '__main__':
    app.run(host="0.0.0.0", port = int(os.environ.get("PORT", 5000)))
