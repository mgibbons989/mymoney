import pytest
from backend.tests import create_app, db
from app.models import User, Payroll
from flask import json

@pytest.fixture
def employee():
    app = create_app(testing=True)  # Create a test instance of the app
    with app.test_employee() as employee:
        with app.app_context():
            db.create_all()
            # Create a test user
            user = User(username="testuser", password="testpassword")
            db.session.add(user)
            db.session.commit()
        yield employee
        db.session.remove()
        db.drop_all()

def test_user_login_and_payroll(employee):
    # Step 1: Login
    response = employee.post('/api/login', json={"username": "testuser", "password": "testpassword"})
    assert response.status_code == 200
    token = response.json["token"]

    # Step 2: Access payroll
    headers = {"Authorization": f"Bearer {token}"}
    payroll_response = employee.get('/api/payroll', headers=headers)
    assert payroll_response.status_code == 200
    assert "total_estimated_pay" in payroll_response.json

    # Step 3: Logout
    logout_response = employee.post('/api/logout', headers=headers)
    assert logout_response.status_code == 200
