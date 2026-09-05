const fs = require('fs');
let code = fs.readFileSync('src/components/views/HistoryView.tsx', 'utf8');

const regex = /if\(window\.confirm\('Delete this conversation\?'\)\) \{\s*onDeleteEntry\(item\.id\);\s*\}/;
code = code.replace(regex, `onDeleteEntry(item.id);`);

fs.writeFileSync('src/components/views/HistoryView.tsx', code);
console.log("Removed window.confirm from UI");
