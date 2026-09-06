# Personal Gemini Journal

*Built for the Google Cloud Gen AI Academy APAC Ideathon Challenge*

A secure, full-stack AI journaling application that leverages Google's Gemini AI to provide empathetic interactions, moment summarization, mood tracking, and thematic insights. 

## Overview
Personal Gemini Journal goes beyond a simple digital diary. It acts as an empathetic AI companion that helps users reflect on their thoughts, organizes their emotional history, and provides insightful summaries of their journaling patterns over time. The application is built with a strong focus on data privacy, security, and an enriching user experience.

## Unique Features
- **Multiple Conversation Modes**: Tailor the AI's conversational style and persona to fit your current reflective needs.
- **Multi-Perspective Answers**: Gain different viewpoints on your journal entries to foster personal growth and deeper understanding.
- **Analytics Dashboard & Mood Tracking**: Visualize your emotional journey, track mood history over time, and see data-driven insights.
- **Memory Vault & Theme Extraction**: Automatically generate concise summaries and securely extract core themes, facts, and breakthrough moments.
- **Google Sign-In**: Seamless and secure onboarding using Google Authentication.

## Tech Stack
- **Google AI Studio**: Core development and AI agent environment.
- **Gemini API**: Powers the conversational AI, thematic analysis, multi-perspective reflections, and intelligent summarization.
- **Firebase Authentication**: Secures user identities and manages robust sessions, including Google Sign-In.
- **Cloud Firestore**: Scalable NoSQL cloud database for persistent data storage.
- **Google Cloud Secret Manager**: Securely stores API keys and sensitive environment variables.
- **React & Tailwind CSS**: Frontend user interface framework.
- **Express (Node.js)**: Backend server handling secure API proxying and validation.

## Security & Threat Modeling
Security and data privacy are foundational to this architecture:
- **Firestore Data Isolation**: Strict `firestore.rules` guarantee that users can only access their own data (`request.auth.uid == resource.data.userId`). Cross-user data leakage is cryptographically blocked at the database level.
- **No Hardcoded Keys**: The React frontend never exposes the `GEMINI_API_KEY`. 
- **Secure API Proxying**: All AI requests route through the Express Node.js backend (`server.ts`). The backend verifies Firebase Auth ID tokens before fulfilling any AI requests, mitigating client-side tampering or unauthorized API consumption.
- **Cloud Run Deployment**: The production build runs in a sandboxed, containerized environment with strict egress and ingress controls.

## Local Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Environment Variables**: Create a `.env` file based on `.env.example`:
   ```env
   # Securely injected by AI Studio / Secret Manager in production
   GEMINI_API_KEY="your_gemini_api_key_here"
   APP_URL="http://localhost:3000"
   ```

3. **Run Development Server**:
   ```bash
   npm run dev
   ```

## Deployment
Deploy seamlessly to Google Cloud Run:
```bash
npm run build  # Compiles Vite frontend and ESBuild Express server
npm start      # Starts the production Express server on port 3000
```
