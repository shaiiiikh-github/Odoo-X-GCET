from flask import Blueprint, jsonify

payroll_bp = Blueprint("payroll", __name__, url_prefix="/payroll")

@payroll_bp.route("/me", methods=["GET"])
def my_payroll():
    return jsonify({"msg": "Payroll info"}), 200
