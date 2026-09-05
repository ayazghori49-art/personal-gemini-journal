const fs = require('fs');
let code = fs.readFileSync('src/hooks/useChatApi.ts', 'utf8');

const importRegex = /import \{ collection, addDoc \} from 'firebase\/firestore';/;
const newImport = `import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';`;
code = code.replace(importRegex, newImport);

const buildInstRegex = /const res = await fetch\('\/api\/chat', \{/;

const newBuildInst = `// Fetch user memories if it's a new chat, or simply fetch them to inject into context
      let memoriesContext = "";
      try {
        const memQ = query(collection(db, 'memories'), where('userId', '==', user.uid));
        const memSnap = await getDocs(memQ);
        const mems = memSnap.docs.map(d => d.data().content);
        if (mems.length > 0) {
          memoriesContext = "Here are some core memories and facts about the user you should remember:\\n- " + mems.join("\\n- ");
        }
      } catch (e) {
        console.error("Failed to fetch memories for context", e);
      }

      let finalInstruction = customInstruction || \`You are a helpful journaling assistant. Persona: \${persona}\`;
      if (memoriesContext) {
        finalInstruction += "\\n\\n" + memoriesContext;
      }

      const res = await fetch('/api/chat', {`;

code = code.replace(buildInstRegex, newBuildInst);

const sysInstRegex = /systemInstruction: customInstruction \|\| \`You are a helpful journaling assistant\. Persona: \$\{persona\}\`/g;
code = code.replace(sysInstRegex, "systemInstruction: finalInstruction");

fs.writeFileSync('src/hooks/useChatApi.ts', code);
console.log("Patched useChatApi.ts for memory retrieval");
