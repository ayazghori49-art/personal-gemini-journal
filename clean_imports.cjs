const fs = require('fs');
const file = 'src/components/JournalApp.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(/const \{ doc, getDoc, deleteDoc \} = await import\('firebase\/firestore'\);\n/g, '');
code = code.replace(/const \{ db \} = await import\('\.\.\/lib\/firebase'\);\n/g, '');

fs.writeFileSync(file, code);
