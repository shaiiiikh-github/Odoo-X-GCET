from flask import Flask
from flask_cors import CORS
import requests
from flask import request, jsonify

from routes.auth_routes import auth_bp
from routes.admin_routes import admin_bp
from routes.employee_routes import employee_bp
from routes.attendance_routes import attendance_bp
from routes.leave_routes import leave_bp
from routes.payroll_routes import payroll_bp
from flask_jwt_extended import JWTManager


app = Flask(__name__)
CORS(app)

CORS(app)
app.config["JWT_SECRET_KEY"] = "super-secret-key"

jwt = JWTManager(app)

app.register_blueprint(auth_bp)
app.register_blueprint(admin_bp)
app.register_blueprint(employee_bp)
app.register_blueprint(attendance_bp)
app.register_blueprint(leave_bp)
app.register_blueprint(payroll_bp)

@app.route("/")
def home():
    return {"status": "Backend running"}, 200


if __name__ == "__main__":
    app.run(debug=True)
