# Personal Gemini Journal

A secure, full-stack journaling application using Google's Gemini AI for empathetic reflections, mood tracking, and thematic insights. Built with React, Tailwind, Express, and Firebase.

## Key Features
- **AI Journaling**: Conversational AI assistant for guided reflection.
- **Analytics**: Track mood history and visualize emotional trends.
- **AI Insights**: Auto-generate summaries and extract core themes.
- **Memory Vault**: Save important breakthrough moments securely.

## Architecture & Security
- **Firebase Auth**: Secure user authentication and session management.
- **Firestore Data Isolation**: Strict `firestore.rules` ensure users can only access their own data (`request.auth.uid == resource.data.userId`).
- **Gemini API & Secret Manager**: The `GEMINI_API_KEY` is securely stored in Secret Manager and strictly accessed via the Node.js Express backend. The React frontend never exposes API keys.
- **Cloud Run Deployment**: Bundles the Vite frontend and Express API into a single, scalable Node.js container (`dist/server.cjs`).

## Local Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Environment Variables**: Create a `.env` file based on `.env.example`:
   ```env
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
npm run build  # Compiles frontend (dist/) and backend (dist/server.cjs)
npm start      # Starts the production Express server on port 3000
```
