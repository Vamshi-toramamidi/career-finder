from fastapi import APIRouter, UploadFile, Form, File
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from models import SessionLocal, User
import fitz  # PyMuPDF for PDF parsing

router = APIRouter()

def get_db():
    db = SessionLocal() # Create a new database session
    try:
        yield db # Yield the session to the route handler
    finally:
        db.close() # Close the session after the request is completed


@router.post("/upload-resume")
async def upload_resume(resume: UploadFile = File(...), desired_role: str = Form(...)):
    content = await resume.read()
    text = ""

    if resume.filename.endswith(".pdf"):
        with open("tresume.pdf", "wb") as f:
            f.write(content)
        with fitz.open("tresume.pdf") as doc:
            text = "\n".join(page.get_text() for page in doc)
            