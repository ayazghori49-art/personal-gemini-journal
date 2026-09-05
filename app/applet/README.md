# Personal Gemini Journal

A secure, production-ready journaling application that leverages Google's Gemini AI to provide empathetic interactions, moment summarization, mood tracking, and thematic insights. Built with React, Tailwind CSS, Express, and Firebase.

## Project Overview

Personal Gemini Journal goes beyond a simple digital diary. It acts as an empathetic AI companion that helps users reflect on their thoughts, organizes their emotional history, and provides insightful summaries of their journaling patterns over time. The application is built with a strong focus on data privacy and security.

## Key Features

- **Interactive AI Journaling**: Chat with an empathetic AI assistant that helps unpack thoughts and feelings.
- **Analytics & Insights**: Track mood history, visualize mood trends, and identify top emotional themes.
- **AI-Powered Summaries**: Automatically generate concise summaries of journal entries over customizable time ranges (days, weeks, months).
- **Saved Moments & Memories**: Extract and save important memories, facts, and breakthrough moments securely to the database.

## Architecture & Security

### Firebase Authentication
User identity and sessions are securely managed via Firebase Authentication. Users must authenticate to access their journal, ensuring all interactions are private.

### Firestore User Data Isolation & Security Rules
All journal entries, chat histories, saved moments, and summaries are stored in Cloud Firestore. The database enforces strict security rules (`firestore.rules`) to guarantee strong **data isolation**.
- Authentication is required for any database interaction.
- Documents are rigidly isolated using `request.auth.uid == resource.data.userId`.
- Users can exclusively read, create, update, and delete their own data; cross-user access is impossible.

### Gemini API Integration
The application uses the `@google/genai` SDK to power its conversational and analytical features. Interactions include:
- Empathetic conversational responses
- Image generation capabilities (`gemini-3.1-flash-lite-image`)
- Summarization and data extraction (e.g., pulling themes from unstructured text)

### API Key Security & Secret Manager
To protect sensitive credentials, the application employs a **full-stack architecture**. 
- The React frontend never exposes the Gemini API key.
- All AI requests are securely proxied through an Express Node.js backend (`server.ts`).
- The backend verifies Firebase Auth ID tokens before fulfilling any AI requests.
- `GEMINI_API_KEY` is securely injected into the environment (managed via Google Cloud Secret Manager in production).

### Cloud Run Deployment
The application is optimized for containerized deployment on Google Cloud Run. 
- The `npm run build` step bundles the React frontend using Vite and compiles the Express server using ESBuild into a single executable `dist/server.cjs`.
- The production server serves both the static frontend assets and the secure API routes, allowing seamless horizontal scaling and scale-to-zero capabilities.

## Local Setup

### Prerequisites
- Node.js (v18 or higher recommended)
- A Firebase project (initialized via `firebase-applet-config.json`)

### Installation

1. Clone the repository and install dependencies:
   ```bash
   npm install
   ```

2. Configure Environment Variables:
   Create a `.env` file in the root directory matching the provided `.env.example`:
   ```env
   # GEMINI_API_KEY: Required for Gemini AI API calls.
   GEMINI_API_KEY="your_gemini_api_key_here"
   
   # APP_URL: The URL where this application is hosted.
   APP_URL="http://localhost:3000"
   ```

3. Run the Development Server:
   ```bash
   npm run dev
   ```
   The application will be accessible at `http://localhost:3000`.

## Deployment

To build and deploy the application for production (e.g., on Google Cloud Run):

1. **Build the Application**:
   ```bash
   npm run build
   ```
   This compiles the frontend SPA into `dist/` and the backend server into `dist/server.cjs`.

2. **Start the Production Server**:
   ```bash
   npm start
   ```
   *(Ensure environment variables like `GEMINI_API_KEY` are populated in your production environment's Secret Manager).*
