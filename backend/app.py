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

class Employees(db.Model): #USED TO BE Users
    id = db.Column(db.Integer, primary_key=True)

    email = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    first_name = db.Column(db.String(255), nullable=False)
    last_name = db.Column(db.String(255), nullable=False)
    position = 'inserthereplease'

class Timesheet(db.Model): #USED TO BE ClockInClockOut
    id = db.Column(db.Integer, primary_key=True)

    employee_id = db.Column(db.Integer, db.ForeignKey('Employees.id'), nullable=False)

    date = db.Column(db.DateTime, nullable=True)
    clock_in = db.Column(db.DateTime, nullable=True)
    clock_out = db.Column(db.DateTime, nullable=True)
    # in code: if clock in exists, display clock out button
    # if clock out exists, display clock in button and calculate the hours worked since clock in for the date
    hours_Worked = db.Column(db.Integer, nullable=True)

class Shifts(db.Model):
    id = db.Column(db.Integer, primary_key=True)

    start_time = db.Column(db.String(80), nullable=False)
    end_time = db.Column(db.String(80), nullable=False)
    employee_id = db.Column(db.Integer, db.ForeignKey('employee.id'), nullable=False)
    employee = db.relationship('Employee', backref=db.backref('shifts', lazy=True))

# Create the database tables
# with app.app_context():
#     db.create_all()

@app.route('/')
def home():
    return jsonify({'message': 'Welcome to the Clock-In/Clock-Out API!'}), 200

# Signup Route
@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    user = User(username=data['username'], email=data['email'], password=hashed_password)
    db.session.add(user)
    db.session.commit()
    return jsonify({'message': 'User registered successfully'}), 201

# Login Route
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    user = User.query.filter_by(email=data['email']).first()
    if user and bcrypt.check_password_hash(user.password, data['password']):
        access_token = create_access_token(identity=user.id)
        return jsonify({'access_token': access_token, 'username': user.username}), 200
    return jsonify({'message': 'Invalid credentials'}), 401

# Protected Dashboard Route
@app.route('/dashboard', methods=['GET'])
@jwt_required()
def dashboard():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    return jsonify({'message': f'Welcome, {user.username}'}), 200

# Clock-In Route
@app.route('/clockin', methods=['POST'])
@jwt_required()
def clockin():
    current_user_id = get_jwt_identity()
    clockin_record = ClockInOut(user_id=current_user_id, clock_in=db.func.now())
    db.session.add(clockin_record)
    db.session.commit()
    return jsonify({'message': 'Clock-in successful'}), 200

# Clock-Out Route
@app.route('/clockout', methods=['POST'])
@jwt_required()
def clockout():
    current_user_id = get_jwt_identity()
    clockin_record = ClockInOut.query.filter_by(user_id=current_user_id, clock_out=None).first()
    if clockin_record:
        clockin_record.clock_out = db.func.now()
        db.session.commit()
        return jsonify({'message': 'Clock-out successful'}), 200
    return jsonify({'message': 'No active clock-in found'}), 404

# Route to create manager
@app.route('/create_manager', methods=['POST'])
def create_manager():
    data = request.get_json()
    new_manager = Manager(username=data['username'], password=data['password'])
    db.session.add(new_manager)
    db.session.commit()
    return jsonify({"message": "Manager created successfully!"}), 201

# Route to create employee
@app.route('/create_employee', methods=['POST'])
def create_employee():
    data = request.get_json()
    new_employee = Employee(username=data['username'], password=data['password'])
    db.session.add(new_employee)
    db.session.commit()
    return jsonify({"message": "Employee created successfully!"}), 201

# Route for manager to assign a shift to an employee
@app.route('/assign_shift', methods=['POST'])
def assign_shift():
    data = request.get_json()
    manager_id = data['manager_id']
    employee_id = data['employee_id']
    start_time = data['start_time']
    end_time = data['end_time']
    
    # Check if manager exists
    manager = Manager.query.get(manager_id)
    if not manager:
        return jsonify({"message": "Manager not found"}), 404

    # Check if employee exists
    employee = Employee.query.get(employee_id)
    if not employee:
        return jsonify({"message": "Employee not found"}), 404

    # Create a new shift
    new_shift = Shift(start_time=start_time, end_time=end_time, employee_id=employee.id)
    db.session.add(new_shift)
    db.session.commit()
    return jsonify({"message": "Shift assigned successfully!"}), 201

if __name__ == '__main__':
    app.run(debug=True)
