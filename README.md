# Resume Anonymizer

A web application that anonymizes resumes by removing personal information while preserving the professional content. Built with FastAPI (Backend) and Next.js (Frontend).

## Features

- Upload multiple resumes (PDF/DOCX format)
- Process files in parallel
- Real-time processing status
- Instant download of processed files
- Professional formatting with company branding

## Project Structure

```
resume-anonymizer/
├── backend/              # FastAPI backend
│   ├── templates/       # Document templates and assets
│   ├── uploads/        # Temporary upload directory
│   ├── outputs/        # Processed files directory
│   ├── main.py        # Main FastAPI application
│   ├── anonymizer.py  # Resume anonymization logic
│   ├── formatter.py   # Document formatting logic
│   └── requirements.txt
└── frontend/           # Next.js frontend
    ├── app/           # Next.js app directory
    └── public/        # Static assets
```

## Setup

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Start the backend server:
   ```bash
   uvicorn main:app --reload
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Usage

1. Access the application at `http://localhost:3000`
2. Upload one or more resumes (PDF or DOCX format)
3. Watch the real-time processing status
4. Download anonymized resumes as they become available

## Environment Variables

Create a `.env` file in the backend directory with the following variables:

```env
GOOGLE_API_KEY=your_google_api_key
```

## Contributing

1. Fork the repository
2. Create a new branch for your feature
3. Submit a pull request
