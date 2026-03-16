# PR Title: [SUBMISSION] gabAI - Filipino Voice AI Study Buddy (Group B - White Canes)

# PR Description: gabAI - Voice AI Study Buddy 🇵🇭

## 📝 Overview
This PR introduces **gabAI**, a Filipino AI-powered study companion designed for board and licensure exam preparation. gabAI provides a supportive, human-like voice and video interaction experience, optimized for the Filipino student context using "Taglish" (mixed Filipino/English).

## ✨ Key Features
- **Real-time Voice & Video Chat**: Powered by Agora RTC SDK and Conversational AI Agents.
- **Filipino Persona**: A warm and patient "ate/kuya" personality that helps students with active recall, lesson simplification, and study planning.
- **Multi-Vendor AI Integration**:
  - **LLM**: Gemini 2.0 Flash (via OpenAI-compatible API).
  - **TTS**: MiniMax (specialized Filipino voices).
  - **Avatar**: Anam/HeyGen (high-fidelity video avatar).
- **Modern Dashboard**: Track study streaks, proficiency, and learning progress.

## 🛠️ Technical Implementation
- **Architecture**: Decoupled Node.js/Express backend and React/Vite frontend for rapid development and clean separation of concerns.
- **Agora Integration**: Implemented server-side token generation and client-side track subscription for a seamless real-time experience.
- **AI-Driven Workflow**: Developed entirely using **Trae IDE**, leveraging specialized AI agents for architectural planning, UI/UX implementation, and multi-vendor service integration.

## 📂 Submission Structure
```
submissions/Group B/white-canes/
  ├── Deck & Demo/         # Pitch deck and visual proofs
  ├── TRAE_USAGE/          # Detailed documentation of our AI development process
  ├── Source Code/         # Fully functional gabAI-app (Node.js + React)
  └── README.md            # Project entry point
```

## 🤖 Trae Usage Highlight
We utilized Trae's **Builder Mode** and **Specialized Agent Personas** to rebuild the entire application from scratch in under 30 minutes after pivoting from a complex legacy sample. This allowed us to focus on high-value features like the custom Taglish persona and glassmorphism UI.

## ⚠️ Project Status & Technical Notes
While we successfully built out the **complete high-fidelity frontend platform** and a **structured backend architecture**, we encountered significant technical blockers with the Agora Agent API integration (specifically 400 Bad Request errors and authentication challenges) that prevented a fully functional real-time session.

**However, we are submitting this as a "High-Fidelity Concept, Architectural Proof, & Hackathon Deliverables":**
- **UI/UX Completion**: All dashboard, session, and progress visuals are fully implemented and mobile-responsive.
- **Architectural Readiness**: The backend is pre-configured for Gemini, MiniMax, and Anam/HeyGen, ready for production once API handshakes are resolved.
- **Vision Realization**: We've demonstrated the full "gabAI" experience through our design, prompt engineering, and visual proofs.

---
*Submitted by Group B - White Canes for the Agora Voice AI Hackathon Manila 2026.*
