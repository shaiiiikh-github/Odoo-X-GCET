from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from passlib.hash import bcrypt
from db.supabase_client import get_supabase

auth_bp = Blueprint("auth", __name__, url_prefix="/auth")
supabase = get_supabase()

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"msg": "Email and password required"}), 400

    # 1️⃣ Fetch employee from Supabase
    response = (
        supabase
        .table("employees")
        .select("*")
        .eq("email", email)
        .execute()
    )

    if not response.data:
        return jsonify({"msg": "Invalid email or password"}), 401

    employee = response.data[0]

    # 2️⃣ Check approval status
    if employee["status"] != "APPROVED":
        return jsonify({"msg": "Account not approved yet"}), 403

    # 3️⃣ Verify password
    if not bcrypt.verify(password, employee["password"]):
        return jsonify({"msg": "Invalid email or password"}), 401

    # 4️⃣ Create JWT
    token = create_access_token(identity={
        "id": employee["id"],
        "role": employee["role"],
        "email": employee["email"]
    })

    # 5️⃣ Success response
    return jsonify({
    "token": token,
    "employee": {
        "id": employee["id"],
        "name": employee.get("name") 
                or employee.get("full_name") 
                or employee.get("first_name") 
                or employee["email"],
        "role": employee["role"],
        "email": employee["email"]
    }
}), 200

