from flask import Blueprint, jsonify

attendance_bp = Blueprint("attendance", __name__, url_prefix="/attendance")

@attendance_bp.route("/check-in", methods=["POST"])
def check_in():
    return jsonify({"msg": "Check-in endpoint"}), 200
