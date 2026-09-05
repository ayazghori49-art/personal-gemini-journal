const fs = require('fs');
const file = 'src/components/JournalApp.tsx';
let code = fs.readFileSync(file, 'utf8');
code = code.replace(/alert\("You don't have any saved moments to export\."\);/, 'alert("No saved moments to export.");');
fs.writeFileSync(file, code);
