from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os, json, uuid, fitz, pytesseract
from PIL import Image
from dotenv import load_dotenv
import google.generativeai as genai
from werkzeug.utils import secure_filename

# 1. SETUP & ENV
load_dotenv()
app = Flask(__name__)
CORS(app)

# 2. GEMINI CONFIG (Free Tier Optimized)
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    print("WARNING: GEMINI_API_KEY not found in .env!")
else:
    genai.configure(api_key=GEMINI_API_KEY)
    # Using standard flash model for free tier
    model = genai.GenerativeModel('gemini-1.5-flash')

# 3. DIRECTORIES
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploads")
CERT_FOLDER = os.path.join(UPLOAD_FOLDER, "certificates")
os.makedirs(CERT_FOLDER, exist_ok=True)

# 4. TESSERACT PATH (Update this if your Tesseract is installed elsewhere)
TESS_PATH = r"C:\Program Files\Tesseract-OCR\tesseract.exe"
if os.path.exists(TESS_PATH):
    pytesseract.pytesseract.tesseract_cmd = TESS_PATH
    HAS_TESSERACT = True
else:
    HAS_TESSERACT = False

# 5. THE AI PARSING FUNCTION
def parse_resume_with_gemini(resume_text):
    prompt = f"Extract resume details into JSON. Fields: name, email, phone, about, skills (array), education (array), projects (array), experience (array). Resume Text: {resume_text}. IMPORTANT: Return ONLY the JSON object, no other text."
    
    try:
        response = model.generate_content(prompt)
        raw_text = response.text
        
        # This part aggressively cleans the text to find the JSON
        if "{" in raw_text:
            raw_text = raw_text[raw_text.find("{"):raw_text.rfind("}")+1]
        
        data = json.loads(raw_text)
        return data
    except Exception as e:
        print(f"Gemini Error: {e}")
        # If it fails, we return a blank template instead of 'User'
        return {"name": "", "about": "", "skills": [], "education": [], "experience": [], "projects": []}
# 6. ROUTES
@app.route("/")
def home():
    return send_from_directory(".", "index.html")

@app.route("/upload", methods=["POST"])
def upload():
    file_path = None
    try:
        file = request.files.get("resume")
        if not file: return jsonify({"error": "No file"}), 400
        
        file_path = os.path.join(UPLOAD_FOLDER, f"{uuid.uuid4().hex}.pdf")
        file.save(file_path)
        
        # Extract text
        text = ""
        doc = fitz.open(file_path)
        for page in doc:
            text += page.get_text()
        doc.close()

        if not text.strip() and HAS_TESSERACT:
            # Fallback to OCR if PDF is a scanned image
            text = pytesseract.image_to_string(Image.open(file_path))

        if not text.strip():
            return jsonify({"error": "Resume is unreadable"}), 400

        # Call the Gemini Parser
        parsed_data = parse_resume_with_gemini(text)

        return jsonify({
            "success": True, 
            "data": parsed_data, 
            "resume_text": text
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if file_path and os.path.exists(file_path):
            os.remove(file_path)

@app.route("/upload-certificate", methods=["POST"])
def upload_cert():
    file = request.files.get("certificate")
    name = f"{uuid.uuid4().hex}.pdf"
    file.save(os.path.join(CERT_FOLDER, name))
    return jsonify({"success": True, "url": f"/uploads/certificates/{name}"})

@app.route("/uploads/certificates/<f>")
def get_cert(f):
    return send_from_directory(CERT_FOLDER, f)

@app.route("/<path:f>")
def static_files(f):
    return send_from_directory(".", f)

if __name__ == "__main__":
    app.run(port=5000, debug=True)