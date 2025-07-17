# anonymizer.py
import google.generativeai as genai
import os
import json
from dotenv import load_dotenv
load_dotenv()

# Configure the Gemini API key
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

def parse_resume_to_json_gemini(resume_text: str) -> dict:
    """
    Parses resume text to JSON using the Google Gemini API, anonymizing personal information.
    """
    # System prompt defining the role and constraints of the AI
    system_prompt = (
        "You are a professional resume parser and anonymizer. "
        "Your job is to extract only professional information "
        "from resumes and strictly remove ALL personal information "
        "EXCEPT for the person's name. Never include phone numbers, "
        "email addresses, home addresses, LinkedIn URLs, or social media profiles."
    )

    # User prompt with instructions and the resume text
    user_prompt = f"""
Given this resume text:

\"\"\"
{resume_text}
\"\"\"

1. Parse it and output valid JSON with these keys:
- Name (string)
- Summary (string)
- Skills (array of strings)
- Experience (array of objects: job_title, company, dates, description)
- Education (array of objects: degree, school, dates, description)

2. Do not include any phone number, email, address, links, or personal identifiers other than the name.

3. Make sure your JSON is clean and does not contain any keys with personal information.

Return ONLY the JSON.
"""

    # Initialize the Generative Model with the system prompt
    model = genai.GenerativeModel(
        model_name='gemini-2.5-pro',
        system_instruction=system_prompt
    )

    # Generate content with the specified JSON output format
    response = model.generate_content(
        user_prompt,
        generation_config={"response_mime_type": "application/json"}
    )

    # Return parsed JSON from the model's response text
    try:
        return json.loads(response.text)
    except json.JSONDecodeError as e:
        # Optionally, log the error or the response for debugging
        raise ValueError(f"Failed to parse JSON from Gemini response: {e}\nResponse text: {response.text}")
