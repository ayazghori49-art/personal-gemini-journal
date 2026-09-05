const fs = require('fs');
const file = 'src/components/JournalApp.tsx';
let code = fs.readFileSync(file, 'utf8');

const target = `          onDeleteEntry={async (id) => {
            const isExistingJournal = entries.some(e => e.id === id);
            if (isExistingJournal) {
              await removeEntry(id);
            } else {
              await removeChat(id);
            }
          }}`;

const replacement = `          onDeleteEntry={async (id) => {
            try {
              const isExistingJournal = entries.some(e => e.id === id);
              if (isExistingJournal) {
                await removeEntry(id);
              } else {
                await removeChat(id);
              }
            } catch (err: any) {
              console.error("Delete Error:", err);
              alert("Failed to delete conversation: " + err.message);
            }
          }}`;

code = code.replace(target, replacement);
fs.writeFileSync(file, code);
