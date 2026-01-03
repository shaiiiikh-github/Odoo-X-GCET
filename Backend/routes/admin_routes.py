from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from supabase_client import supabase



admin_bp = Blueprint("admin", __name__, url_prefix="/admin")

@admin_bp.route("/pending-employees", methods=["GET"])
@jwt_required()
def get_pending_employees():
    current_user = get_jwt_identity()

    # 🔒 Only admin allowed
    if current_user["role"].lower() != "admin":
        return jsonify({"msg": "Unauthorized"}), 403

    response = supabase.table("employees") \
        .select("id, email, role, status") \
        .eq("status", "PENDING") \
        .execute()

    return jsonify(response.data), 200

@admin_bp.route("/approve-employee/<int:employee_id>", methods=["POST"])
@jwt_required()
def approve_employee(employee_id):
    current_user = get_jwt_identity()

    if current_user["role"].lower() != "admin":
        return jsonify({"msg": "Unauthorized"}), 403

    supabase.table("employees") \
        .update({"status": "APPROVED"}) \
        .eq("id", employee_id) \
        .execute()

    return jsonify({"msg": "Employee approved"}), 200


@admin_bp.route("/reject-employee/<int:employee_id>", methods=["POST"])
@jwt_required()
def reject_employee(employee_id):
    current_user = get_jwt_identity()

    if current_user["role"].lower() != "admin":
        return jsonify({"msg": "Unauthorized"}), 403

    supabase.table("employees") \
        .update({"status": "REJECTED"}) \
        .eq("id", employee_id) \
        .execute()

    return jsonify({"msg": "Employee rejected"}), 200
