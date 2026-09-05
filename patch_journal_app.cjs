const fs = require('fs');
let code = fs.readFileSync('src/components/JournalApp.tsx', 'utf8');

const regexDelete = /onDeleteEntry=\{async \(id\) => \{/;
code = code.replace(regexDelete, `onDeleteEntry={async (id) => {\n      console.log("DELETE CLICKED in JournalApp for chat ID:", id);`);

const regexSuccess = /alert\('Chat deleted successfully'\);/;
code = code.replace(regexSuccess, `alert('Chat deleted successfully');\n        console.log("DELETE SUCCESS for ID:", targetId);`);

const regexError = /console\.error\("Delete error:", err\);/;
if(code.includes('console.error("Delete error:", err);')) {
    code = code.replace(regexError, `console.error("DELETE ERROR:", err);`);
}

fs.writeFileSync('src/components/JournalApp.tsx', code);
console.log("Patched JournalApp delete handler");
