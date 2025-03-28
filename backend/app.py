from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from flask_migrate import Migrate


app = Flask(__name__)

app.config["SECRET_KEY"] = "supersecretkey"
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///test.db" #using sqlite for testing only
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config["JWT_SECRET_KEY"] = "mysecretkey"


db = SQLAlchemy(app)
jwt = JWTManager(app)
migrate = Migrate(app, db)


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)

    email = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class Payroll(db.Model):
    id = db.Column(db.Integer, primary_key=True)

    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable = False)
    estimated_pay = db.Column(db.Float, nullable = False)


@app.route("/signup", methods=["POST"])
def signup():
    data = request.get_json()
    email, password = data.get("email"), data.get("password")
    
    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email is already registered"}), 400

    new_user = User(email=email)
    new_user.set_password(password)
    db.session.add(new_user)
    db.session.commit()
    
    return jsonify({"message": "Account created successfully"}), 201

@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data.get("email")).first()
    
    if not user or not user.check_password(data.get("password")):
        return jsonify({"error": "Invalid credentials"}), 401
    
    access_token = create_access_token(identity=str(user.id))
    return jsonify({"token": access_token}), 200

@app.route("/payroll", methods=["GET"])
@jwt_required()
def get_payroll():
    user_id = get_jwt_identity()
    payroll = Payroll.query.filter_by(user_id=user_id).first()
    
    if not payroll:
        return jsonify({"error": "Payroll data not found"}), 404
    
    return jsonify({"total_estimated_pay": payroll.estimated_pay}), 200

if __name__ == "__main__":
    with app.app_context():
        db.create_all() 
    app.run(debug=True)
    