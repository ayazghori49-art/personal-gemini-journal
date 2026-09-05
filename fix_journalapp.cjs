const fs = require('fs');
const file = 'src/components/JournalApp.tsx';
let code = fs.readFileSync(file, 'utf8');

const activeDeleteRegex = /try \{\s*const isChat = chats\.some\([\s\S]*?await Promise\.all\(deletePromises\);\s*\}/;
const newActiveDelete = `try {
        await Promise.all([
          removeChat(targetId),
          removeEntry(targetId)
        ]);
      }`;

const onDeleteRegex = /try \{\s*const isChat = chats\.some\([\s\S]*?await Promise\.all\(deletePromises\);\s*\}/g;

code = code.replace(onDeleteRegex, newActiveDelete);
fs.writeFileSync(file, code);
console.log("Fixed JournalApp.tsx");
