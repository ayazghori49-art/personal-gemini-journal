const fs = require('fs');
let code = fs.readFileSync('src/components/JournalApp.tsx', 'utf8');

const regex = /const collectionsToClear = \['chats', 'entries', 'savedMoments', 'memories', 'weeklySummaries', 'summaries'\];/g;
code = code.replace(regex, "const collectionsToClear = ['chats', 'entries', 'savedMoments', 'memories', 'weeklySummaries', 'summaries', 'discoveries'];");

fs.writeFileSync('src/components/JournalApp.tsx', code);
console.log("Patched JournalApp clear data");
