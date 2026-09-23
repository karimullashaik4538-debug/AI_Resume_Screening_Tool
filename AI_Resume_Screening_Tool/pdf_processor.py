from PyPDF2 import PdfReader
import os
import re


UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

ALLOWED_EXTENSIONS = {"pdf"}


def allowed_file(filename):
    return (
        "." in filename
        and filename.rsplit(".", 1)[1].lower()
        in ALLOWED_EXTENSIONS
    )


def extract_text_from_pdf(file_path):
    try:
        reader = PdfReader(file_path)

        text = ""

        for page in reader.pages:
            page_text = page.extract_text()

            if page_text:
                text += page_text + "\n"

        return text

    except Exception as e:
        raise Exception(
            "PDF reading failed: " + str(e)
        )


def clean_text(text):
    if not text or not text.strip():
        return ""

    text = text.lower()
    text = re.sub(
        r"[^\w\s@.+#/-]",
        " ",
        text
    )
    text = re.sub(
        r"\s+",
        " ",
        text
    )

    return text.strip()