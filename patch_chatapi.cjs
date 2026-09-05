const fs = require('fs');
let code = fs.readFileSync('src/hooks/useChatApi.ts', 'utf8');

const importRegex = /import \{ auth \} from '\.\.\/lib\/firebase';/;
const newImport = `import { auth, db } from '../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';`;

code = code.replace(importRegex, newImport);

const saveRegex = /await onSaveInteraction\(\[\.\.\.messagesWithUser, aiMessage\], newTitle\);/;
const newSave = `await onSaveInteraction([...messagesWithUser, aiMessage], newTitle);
      
      // Memory Extraction Logic
      const lowerText = text.toLowerCase();
      if (lowerText.includes('remember this') || lowerText.includes('yaad rakhna')) {
        try {
          const memRes = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': \`Bearer \${token}\` },
            body: JSON.stringify({
              contents: [{ role: 'user', parts: [{ text: \`Extract the core fact, preference, or detail the user wants to remember from this message. Return ONLY the concise fact, nothing else.\\n\\nMessage: "\${text}"\` }] }],
              systemInstruction: "You extract facts.",
              responseMimeType: "text/plain"
            })
          });
          if (memRes.ok) {
            const reader = memRes.body?.getReader();
            const decoder = new TextDecoder();
            let memText = "";
            if (reader) {
              while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                const chunk = decoder.decode(value, { stream: true });
                const lines = chunk.split('\\n\\n');
                for (const line of lines) {
                  if (line.startsWith('data: ')) {
                    const dataStr = line.replace('data: ', '').trim();
                    if (!dataStr) continue;
                    try {
                      const data = JSON.parse(dataStr);
                      if (data.text) memText += data.text;
                    } catch (e) {}
                  }
                }
              }
            }
            if (memText.trim()) {
              await addDoc(collection(db, 'memories'), {
                userId: user.uid,
                content: memText.trim(),
                createdAt: Date.now()
              });
            }
          }
        } catch (memErr) {
          console.error("Failed to save memory", memErr);
        }
      }`;

code = code.replace(saveRegex, newSave);

fs.writeFileSync('src/hooks/useChatApi.ts', code);
console.log("Patched useChatApi.ts");
