const fs = require('fs');
const file = 'src/components/JournalApp.tsx';
let code = fs.readFileSync(file, 'utf8');

const regexActiveDelete = /  const handleDeleteActiveEntry = async \(\) => \{[\s\S]*?alert\("Delete failed: " \+ err\.message\);\n      \}\n    \}\n  \};/;

const newActiveDelete = `  const handleDeleteActiveEntry = async () => {
    if (!activeId) return;
    if (confirm('Are you sure you want to delete this session? This action cannot be undone.')) {
      try {
        const isChat = chats.some(c => c.id === activeId);
        const isEntry = entries.some(e => e.id === activeId);
        
        if (isChat) {
          await removeChat(activeId);
        }
        if (isEntry) {
          await removeEntry(activeId);
        }
        
        if (!isChat && !isEntry) {
          await removeChat(activeId).catch(() => {});
          await removeEntry(activeId).catch(() => {});
        }
        
        setActiveId(null);
        setMessages([]);
        setTitle('New Brainstorming Session');
        setCurrentTab('home');
      } catch (err: any) {
        console.error("Delete error:", err);
        alert("Delete failed: " + err.message);
      }
    }
  };`;

code = code.replace(regexActiveDelete, newActiveDelete);
fs.writeFileSync(file, code);
console.log("Replaced active delete");
