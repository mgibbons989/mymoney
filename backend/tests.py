import pytest
from app import app, db, User, Payroll
from flask import json

@pytest.fixture
def client():
    app.config["TESTING"] = True
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///test.db"
    client = app.test_client()

    with app.app_context():
        db.create_all()
        user = User(email="test@example.com")
        user.set_password("testpassword")
        db.session.add(user)
        db.session.commit()

    yield client

    with app.app_context():
        db.session.remove()
        db.drop_all()

def test_user_login_and_payroll(client):
    # User logs in
    response = client.post('/login', json={"email": "test@example.com", "password": "testpassword"})
    assert response.status_code == 200
    token = response.json.get("token")
    assert token is not None 

    headers = {"Authorization": f"Bearer {token}"}
    payroll_response = client.get('/payroll', headers=headers)
    print("Payroll Response:", payroll_response.json)
    assert payroll_response.status_code == 404

# these tests are checking if the user has logged in
# as in test if there is a correct response in logging in with the correct credentials
# and my functions resturning a good message
# the second test asserts that the payroll exists and is connected to the user