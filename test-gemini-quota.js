import { GoogleGenAI } from '@google/genai';
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
async function checkGemini() {
  try {
    const res = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: 'ping'
    });
    console.log('SUCCESS: API is responding normally.');
    console.log('Response:', res.text);
  } catch (err) {
    console.error('ERROR OCCURRED:');
    console.error('Message:', err.message);
    console.error('Full Error Object:', JSON.stringify(err, null, 2));
  }
}
checkGemini();
