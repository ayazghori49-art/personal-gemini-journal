const fs = require('fs');
let code = fs.readFileSync('src/components/views/SummariesView.tsx', 'utf8');

const searchStr = "text: `Here are my journal entries for the past ${range.toLowerCase()}:${entriesText}Please provide a thoughtful, empathetic summary of my entries. Highlight key themes, emotional trends, and any notable events. Keep it concise but meaningful. ONLY use the provided journal entries, do not include or invent any external information.`";

const replaceStr = "text: `Here are my journal entries for the past ${range.toLowerCase()}:\\n\\n${entriesText}\\n\\nPlease provide a thoughtful, empathetic summary of my entries. Highlight key themes, emotional trends, and any notable events. Keep it concise but meaningful. ONLY use the provided journal entries, do not include or invent any external information.`";

code = code.replace(searchStr, replaceStr);
fs.writeFileSync('src/components/views/SummariesView.tsx', code);
