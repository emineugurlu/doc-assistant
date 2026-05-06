# 📄🤖 Doc Assistant: Intelligent Document Analysis Ecosystem

> **"A high-performance, AI-driven platform designed to revolutionize document interaction. By leveraging the Gemini API and a robust FastAPI backend, Doc Assistant enables users to distill complex PDF/TXT data into actionable insights through automated summarization and semantic Q&A."**

![AI](https://img.shields.io/badge/AI-Gemini%20API-blueviolet?style=for-the-badge&logo=google-gemini&logoColor=white)
![Backend](https://img.shields.io/badge/Backend-FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![Database](https://img.shields.io/badge/Database-SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white)
![Status](https://img.shields.io/badge/Status-Active-success?style=for-the-badge)

**Doc Assistant** is a professional-grade analysis tool developed by **Emine Uğurlu**. It addresses the challenge of information overload by providing a scalable environment for instant document parsing, keyword search, and intelligent dialogue with static files.

---

## 🚀 Engineering & AI Excellence

This project showcases advanced backend orchestration and AI service integration:

* **Gemini AI Integration:** Implementation of sophisticated prompt engineering within `ai_service.py` to deliver high-context summaries and precise Q&A.
* **Asynchronous Backend Architecture:** Utilizing **FastAPI** to manage non-blocking I/O operations for seamless file uploads and real-time AI processing.
* **Document Parsing Engine:** Robust text extraction and chunking logic for PDF and TXT formats handled by a dedicated `file_processor.py`.
* **Relational Data Management:** Structured storage of document metadata and user interactions using **SQLite** with efficient CRUD operations.
* **Scalable Routing Layer:** Modular API design with separate routers for AI chat, search, and document management.

## ✨ Core Features

* 🧠 **Semantic Q&A:** Ask complex questions and receive context-aware answers directly from your documents.
* 📝 **Automated Summarization:** Instantly generate executive summaries for long-form PDF and TXT files.
* 🔍 **Precision Search:** Deep-file keyword search engine to locate critical information across your library.
* 🗂️ **Document Management:** Fully interactive dashboard to upload, view, and manage your analyzed documents.

## 📸 Interface Showcase

<p align="center">
  <img src="https://github.com/user-attachments/assets/e4ab7db1-a8ab-4657-9e4a-5e849786acfe" width="100%" alt="Doc Assistant Platform Preview" />
</p>

---

## 🛠️ Tech Stack

* **Backend:** FastAPI, Python, Pydantic.
* **AI Engine:** Google Gemini API.
* **Database:** SQLite.
* **Frontend:** HTML5, CSS3, JavaScript (Vanilla).

---

## ⚙️ Installation & Setup

1. **Clone the Repository:**
   ```bash
   git clone [https://github.com/emineugurlu/doc-assistant.git](https://github.com/emineugurlu/doc-assistant.git)
   cd doc-assistant
   ````
   
2.**Environment Configuration:**
Create a .env file and add your GEMINI_API_KEY.

3.**Install Dependencies:**
  ````bash
  pip install -r requirements.txt
  ````
4.**Launch the Server:**
````bash
  uvicorn main:app --reload
````

Developed by Emine Uğurlu - Computer Engineer
Empowering document intelligence through advanced engineering.
