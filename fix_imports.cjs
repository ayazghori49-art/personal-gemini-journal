const fs = require('fs');

function ensureGetDoc(file) {
  let code = fs.readFileSync(file, 'utf8');
  if (!code.includes('getDoc,')) {
    code = code.replace(/import \{ ([^}]+) \} from 'firebase\/firestore';/, "import { $1, getDoc } from 'firebase/firestore';");
    fs.writeFileSync(file, code);
  }
}

ensureGetDoc('src/hooks/useChatData.ts');
ensureGetDoc('src/hooks/useJournalData.ts');
console.log("Imports fixed");
