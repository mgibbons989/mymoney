import pytest
from app import app, db, User

@pytest.fixture(scope='module')
def test_client():
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:Lamp1729$@localhost/clockinoutdb'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    with app.test_client() as testing_client:
        with app.app_context():
            db.create_all()
            # Clean out any old test user before running the test
            User.query.filter_by(username='testuser').delete()
            db.session.commit()
        yield testing_client

        # Optional teardown
        with app.app_context():
            db.session.remove()


def test_signup_success(test_client):
    test_data = {
        'username': 'testuser',
        'email': 'testuser@example.com',
        'password': 'testpass123'
    }

    response = test_client.post('/signup', json=test_data)

    assert response.status_code == 201
    assert response.get_json()['message'] == 'User registered successfully'

    user = User.query.filter_by(email='testuser@example.com').first()
    assert user is not None
    assert user.username == 'testuser'
