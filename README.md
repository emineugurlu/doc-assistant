# Doc Assistant 📄🤖

> AI-powered document analysis platform that allows users to upload PDF/TXT files, generate summaries, search content, and ask intelligent questions about their documents instantly.

---

## 🚀 Preview

<img width="1900" height="866" alt="image" src="https://github.com/user-attachments/assets/e4ab7db1-a8ab-4657-9e4a-5e849786acfe" />

✨ Features
📄 Upload PDF and TXT documents
🤖 AI-generated summaries
💬 Ask questions about uploaded documents
🔍 Search keywords inside files
🗂️ View uploaded document list
🗑️ Delete documents
⚡ Fast and responsive interface
🧠 Gemini AI integration
🏗️ Clean and scalable backend architecture

🛠️ Tech Stack
Backend
FastAPI
Python
SQLite
Pydantic
AI
Gemini API
Frontend
HTML
CSS
JavaScript

📁 Project Structure
DOC-ASSISTANT/
├── frontend/               # User interface components
│   ├── index.html          # Main application page
│   └── app.js              # API request handling and dynamic UI logic
├── routers/                # API Endpoints (Routing Layer)
│   ├── ai_chat.py          # Logic for Gemini-powered chat interactions
│   ├── search.py           # In-document keyword search engine
│   └── upload.py           # File upload and document management
├── services/               # Business Logic Layer
│   ├── ai_service.py       # Gemini API integration and prompt engineering
│   └── file_processor.py   # PDF/TXT parsing and text chunking logic
├── .env                    # Environment variables (API Keys, Secrets)
├── .gitignore              # Files to be excluded from Version Control
├── database.py             # SQLite connection and CRUD operations
├── doc_assistant.db        # Local SQLite database file
├── LICENSE                 # Project licensing information
├── main.py                 # Application entry point (FastAPI/Flask)
├── models.py               # Pydantic/SQLAlchemy data models
├── README.md               # Project documentation
└── requirements.txt        # List of Python dependencies

⚙️ Installation
git clone https://github.com/emineugurlu/doc-assistant.git

cd doc-assistant

pip install -r requirements.txt

uvicorn main:app --reload

🧪 How to Use
1️⃣ Upload a PDF or TXT file
2️⃣ Select your document
3️⃣ Ask questions to AI
4️⃣ Generate summaries
5️⃣ Search any keyword inside document

🧠 Why This Project?
This project was built to simplify document reading and analysis using artificial intelligence.
Instead of manually reading long files, users can upload documents and instantly:
Understand content faster
Get summaries
Ask direct questions
Find important information quickly

👩‍💻 Developer

Emine Uğurlu
Computer Engineer

⭐ Support
If you like this project, give it a star ⭐ on GitHub

