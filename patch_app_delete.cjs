const fs = require('fs');
const file = 'src/components/JournalApp.tsx';
let code = fs.readFileSync(file, 'utf8');

const activeDeleteRegex = /  const handleDeleteActiveEntry = async \(\) => \{[\s\S]*?deletedIdsRef\.current\.delete\(targetId\);\n      \}\n    \}\n  \};/;
const newActiveDelete = `  const handleDeleteActiveEntry = async () => {
    if (!activeId) return;
    if (confirm('Are you sure you want to delete this session? This action cannot be undone.')) {
      const targetId = activeId;
      deletedIdsRef.current.add(targetId); // Mark as deleted immediately
      
      // Immediately clear UI state
      setActiveId(null);
      setMessages([]);
      setTitle('New Brainstorming Session');
      setCurrentTab('home');
      
      try {
        const isChat = chats.some(c => c.id === targetId);
        const isEntry = entries.some(e => e.id === targetId);
        
        const deletePromises = [];
        // Only delete from the collection it actually belongs to!
        if (isChat) deletePromises.push(removeChat(targetId));
        if (isEntry) deletePromises.push(removeEntry(targetId));
        
        if (!isChat && !isEntry) {
           // Fallback if not found in local state yet
           deletePromises.push(removeChat(targetId).catch(() => {}));
           deletePromises.push(removeEntry(targetId).catch(() => {}));
        }
        
        await Promise.all(deletePromises);
      } catch (err: any) {
        console.error("Delete error:", err);
        alert(\`Delete failed: \${err.message}\`);
        deletedIdsRef.current.delete(targetId);
      }
    }
  };`;

if (activeDeleteRegex.test(code)) {
  code = code.replace(activeDeleteRegex, newActiveDelete);
  console.log("Replaced handleDeleteActiveEntry");
} else {
  console.log("Failed to match handleDeleteActiveEntry");
}

const onDeleteRegex = /          onDeleteEntry=\{async \(id\) => \{[\s\S]*?deletedIdsRef\.current\.delete\(targetId\); \/\/ Revert lock if failed\n            \}\n          \}\}/;
const newOnDelete = `          onDeleteEntry={async (id) => {
            const targetId = id;
            deletedIdsRef.current.add(targetId); // Prevent autosaves
            
            // Clear active state immediately if open
            if (activeId === targetId) {
              setActiveId(null);
              setMessages([]);
              setTitle('New Brainstorming Session');
              setCurrentTab('home');
            }
            
            try {
              const isChat = chats.some(c => c.id === targetId);
              const isEntry = entries.some(e => e.id === targetId);
              
              const deletePromises = [];
              if (isChat) deletePromises.push(removeChat(targetId));
              if (isEntry) deletePromises.push(removeEntry(targetId));
              
              if (!isChat && !isEntry) {
                 deletePromises.push(removeChat(targetId).catch(() => {}));
                 deletePromises.push(removeEntry(targetId).catch(() => {}));
              }
              
              await Promise.all(deletePromises);
            } catch (err: any) {
              console.error("Delete Error:", err);
              alert(\`Delete failed: \${err.message}\`);
              deletedIdsRef.current.delete(targetId); // Revert lock if failed
            }
          }}`;

if (onDeleteRegex.test(code)) {
  code = code.replace(onDeleteRegex, newOnDelete);
  console.log("Replaced onDeleteEntry");
} else {
  console.log("Failed to match onDeleteEntry");
}

fs.writeFileSync(file, code);
