const fs = require('fs');
let code = fs.readFileSync('src/components/JournalApp.tsx', 'utf8');

const historyEntriesRegex = /<HistoryView lang=\{settings\.language\} \n          entries=\{chats\}/;
code = code.replace(historyEntriesRegex, `<HistoryView lang={settings.language} \n          entries={Array.from(new Map([...chats, ...entries].map(item => [item.id, item])).values())}`);

fs.writeFileSync('src/components/JournalApp.tsx', code);
console.log("Reverted UI change in HistoryView");
