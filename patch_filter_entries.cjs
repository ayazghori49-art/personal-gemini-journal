const fs = require('fs');
let code = fs.readFileSync('src/components/JournalApp.tsx', 'utf8');

const historyEntriesRegex = /entries=\{Array\.from\(new Map\(\[\.\.\.chats, \.\.\.entries\]\.map\(item => \[item\.id, item\]\)\)\.values\(\)\)\}/;
code = code.replace(historyEntriesRegex, `entries={Array.from(new Map([...chats, ...entries].map(item => [item.id, item])).values()).filter(item => !deletedIdsRef.current.has(item.id))}`);

fs.writeFileSync('src/components/JournalApp.tsx', code);
console.log("Patched filter entries");
