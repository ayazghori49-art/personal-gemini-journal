const fs = require('fs');
const file = 'src/components/JournalApp.tsx';
let code = fs.readFileSync(file, 'utf8');

const onDeleteRegex = /onDeleteEntry=\{async \(id\) => \{[\s\S]*?deletedIdsRef\.current\.delete\(targetId\); \/\/ Revert lock if failed\n            \}\n          \}\}/;

const newOnDelete = `onDeleteEntry={async (id) => {
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
              // Delete from both collections, ignoring 'not-found' errors
              const deletePromises = [
                removeChat(targetId).catch(err => {
                  console.warn("Could not delete from chats:", err);
                  if (err.code !== 'not-found') throw err;
                }),
                removeEntry(targetId).catch(err => {
                  console.warn("Could not delete from entries:", err);
                  if (err.code !== 'not-found') throw err;
                })
              ];
              
              await Promise.all(deletePromises);
            } catch (err: any) {
              console.error("Delete Error:", err);
              alert(\`Delete failed: \${err.message}\`);
              deletedIdsRef.current.delete(targetId); // Revert lock if failed
            }
          }}`;

code = code.replace(onDeleteRegex, newOnDelete);

const activeDeleteRegex = /const handleDeleteActiveEntry = async \(\) => \{[\s\S]*?deletedIdsRef\.current\.delete\(targetId\);\n      \}\n    \}\n  \};/;

const newActiveDelete = `const handleDeleteActiveEntry = async () => {
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
        const deletePromises = [
          removeChat(targetId).catch(err => {
            console.warn("Could not delete from chats:", err);
            if (err.code !== 'not-found') throw err;
          }),
          removeEntry(targetId).catch(err => {
            console.warn("Could not delete from entries:", err);
            if (err.code !== 'not-found') throw err;
          })
        ];
        
        await Promise.all(deletePromises);
      } catch (err: any) {
        console.error("Delete error:", err);
        alert(\`Delete failed: \${err.message}\`);
        deletedIdsRef.current.delete(targetId);
      }
    }
  };`;

code = code.replace(activeDeleteRegex, newActiveDelete);

fs.writeFileSync(file, code);
console.log("Patched JournalApp.tsx");
