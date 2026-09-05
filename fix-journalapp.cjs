const fs = require('fs');

let file = 'src/components/JournalApp.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(/profileName=\{settings\.name\}/g, 'profileName={user?.displayName || "there"}');

fs.writeFileSync(file, code);
