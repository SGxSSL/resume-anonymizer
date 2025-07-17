# main.py
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import FileResponse
# 1. UPDATED: Import the Gemini function from the correct file
from anonymizer import parse_resume_to_json_gemini
from formatter import format_resume_from_json
import os
import uuid
import shutil
import pdfplumber
from docx import Document
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = FastAPI(
    title="Resume Anonymizer API",
    description="Upload a resume (PDF or DOCX), and get an anonymized, formatted DOCX back using Google Gemini.",
)

# Define directories for uploads, outputs, and templates
UPLOAD_DIR = "uploads"
OUTPUT_DIR = "outputs"
TEMPLATE_DIR = "templates"
# Create directories if they don't exist
os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(OUTPUT_DIR, exist_ok=True)
os.makedirs(TEMPLATE_DIR, exist_ok=True) # Ensure template directory exists

# --- Note on Templates ---
# The formatter.py file uses a template: Document("templates/company_template.docx")
# Make sure you have a file named 'company_template.docx' inside a 'templates' folder.
# If you don't have one, create a simple empty .docx file at that location.

@app.post("/process-resume/", tags=["Resume Processing"])
async def process_resume(file: UploadFile = File(..., description="A resume file in .pdf or .docx format.")):
    """
    Processes an uploaded resume file:
    1. Extracts text content.
    2. Anonymizes the content using the Google Gemini API.
    3. Formats the anonymized data into a new DOCX file based on a template.
    4. Returns the generated DOCX file for download.
    """
    file_extension = os.path.splitext(file.filename)[1].lower()
    if file_extension not in [".pdf", ".docx"]:
        raise HTTPException(status_code=400, detail="Unsupported file type. Please upload a .pdf or .docx file.")

    file_id = str(uuid.uuid4())
    input_path = os.path.join(UPLOAD_DIR, f"{file_id}{file_extension}")

    try:
        # Save the uploaded file temporarily
        with open(input_path, "wb") as f:
            shutil.copyfileobj(file.file, f)

        # Extract text from the saved file
        text = ""
        if file_extension == ".pdf":
            try:
                with pdfplumber.open(input_path) as pdf:
                    text = "\n".join(page.extract_text() for page in pdf.pages if page.extract_text())
            except Exception as e:
                raise HTTPException(status_code=500, detail=f"Failed to extract text from PDF: {e}")
        elif file_extension == ".docx":
            try:
                doc = Document(input_path)
                text = "\n".join(p.text for p in doc.paragraphs)
            except Exception as e:
                raise HTTPException(status_code=500, detail=f"Failed to extract text from DOCX: {e}")
        
        if not text.strip():
            raise HTTPException(status_code=400, detail="Could not extract any text from the uploaded document.")

        # 2. UPDATED: Call the Gemini parsing function
        try:
            parsed_data = parse_resume_to_json_gemini(text)
            print(parsed_data)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to parse resume with the AI model: {e}")

        # 3. Format the parsed JSON into a new DOCX using the formatter
        original_filename = os.path.splitext(os.path.basename(file.filename))[0]
        output_filename = f"{original_filename}_anonymized.docx"
        output_path = os.path.join(OUTPUT_DIR, f"{file_id}_{output_filename}")
        
        try:
            format_resume_from_json(parsed_data, output_path)
        except Exception as e:
            # This can happen if the template file is missing
            raise HTTPException(status_code=500, detail=f"Failed to format the document. Ensure 'templates/company_template.docx' exists. Error: {e}")

        # 4. Return the formatted file as a response
        return FileResponse(
            path=output_path,
            filename=output_filename,
            media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        )
    except Exception as e :
        return e
    finally:
        # 5. Clean up the uploaded file from the server after the request is complete
        if os.path.exists(input_path):
            os.remove(input_path)