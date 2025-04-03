from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS
from flask_migrate import Migrate
from dotenv import load_dotenv
import os
import urllib.parse

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
app.secret_key = "temp_secret_key29"

db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)
migrate = Migrate(app, db)

# --Joe--
class Employee(db.Model): #USED TO BE Users
    id = db.Column(db.Integer, primary_key=True)

    email = db.Column(db.String(150), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    first_name = db.Column(db.String(150), nullable=False)
    last_name = db.Column(db.String(150), nullable=False)
    position = db.Column(db.Integer, db.ForeignKey('positions.id'), nullable=False)

    position = db.relationship('Positions', backref='employees', lazy=True)

class Timesheet(db.Model): #USED TO BE ClockInClockOut
    id = db.Column(db.Integer, primary_key=True)

    employee_id = db.Column(db.Integer, db.ForeignKey('Employees.id'), nullable=False)

    date = db.Column(db.DateTime, nullable=True)
    clock_in = db.Column(db.DateTime, nullable=True)
    clock_out = db.Column(db.DateTime, nullable=True)
    # in code: if clock in exists, display clock out button
    # if clock out exists, display clock in button and calculate the hours worked since clock in for the date
    hours_Worked = db.Column(db.Float, nullable=True)
# ----

# --Robert--
class Shifts(db.Model):
    id = db.Column(db.Integer, primary_key=True)

    employee_id = db.Column(db.Integer, db.ForeignKey('employees.id'), nullable=False)

    date = db.Column(db.DateTime, nullable=True)
    start_time = db.Column(db.DateTime, nullable=False)
    end_time = db.Column(db.DateTime, nullable=False)

class Positions(db.Model):
    id = db.Column(db.Integer, primary_key=True)

    positionName = db.Column(db.String(150), nullable=False)
    privileges = db.Column(db.Boolean, default = False, nullable=False)
    hourly_wage = db.Column(db.Float, nullable=False)

# ----

# Create the database tables
# with app.app_context():
#     db.create_all()

@app.route('/')
def home():
    return jsonify({'message': 'Welcome to the Clock-In/Clock-Out API!'}), 200

# validate email and password
def valid_email():
    pass

def valid_password():
    pass

# Signup Route
@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    email = data['email']
    password = data['password']

    if not valid_email(email):
        return jsonify({"message": 'Invalid email address. Please try again.'}), 400
    if not valid_password(password):
        return jsonify({"message": 'Invalid password. Please try again.'}), 400
    existing_user = Employee.query.filter_by(email=email).first()
    if existing_user:
        return jsonify({"message": 'Email already registered. Please log in.'}), 409
    
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    
    user = Employee(email=email, 
                    password_hash=hashed_password, 
                    first_name= data['fname'], 
                    last_name = data['lname'], 
                    position = data['position'])

    db.session.add(user)
    db.session.commit()
    return jsonify({'message': 'Employee registered successfully'}), 201

# Login Route
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    user = Employee.query.filter_by(email=data['email']).first()
    
    if user and bcrypt.check_password_hash(user.password_hash, data['password']):
        access_token = create_access_token(identity=user.id)
        return jsonify({'access_token': access_token, 'first_name': user.first_name}), 200
    
    return jsonify({'message': 'Invalid credentials. Please try again or signup'}), 401

@app.route('/logout')
def logout():
    pass

#based on the chosen pay period, get pay from those dates and display them
#OPTIONAL: make a filter so that the user can go from least to greatest or over a certain number
@app.route('/getPayroll', method = ['GET', 'POST']) 
def getPayroll():
    pass

# display the schedule for the next three weeks
# if no shifts have been assigned, display either "no shift available" or blank if we're using a calendar format
@app.route('/schedule')
def getSchedule():
    pass

# for those with priveleges, return a list of employees 
# we'll turn them into links to lead to employee information and for assigning shifts
@app.route('/employees')
def getEmployees():
    pass

# display employee information
@app.route('info/<int:employee_id>', methods = ['GET'])
def displayEmployeeInfo(employee_id):
    pass

# Protected Dashboard Route
@app.route('/dashboard', methods=['GET'])
@jwt_required()
def dashboard():
    current_user_id = get_jwt_identity()
    user = Employee.query.get(current_user_id)
    return jsonify({'message': f'Welcome, {user.first_name}'}), 200

# Clock-In Route
@app.route('/clockin', methods=['POST'])
@jwt_required()
def clockin():
    current_user_id = get_jwt_identity()
    clockin_record = Timesheet(user_id = current_user_id, 
                               date = db.func.date(db.func.now()), 
                               clock_in = db.func.time(db.func.now()))

    db.session.add(clockin_record)
    db.session.commit()

    return jsonify({'message': 'Clock-in successful'}), 200

# Clock-Out Route
@app.route('/clockout', methods=['POST'])
@jwt_required()
def clockout():
    current_user_id = get_jwt_identity()

    # NEED TO ADD EDGE CASE OF CLOCK OUT BEING THE NEXT DAY AND IF THERE ARE MULTIPLE CLOCK IN AND OUTS A DAY(split shift)

    clockin_record = Timesheet.query.filter_by(user_id=current_user_id, date = db.func.date(db.func.now()), clock_out=None).first()
    
    if clockin_record:
        clockin_record.clock_out = db.func.time(db.func.now())
        db.session.commit()
        return jsonify({'message': 'Clock-out successful'}), 200
    
    return jsonify({'message': 'No active clock-in found'}), 404


# Route for manager to assign a shift to an employee
@app.route('/assign_shift', methods=['POST'])
def assign_shift():
    data = request.get_json()
    employee_id = data['employee_id']
    date = data['date']
    start_time = data['start_time']
    end_time = data['end_time']

    # Check if employee exists
    employee = Employee.query.get(employee_id)

    if not employee:
        return jsonify({"message": "Employee not found"}), 404

    # Create a new shift
    new_shift = Shifts(date = date, start_time=start_time, end_time=end_time, employee_id=employee.id)
    db.session.add(new_shift)
    db.session.commit()
    return jsonify({"message": "Shift assigned successfully!"}), 201

if __name__ == '__main__':
    app.run(debug=True)
