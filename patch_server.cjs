const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace("console.error('Error in /api/chat:', error);", 
  "if (error?.status === 503 || error?.status === 429 || String(error?.message).includes('503') || String(error?.message).includes('429')) { console.log('API High demand or quota error in /api/chat'); } else { console.error('Error in /api/chat:', error?.message || error); }");

code = code.replace("console.error('Image generation error:', imgError);",
  "if (imgError?.status === 503 || imgError?.status === 429 || String(imgError?.message).includes('503') || String(imgError?.message).includes('429')) { console.log('API High demand or quota error in image generation'); } else { console.error('Image generation error:', imgError?.message || imgError); }");

code = code.replace("console.error(err);\n      res.status(500).json({ error: 'Summarization failed' });",
  "if (err?.status === 503 || err?.status === 429 || String(err?.message).includes('503') || String(err?.message).includes('429')) { console.log('API High demand or quota error in summarization'); } else { console.error('Summarization error:', err?.message || err); }\n      res.status(500).json({ error: 'Summarization failed' });");

fs.writeFileSync('server.ts', code);
console.log("Patched server.ts to handle 503 gracefully");
