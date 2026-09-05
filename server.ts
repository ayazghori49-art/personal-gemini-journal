import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import * as admin from 'firebase-admin';
import { getAuth } from 'firebase-admin/auth';
import config from './firebase-applet-config.json' with { type: 'json' };

// Initialize Firebase Admin for verifying ID tokens securely
admin.initializeApp({
  projectId: config.projectId
});


// Candidate models in order of priority
const CANDIDATE_MODELS = ['gemini-3.8-flash', 'gemini-3.1-flash-lite'];

async function generateContentStreamWithFallback(
  ai,
  params
) {
  let lastError = null;
  for (const model of CANDIDATE_MODELS) {
    try {
      const responseStream = await ai.models.generateContentStream({
        model,
        contents: params.contents,
        config: params.config,
      });
      return { responseStream, model };
    } catch (err) {
      // suppressed console.warn
      lastError = err;
      continue;
    }
  }
  throw lastError;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));

  // Initialize Gemini Client
  // API Key is automatically injected from Google Cloud Secret Manager via AI Studio environment
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY, httpOptions: { headers: { 'User-Agent': 'aistudio-build' } } });

  // API route for healthcheck
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  // API route for Gemini chat
  app.post('/api/chat', async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Unauthorized: Missing or invalid token' });
        return;
      }
      
      const idToken = authHeader.split('Bearer ')[1];
      // Secure the endpoint by verifying the Firebase Auth ID token
      try {
        await getAuth().verifyIdToken(idToken);
      } catch (authErr) {
        res.status(401).json({ error: 'Unauthorized: Invalid or expired token' });
        return;
      }

      const { contents, systemInstruction, responseMimeType } = req.body;
      if (!contents || !Array.isArray(contents)) {
        res.status(400).json({ error: 'Missing or invalid contents' });
        return;
      }

      const generateImageTool = {
        name: "generate_image",
        description: "Generate an illustrative image to help explain a concept visually.",
        parameters: {
          type: Type.OBJECT,
          properties: {
            prompt: {
              type: Type.STRING,
              description: "The text prompt to generate an image from."
            }
          },
          required: ["prompt"]
        }
      };

      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      const { responseStream } = await generateContentStreamWithFallback(ai, {
         contents: contents,
         config: {
           systemInstruction: systemInstruction || "You are a helpful, empathetic journaling assistant. Help the user reflect on their thoughts, brainstorm ideas, and organize their feelings. Be concise and conversational.",
           responseMimeType: responseMimeType || "text/plain",
           tools: responseMimeType === "application/json" ? undefined : [{ functionDeclarations: [generateImageTool] }]
         }
      });
      
      let imageUrl = undefined;
      let handledToolCall = false;
      let isFirstChunk = true;
      
      for await (const chunk of responseStream) {
        if (isFirstChunk && chunk.functionCalls && chunk.functionCalls.length > 0) {
          handledToolCall = true;
          const call = chunk.functionCalls[0];
          if (call.name === 'generate_image') {
            res.write(`data: ${JSON.stringify({ status: 'Generating image...' })}\n\n`);
            try {
              const imageRes = await ai.models.generateContent({
                model: 'gemini-3.1-flash-lite-image',
                contents: { parts: [{ text: call.args.prompt }] }
              });
              let base64Image = undefined;
              for (const part of imageRes.candidates[0].content.parts) {
                if (part.inlineData) {
                  base64Image = part.inlineData.data;
                  break;
                }
              }
              if (base64Image) {
                imageUrl = `data:image/jpeg;base64,${base64Image}`;
              }
            } catch (imgError) {
              if (imgError?.status === 503 || imgError?.status === 429 || String(imgError?.message).includes('503') || String(imgError?.message).includes('429')) { console.log('API High demand or quota error in image generation'); } else { console.error('Image generation error:', imgError?.message || imgError); }
            }
            
            // Reply to the model with the tool response to get the final text
            contents.push(chunk.candidates![0].content);
            contents.push({
              role: 'user',
              parts: [{
                functionResponse: {
                  name: 'generate_image',
                  response: { status: 'OK', imageUrl: imageUrl ? 'Generated successfully' : 'Failed to generate' }
                }
              }]
            });
            
            const { responseStream: secondStream } = await generateContentStreamWithFallback(ai, {
               contents: contents,
               config: {
                 systemInstruction: systemInstruction || "You are a helpful, empathetic journaling assistant. Help the user reflect on their thoughts, brainstorm ideas, and organize their feelings. Be concise and conversational."
               }
            });
            
            let secondIsFirst = true;
            for await (const secondChunk of secondStream) {
               res.write(`data: ${JSON.stringify({ text: secondChunk.text, imageUrl: secondIsFirst ? imageUrl : undefined })}\n\n`);
               secondIsFirst = false;
            }
          }
          break; // The tool call branch replaces the rest of the stream
        }
        
        if (!handledToolCall) {
          res.write(`data: ${JSON.stringify({ text: chunk.text })}\n\n`);
        }
        isFirstChunk = false;
      }
      
      res.end();
    } catch (error: any) {
      if (error?.status === 503 || error?.status === 429 || String(error?.message).includes('503') || String(error?.message).includes('429')) { console.log('API High demand or quota error in /api/chat'); } else { console.error('Error in /api/chat:', error?.message || error); }
      
      let userMsg = 'An error occurred while processing the request.';
      const msg = String(error?.message || '');
      const errStr = JSON.stringify(error || {});
      if (
        msg.includes('429') ||
        msg.includes('quota') ||
        msg.includes('RESOURCE_EXHAUSTED') ||
        errStr.includes('429') ||
        errStr.includes('RESOURCE_EXHAUSTED')
      ) {
        userMsg = 'Gemini quota limit reached for your account/project. Please wait a few moments and try again.';
      } else if (msg.includes('503') || msg.includes('UNAVAILABLE')) {
        userMsg = 'The AI model is currently experiencing high demand. Please wait a moment and try again.';
      }
      res.write(`data: ${JSON.stringify({ error: userMsg })}\n\n`);
  
      res.end();
    }
  });

  // API route to summarize a saved moment
  app.post('/api/summarize-moment', async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Unauthorized: Missing or invalid token' });
        return;
      }
      const idToken = authHeader.split('Bearer ')[1];
      try {
        await getAuth().verifyIdToken(idToken);
      } catch (authErr) {
        res.status(401).json({ error: 'Unauthorized: Invalid or expired token' });
        return;
      }
      
      const { userMessage, aiMessage } = req.body;
      if (!userMessage || !aiMessage) {
        res.status(400).json({ error: 'Missing messages' });
        return;
      }

      const prompt = `Summarize the following exchange in one short, descriptive sentence (e.g. "Reflection about presentation anxiety and preparing with more confidence.").\n\nUser: ${userMessage}\nAI: ${aiMessage}`;
      
      const { responseStream } = await generateContentStreamWithFallback(ai, {
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config: { systemInstruction: "You are a concise summarizer.", responseMimeType: "text/plain" }
      });
      
      let summary = '';
      for await (const chunk of responseStream) {
        summary += chunk.text || '';
      }
      
      res.json({ summary: summary.trim() });
    } catch (err) {
      if (err?.status === 503 || err?.status === 429 || String(err?.message).includes('503') || String(err?.message).includes('429')) { console.log('API High demand or quota error in summarization'); } else { console.error('Summarization error:', err?.message || err); }
      res.status(500).json({ error: 'Summarization failed' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
