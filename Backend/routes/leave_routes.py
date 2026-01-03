from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from supabase_client import supabase
from flask import request, jsonify

leave_bp = Blueprint("leave", __name__, url_prefix="/leave")

@leave_bp.route("/apply", methods=["POST"])
@jwt_required()
def apply_leave():
    user = get_jwt_identity()

    if user["role"].lower() != "employee":
        return jsonify({"msg": "Unauthorized"}), 403

    data = request.json

    supabase.table("leaves").insert({
        "employee_id": user["id"],
        "type": data["type"],
        "start_date": data["start_date"],
        "end_date": data["end_date"],
        "reason": data.get("reason", ""),
        "status": "PENDING"
    }).execute()

    return jsonify({"msg": "Leave applied successfully"}), 201

@leave_bp.route("/pending", methods=["GET"])
@jwt_required()
def pending_leaves():
    user = get_jwt_identity()

    if user["role"].lower() != "admin":
        return jsonify({"msg": "Unauthorized"}), 403

    response = supabase.table("leaves") \
        .select("*, employees(email)") \
        .eq("status", "PENDING") \
        .execute()

    return jsonify(response.data), 200


@leave_bp.route("/approve/<int:leave_id>", methods=["POST"])
@jwt_required()
def approve_leave(leave_id):
    user = get_jwt_identity()

    if user["role"].lower() != "admin":
        return jsonify({"msg": "Unauthorized"}), 403

    supabase.table("leaves") \
        .update({"status": "APPROVED"}) \
        .eq("id", leave_id) \
        .execute()

    return jsonify({"msg": "Leave approved"}), 200




@leave_bp.route("/my-leaves", methods=["GET"])
@jwt_required()
def my_leaves():
    user = get_jwt_identity()

    response = supabase.table("leaves") \
        .select("*") \
        .eq("employee_id", user["id"]) \
        .order("start_date", desc=True) \
        .execute()

    return jsonify(response.data), 200
