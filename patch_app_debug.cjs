const fs = require('fs');
const file = 'src/components/JournalApp.tsx';
let code = fs.readFileSync(file, 'utf8');

const onDeleteRegex = /onDeleteEntry=\{async \(id\) => \{[\s\S]*?deletedIdsRef\.current\.delete\(targetId\); \/\/ Revert lock if failed\n            \}\n          \}\}/;

const newOnDelete = `onDeleteEntry={async (id) => {
            console.log(\`[DELETE DEBUG] onDeleteEntry triggered for id: \${id}\`);
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
              console.log(\`[DELETE DEBUG] Calling Promise.all for removeChat and removeEntry\`);
              await Promise.all([
                removeChat(targetId),
                removeEntry(targetId)
              ]);
              console.log(\`[DELETE DEBUG] Promise.all completed successfully for id: \${id}\`);
            } catch (err: any) {
              console.error(\`[DELETE DEBUG] Promise.all threw an error for id \${id}:\`, err);
              alert(\`Delete failed: \${err.message}\`);
              deletedIdsRef.current.delete(targetId); // Revert lock if failed
            }
          }}`;

if (onDeleteRegex.test(code)) {
  code = code.replace(onDeleteRegex, newOnDelete);
  console.log("Patched onDeleteEntry");
} else {
  console.log("Regex not found in JournalApp.tsx");
}

const activeDeleteRegex = /const handleDeleteActiveEntry = async \(\) => \{[\s\S]*?deletedIdsRef\.current\.delete\(targetId\);\n      \}\n    \}\n  \};/;

const newActiveDelete = `const handleDeleteActiveEntry = async () => {
    if (!activeId) return;
    if (confirm('Are you sure you want to delete this session? This action cannot be undone.')) {
      console.log(\`[DELETE DEBUG] handleDeleteActiveEntry triggered for activeId: \${activeId}\`);
      const targetId = activeId;
      deletedIdsRef.current.add(targetId); // Mark as deleted immediately
      
      // Immediately clear UI state
      setActiveId(null);
      setMessages([]);
      setTitle('New Brainstorming Session');
      setCurrentTab('home');
      
      try {
        console.log(\`[DELETE DEBUG] Calling Promise.all for removeChat and removeEntry\`);
        await Promise.all([
          removeChat(targetId),
          removeEntry(targetId)
        ]);
        console.log(\`[DELETE DEBUG] Promise.all completed successfully for id: \${targetId}\`);
      } catch (err: any) {
        console.error(\`[DELETE DEBUG] Promise.all threw an error for id \${targetId}:\`, err);
        alert(\`Delete failed: \${err.message}\`);
        deletedIdsRef.current.delete(targetId);
      }
    }
  };`;

if (activeDeleteRegex.test(code)) {
  code = code.replace(activeDeleteRegex, newActiveDelete);
  console.log("Patched handleDeleteActiveEntry");
} else {
  console.log("Active Delete Regex not found in JournalApp.tsx");
}

fs.writeFileSync(file, code);
