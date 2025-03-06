from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS
from flask_migrate import Migrate
from dotenv import load_dotenv
import os

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication

# Database configuration (PostgreSQL)
load_dotenv()

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:Lamp1729$@localhost/clockinoutdb'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'your_secret_key')  # Change this to a secure key


# Initialize extensions
db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)
migrate = Migrate(app, db)

# User Model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)

class ClockInOut(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    clock_in = db.Column(db.DateTime, nullable=False)
    clock_out = db.Column(db.DateTime, nullable=True)

# Create the database tables
with app.app_context():
    db.create_all()

# Home Route
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

# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True)
