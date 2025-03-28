from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///shift_management.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Define the models for Manager, Employee, and Shift
class Manager(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)

class Employee(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)

class Shift(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    start_time = db.Column(db.String(80), nullable=False)
    end_time = db.Column(db.String(80), nullable=False)
    employee_id = db.Column(db.Integer, db.ForeignKey('employee.id'), nullable=False)
    employee = db.relationship('Employee', backref=db.backref('shifts', lazy=True))

# Create the database tables
with app.app_context():
    db.create_all()

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
