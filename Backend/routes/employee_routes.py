from flask import Blueprint, jsonify
from utils.jwt_guard import jwt_required_custom

employee_bp = Blueprint("employee", __name__, url_prefix="/employee")

@employee_bp.route("/dashboard", methods=["GET"])
@jwt_required_custom
def employee_dashboard():
    return {"msg": "Protected employee dashboard"}