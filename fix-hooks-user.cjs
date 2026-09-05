const fs = require('fs');

let file = 'src/hooks/useJournalData.ts';
let code = fs.readFileSync(file, 'utf8');

code = `import { auth } from '../lib/firebase';\n` + code;
code = code.replace(/user: \{ uid: 'demo-user', email: 'user@example\.com', displayName: 'Demo User' \},/g, 'user: auth.currentUser,');

fs.writeFileSync(file, code);

file = 'src/components/views/HomeView.tsx';
code = fs.readFileSync(file, 'utf8');
code = code.replace(/const user = \{ displayName: "Demo User", email: "user@example\.com", photoURL: null \};/g, 'const user = auth.currentUser;');
if (!code.includes("import { auth }") && code.includes("auth.currentUser")) {
  code = `import { auth } from '../../lib/firebase';\n` + code;
}
fs.writeFileSync(file, code);
