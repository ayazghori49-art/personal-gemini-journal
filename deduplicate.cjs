const fs = require('fs');
const file = 'src/components/JournalApp.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  /entries=\{\[\.\.\.chats, \.\.\.entries\]\}/g,
  `entries={Array.from(new Map([...chats, ...entries].map(item => [item.id, item])).values())}`
);

fs.writeFileSync(file, code);
