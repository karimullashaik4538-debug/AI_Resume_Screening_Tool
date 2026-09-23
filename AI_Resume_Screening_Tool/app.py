from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os

from database import get_connection, create_tables
from pdf_processor import (
    allowed_file,
    extract_text_from_pdf,
    clean_text
)
from resume_matching import rank_candidates


app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Create database tables
create_tables()


# =========================
# FRONTEND
# =========================

@app.route("/")
def home():
    return send_from_directory(".", "login.html")


@app.route("/<path:filename>")
def serve_frontend(filename):
    return send_from_directory(".", filename)


# =========================
# LOGIN
# =========================

@app.route("/api/login", methods=["POST"])
def login():

    data = request.get_json() or {}

    username = data.get("username", "").strip()
    password = data.get("password", "").strip()

    if not username or not password:
        return jsonify({
            "success": False,
            "message": "Username and password are required."
        }), 400

    connection = get_connection()

    admin = connection.execute(
        """
        SELECT * FROM Admin
        WHERE username = ?
        AND password = ?
        """,
        (username, password)
    ).fetchone()

    connection.close()

    if admin:
        return jsonify({
            "success": True,
            "message": "Login successful!"
        })

    return jsonify({
        "success": False,
        "message": "Invalid username or password."
    }), 401


# =========================
# ADD JOB
# =========================

@app.route("/api/jobs", methods=["POST"])
def add_job():

    data = request.get_json() or {}

    title = data.get("title", "").strip()
    description = data.get("description", "").strip()
    required_skills = data.get("required_skills", "").strip()

    if not title or not description or not required_skills:
        return jsonify({
            "error": "All job details are required."
        }), 400

    connection = get_connection()

    cursor = connection.execute(
        """
        INSERT INTO Jobs
        (title, description, required_skills)
        VALUES (?, ?, ?)
        """,
        (title, description, required_skills)
    )

    connection.commit()

    job_id = cursor.lastrowid
    connection.close()

    return jsonify({
        "message": "Job added successfully!",
        "job_id": job_id
    }), 201


# =========================
# GET JOBS
# =========================

@app.route("/api/jobs", methods=["GET"])
def get_jobs():

    connection = get_connection()

    jobs = connection.execute(
        """
        SELECT * FROM Jobs
        ORDER BY id DESC
        """
    ).fetchall()

    connection.close()

    return jsonify([
        dict(job) for job in jobs
    ])


# =========================
# RESUME UPLOAD
# =========================

@app.route("/upload", methods=["POST"])
def upload_resume():

    if "resume" not in request.files:
        return jsonify({
            "error": "No resume file selected."
        }), 400

    file = request.files["resume"]

    if file.filename == "":
        return jsonify({
            "error": "No file selected."
        }), 400

    if not allowed_file(file.filename):
        return jsonify({
            "error": "Only PDF files are allowed."
        }), 400

    try:

        filename = file.filename

        file_path = os.path.join(
            UPLOAD_FOLDER,
            filename
        )

        file.save(file_path)

        extracted_text = extract_text_from_pdf(file_path)

        if not extracted_text.strip():
            return jsonify({
                "error": "No readable text found in this PDF."
            }), 400

        processed_text = clean_text(extracted_text)

        return jsonify({
            "message": "Resume processed successfully!",
            "filename": filename,
            "text": processed_text
        }), 200

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500


# =========================
# ADD CANDIDATE
# =========================

@app.route("/api/candidates", methods=["POST"])
def add_candidate():

    data = request.get_json() or {}

    name = data.get("name", "").strip()
    email = data.get("email", "").strip()
    resume_filename = data.get("resume_filename", "").strip()
    extracted_text = data.get("extracted_text", "").strip()

    if not name or not email or not resume_filename:
        return jsonify({
            "error": "Candidate details are required."
        }), 400

    connection = get_connection()

    cursor = connection.execute(
        """
        INSERT INTO Candidates
        (name, email, resume_filename, extracted_text)
        VALUES (?, ?, ?, ?)
        """,
        (
            name,
            email,
            resume_filename,
            extracted_text
        )
    )

    connection.commit()

    candidate_id = cursor.lastrowid
    connection.close()

    return jsonify({
        "message": "Candidate added successfully!",
        "candidate_id": candidate_id
    }), 201


# =========================
# GET CANDIDATES
# =========================

@app.route("/api/candidates", methods=["GET"])
def get_candidates():

    connection = get_connection()

    candidates = connection.execute(
        """
        SELECT * FROM Candidates
        ORDER BY id DESC
        """
    ).fetchall()

    connection.close()

    return jsonify([
        dict(candidate) for candidate in candidates
    ])


# =========================
# AI MATCHING
# =========================

@app.route("/api/match", methods=["POST"])
def match_resumes():

    data = request.get_json() or {}

    job_description = data.get(
        "job_description",
        ""
    ).strip()

    candidates = data.get(
        "candidates",
        []
    )

    if not job_description:
        return jsonify({
            "error": "Job description is required."
        }), 400

    if not candidates:
        return jsonify({
            "error": "At least one candidate is required."
        }), 400

    results = rank_candidates(
        job_description,
        candidates
    )

    return jsonify({
        "results": results
    })


# =========================
# SAVE SCREENING RESULT
# =========================

@app.route("/api/results", methods=["POST"])
def save_result():

    data = request.get_json() or {}

    job_id = data.get("job_id")
    candidate_id = data.get("candidate_id")
    matched_skills = data.get("matched_skills", "")
    score = data.get("score", 0)
    rank = data.get("rank", 0)

    if not job_id or not candidate_id:
        return jsonify({
            "error": "Job ID and Candidate ID are required."
        }), 400

    connection = get_connection()

    connection.execute(
        """
        INSERT INTO ScreeningResults
        (job_id, candidate_id, matched_skills, score, rank)
        VALUES (?, ?, ?, ?, ?)
        """,
        (
            job_id,
            candidate_id,
            matched_skills,
            score,
            rank
        )
    )

    connection.commit()
    connection.close()

    return jsonify({
        "message": "Screening result saved successfully!"
    }), 201


# =========================
# GET RESULTS
# =========================

@app.route("/api/results", methods=["GET"])
def get_results():

    connection = get_connection()

    results = connection.execute(
        """
        SELECT
            ScreeningResults.id,
            ScreeningResults.matched_skills,
            ScreeningResults.score,
            ScreeningResults.rank,
            Jobs.title AS job_title,
            Candidates.name AS candidate_name
        FROM ScreeningResults
        JOIN Jobs
        ON ScreeningResults.job_id = Jobs.id
        JOIN Candidates
        ON ScreeningResults.candidate_id = Candidates.id
        ORDER BY ScreeningResults.rank ASC
        """
    ).fetchall()

    connection.close()

    return jsonify([
        dict(result) for result in results
    ])


# =========================
# RUN SERVER
# =========================

if __name__ == "__main__":

    app.run(
        host="127.0.0.1",
        port=5000,
        debug=True
    )