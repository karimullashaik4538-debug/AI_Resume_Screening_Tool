from database import get_connection


def insert_sample_data():
    connection = get_connection()

    # Admin
    connection.execute("""
        INSERT OR IGNORE INTO Admin (username, password)
        VALUES (?, ?)
    """, ("admin", "admin123"))

    # Job
    cursor = connection.execute("""
        INSERT INTO Jobs
        (title, description, required_skills)
        VALUES (?, ?, ?)
    """, (
        "Frontend Developer",
        "Looking for a frontend developer.",
        "HTML, CSS, JavaScript, React"
    ))

    job_id = cursor.lastrowid

    # Candidate
    cursor = connection.execute("""
        INSERT INTO Candidates
        (name, email, resume_filename, extracted_text)
        VALUES (?, ?, ?, ?)
    """, (
        "John Doe",
        "john@example.com",
        "john_resume.pdf",
        "Experienced in HTML, CSS, JavaScript and React."
    ))

    candidate_id = cursor.lastrowid

    # Screening Result
    connection.execute("""
        INSERT INTO ScreeningResults
        (job_id, candidate_id, matched_skills, score, rank)
        VALUES (?, ?, ?, ?, ?)
    """, (
        job_id,
        candidate_id,
        "HTML, CSS, JavaScript, React",
        82.0,
        1
    ))

    connection.commit()
    connection.close()

    print("Sample data inserted successfully!")


if __name__ == "__main__":
    insert_sample_data()