import re


SKILLS = [
    "python",
    "java",
    "javascript",
    "html",
    "css",
    "sql",
    "mysql",
    "flask",
    "django",
    "react",
    "node.js",
    "express",
    "c",
    "c++",
    "git",
    "github",
    "machine learning",
    "deep learning",
    "data science",
    "data structures",
    "algorithms",
    "mongodb",
    "bootstrap",
    "php",
    "communication",
    "problem solving"
]


def clean_text(text):
    if not text:
        return ""

    text = text.lower()

    text = re.sub(
        r"[^a-z0-9+#.\s]",
        " ",
        text
    )

    text = re.sub(
        r"\s+",
        " ",
        text
    )

    return text.strip()


def find_skills(text):

    text = clean_text(text)

    found = []

    for skill in SKILLS:

        skill = skill.lower()

        if skill == "c":

            pattern = (
                r"(?<![a-z0-9+#])"
                r"c"
                r"(?![a-z0-9+#])"
            )

        elif skill == "c++":

            pattern = (
                r"(?<![a-z0-9])"
                r"c\+\+"
                r"(?![a-z0-9])"
            )

        else:

            pattern = (
                r"(?<![a-z0-9])"
                + re.escape(skill)
                + r"(?![a-z0-9])"
            )

        if re.search(pattern, text):
            found.append(skill)

    return found


def get_required_skills(job_description):
    return find_skills(job_description)


def calculate_score(required, candidate):

    if len(required) == 0:
        return 0

    matched = 0

    for skill in required:

        if skill.lower() in candidate:
            matched += 1

    score = (
        matched / len(required)
    ) * 100

    return round(score, 2)


def match_resume(job_description, resume_text):

    required_skills = get_required_skills(
        job_description
    )

    candidate_skills = find_skills(
        resume_text
    )

    matched_skills = []
    missing_skills = []

    for skill in required_skills:

        if skill in candidate_skills:
            matched_skills.append(skill)
        else:
            missing_skills.append(skill)

    score = calculate_score(
        required_skills,
        candidate_skills
    )

    return {
        "matched_skills": matched_skills,
        "missing_skills": missing_skills,
        "score": score
    }


def rank_candidates(job_description, candidates):

    results = []

    for candidate in candidates:

        name = candidate.get(
            "name",
            "Unknown"
        )

        resume_text = candidate.get(
            "resume_text",
            ""
        )

        result = match_resume(
            job_description,
            resume_text
        )

        results.append({
            "name": name,
            "score": result["score"],
            "matched_skills": result[
                "matched_skills"
            ],
            "missing_skills": result[
                "missing_skills"
            ]
        })

    results.sort(
        key=lambda x: x["score"],
        reverse=True
    )

    for i in range(len(results)):
        results[i]["rank"] = i + 1

    return results