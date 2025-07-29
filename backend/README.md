# Resume Anonymizer Backend

FastAPI backend for the Resume Anonymizer application.

## Components

- `main.py`: FastAPI application and API endpoints
- `anonymizer.py`: Resume text extraction and anonymization using Google's Gemini API
- `formatter.py`: Document formatting and generation using python-docx
- `templates/`: Contains document templates and assets
- `uploads/`: Temporary storage for uploaded files
- `outputs/`: Storage for processed anonymized resumes

## Setup

1. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Create `.env` file with:
   ```
   GOOGLE_API_KEY=your_google_api_key
   ```

4. Run the server:
   ```bash
   uvicorn main:app --reload
   ```

## API Endpoints

- `POST /anonymize-single`: Process a single resume
  - Input: Form data with 'file' field (PDF/DOCX)
  - Output: JSON with download URL

- `GET /download/{filename}`: Download processed resume
  - Input: Filename in path
  - Output: DOCX file download

## Document Templates

Place your templates in the `templates/` directory:
- `company_template.docx`: Base template for formatted resumes
- `company_logo.png`: Company logo for branding
