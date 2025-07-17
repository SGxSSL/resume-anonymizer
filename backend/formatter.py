# formatter.py
from docx import Document
import os

TEMPLATE_DIR = os.path.join(os.path.dirname(__file__), "templates")

def format_resume_from_json(data: dict, output_path: str, template_filename: str = "company_template.docx"):
    template_path = os.path.join(TEMPLATE_DIR, template_filename)
    doc = Document(template_path)

    doc.add_heading(data.get("Name", ""), level=0)

    if summary := data.get("Summary"):
        doc.add_heading("Summary", level=1)
        doc.add_paragraph(summary)

    if skills := data.get("Skills"):
        doc.add_heading("Skills", level=1)
        doc.add_paragraph(", ".join(skills))

    if exp_list := data.get("Experience"):
        doc.add_heading("Experience", level=1)
        for exp in exp_list:
            doc.add_paragraph(f"{exp['job_title']} at {exp['company']} ({exp['dates']})")
            doc.add_paragraph(exp['description'])

    if edu_list := data.get("Education"):
        doc.add_heading("Education", level=1)
        for edu in edu_list:
            doc.add_paragraph(f"{edu['degree']} at {edu['school']} ({edu['dates']})")
            doc.add_paragraph(edu['description'])

    doc.save(output_path)
