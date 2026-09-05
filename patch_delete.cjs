const fs = require('fs');
const file = 'src/components/JournalApp.tsx';
let code = fs.readFileSync(file, 'utf8');

const regexDelete = /          onDeleteEntry=\{async \(id\) => \{[\s\S]*?alert\("Delete failed: " \+ err\.message\);\n            \}\n          \}\}/;

const newDelete = `          onDeleteEntry={async (id) => {
            try {
              const isChat = chats.some(c => c.id === id);
              const isEntry = entries.some(e => e.id === id);
              
              if (isChat) {
                await removeChat(id);
              }
              if (isEntry) {
                await removeEntry(id);
              }
              
              if (!isChat && !isEntry) {
                // If it's in neither, maybe it hasn't synced yet, try both
                await removeChat(id).catch(() => {});
                await removeEntry(id).catch(() => {});
              }
              
              if (activeId === id) {
                setActiveId(null);
                setMessages([]);
                setTitle('New Brainstorming Session');
              }
            } catch (err: any) {
              console.error("Delete Error:", err);
              alert("Delete failed: " + err.message);
            }
          }}`;

code = code.replace(regexDelete, newDelete);
fs.writeFileSync(file, code);
console.log("Replaced HistoryView onDelete");
