# 🚀 AI Portfoliio-Genrator

**Portfolio Generator** is a simple tool that creates a professional portfolio from your **resume or manually entered information**.  
Upload your resume or fill in your details, customize your portfolio, and showcase your **skills, projects, education, and experience** in a clean, 
responsive design.


The application combines Gemini AI, OCR, PyMuPDF, Tesseract, Python, Flask, HTML, CSS, and JavaScript to simplify the process of creating a personal portfolio.


# 🎯 **Features**

📄 Upload resumes in PDF and image formats

🔍 Extract text from PDF documents

👁️ OCR support for scanned documents

🤖 AI-powered resume parsing using Gemini

🧑‍💻 Automatically extract:

     Personal information
     Skills
     Education
     Experience
     Projects
     
✏️ Edit extracted information before generating the portfolio

🎨 Multiple portfolio design templates

🔗 Add GitHub, LinkedIn and other social links

📜 Certificate upload support

📱 Responsive web interface



# 🧠 HOW IT WORKS 

Resume Upload
      ↓
PDF / Image Detection
      ↓
Text Extraction
      ↓
OCR for Scanned Documents
      ↓
Gemini AI Processing
      ↓
Structured Resume Data
      ↓
User Editing
      ↓
Portfolio Generation


| Technology | Purpose                   |
| ---------- | ------------------------- |
| Python     | Backend logic             |
| Flask      | Web server                |
| Gemini API | AI-powered resume parsing |
| PyMuPDF    | PDF text extraction       |
| Tesseract  | OCR                       |
| Pillow     | Image processing          |
| HTML       | Structure                 |
| CSS        | Styling                   |
| JavaScript | Frontend interaction      |
Architecture diagram
                  ┌─────────────────┐
                  │   Resume File   │
                  └────────┬────────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │  Flask Backend  │
                  └────────┬────────┘
                           │
                 ┌─────────┴─────────┐
                 ▼                   ▼
          ┌─────────────┐     ┌─────────────┐
          │  PyMuPDF    │     │  Tesseract  │
          │ PDF Extract │     │     OCR     │
          └──────┬──────┘     └──────┬──────┘
                 │                   │
                 └─────────┬─────────┘
                           ▼
                  ┌─────────────────┐
                  │   Gemini API    │
                  │  JSON Parsing   │
                  └────────┬────────┘
                           ▼
                  ┌─────────────────┐
                  │ Portfolio Data  │
                  └────────┬────────┘
                           ▼
                  ┌─────────────────┐
                  │ HTML Portfolio  │
                  └─────────────────┘
