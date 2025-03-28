import pytest
from app import app, db, Manager, Employee, Shift

@pytest.fixture(scope='module')
def test_client():
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test_shift_management.db'
    with app.test_client() as client:
        with app.app_context():
            db.create_all()
        yield client
        with app.app_context():
            db.drop_all()

# Test for creating manager and employee
def test_create_manager_and_employee(test_client):
    # Create a manager
    manager_data = {'username': 'manager1', 'password': 'password123'}
    response = test_client.post('/create_manager', json=manager_data)
    assert response.status_code == 201
    assert response.json['message'] == 'Manager created successfully!'

    # Create an employee
    employee_data = {'username': 'employee1', 'password': 'password123'}
    response = test_client.post('/create_employee', json=employee_data)
    assert response.status_code == 201
    assert response.json['message'] == 'Employee created successfully!'

# Test for manager assigning a shift to employee
def test_assign_shift(test_client):
    # Create manager and employee
    manager_data = {'username': 'manager2', 'password': 'password456'}
    employee_data = {'username': 'employee2', 'password': 'password456'}
    
    test_client.post('/create_manager', json=manager_data)
    test_client.post('/create_employee', json=employee_data)

    # Get the created manager and employee
    manager = Manager.query.filter_by(username='manager2').first()
    employee = Employee.query.filter_by(username='employee2').first()

    # Assign shift to the employee by the manager
    shift_data = {
        'manager_id': manager.id,
        'employee_id': employee.id,
        'start_time': '2025-03-27 09:00',
        'end_time': '2025-03-27 17:00'
    }
    response = test_client.post('/assign_shift', json=shift_data)
    assert response.status_code == 201
    assert response.json['message'] == 'Shift assigned successfully!'

    # Check if the shift was actually assigned
    shift = Shift.query.filter_by(employee_id=employee.id).first()
    assert shift is not None
    assert shift.start_time == '2025-03-27 09:00'
    assert shift.end_time == '2025-03-27 17:00'

