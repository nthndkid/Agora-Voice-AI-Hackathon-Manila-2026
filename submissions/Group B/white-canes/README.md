# gabAI - Voice AI Study Buddy 🇵🇭

**gabAI** (formerly Gabay) is a Filipino AI-powered study companion designed to help students prepare for board and licensure exams. It provides a natural, human-like voice and video interaction, active recall sessions, and structured progress tracking.

## 🚀 Key Features
- **Voice & Video Chat**: Real-time interaction with an AI tutor powered by Agora.
- **Supportive Persona**: Speaks in "Taglish" (Filipino/English mix) to sound like a supportive *ate* or *kuya*.
- **Modern Dashboard**: Track study time, average scores, and topic proficiency.
- **Active Recall**: Engage in conversational study sessions to reinforce learning.

## 🛠️ Tech Stack
- **Frontend**: React, Vite, Tailwind CSS, Agora RTC SDK.
- **Backend**: Node.js, Express, Agora Token SDK.
- **AI Engine**: Gemini 2.0 Flash (LLM), MiniMax (TTS), Anam/HeyGen (Video Avatar).

## 📂 Project Structure
```
submissions/Group B/white-canes/
  ├── Deck & Demo/         # Pitch deck and demo video
  ├── TRAE_USAGE/          # Documentation on AI-assisted development
  ├── Source Code/         # Fully working source code (Node.js + React)
  └── README.md            # This file
```

## 🤖 AI Development (TRAE Usage)
This project was built with the heavy assistance of **Trae IDE**. For a detailed breakdown of how we used AI for architectural planning, rapid iteration, and specialized agent workflows, see the **[TRAE_USAGE Documentation](./TRAE_USAGE/README.md)**.

## ⚙️ Setup & Execution
Detailed instructions for setting up the backend and frontend are located in the **[Source Code README](./Source%20Code/gabAI-app/README.md)**.

## ⚠️ Project Status & Technical Notes
While we successfully built out the **complete high-fidelity frontend platform** and a **structured backend architecture**, we encountered significant technical blockers with the Agora Agent API integration (specifically 400 Bad Request errors and authentication challenges) that prevented a fully functional real-time session.

**However, we are submitting this as a "High-Fidelity Concept, Architectural Proof, & Hackathon Deliverables":**
- **UI/UX Completion**: All dashboard, session, and progress visuals are fully implemented and mobile-responsive.
- **Architectural Readiness**: The backend is pre-configured for Gemini, MiniMax, and Anam/HeyGen, ready for production once API handshakes are resolved.
- **Vision Realization**: We've demonstrated the full "gabAI" experience through our design, prompt engineering, and visual proofs.

---
*Developed by Group B - White Canes for the Agora Voice AI Hackathon Manila 2026.*
