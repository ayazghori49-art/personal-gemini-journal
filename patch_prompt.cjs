const fs = require('fs');
let code = fs.readFileSync('src/components/views/SummariesView.tsx', 'utf8');

const targetBody = /body: JSON\.stringify\(\{\s*contents: \[\{ role: 'user', parts: \[\{ text: \`Here are my journal entries for the past \$\{range\.toLowerCase\(\)\}:\\n\\n\$\{entriesText\}\\n\\nPlease provide a thoughtful, empathetic summary of my entries\. Highlight key themes, emotional trends, and any notable events\. Keep it concise but meaningful\.\` \}\] \}\],\s*systemInstruction: "You are an insightful and empathetic journaling assistant\. Provide a structured summary of the user's journal entries\.",\s*responseMimeType: "text\/plain"\s*\}\)/;

const newBody = `body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: \`Here are my journal entries for the past \${range.toLowerCase()}:\n\n\${entriesText}\n\nPlease provide a thoughtful, empathetic summary of my entries. Highlight key themes, emotional trends, and any notable events. Keep it concise but meaningful. ONLY use the provided journal entries, do not include or invent any external information.\` }] }],
          systemInstruction: "You are an insightful and empathetic journaling assistant. Provide a structured summary of the user's journal entries. Strictly base your summary on the provided entries and nothing else.",
          responseMimeType: "text/plain"
        })`;

code = code.replace(targetBody, newBody);

fs.writeFileSync('src/components/views/SummariesView.tsx', code);
console.log("Patched SummariesView prompt");
