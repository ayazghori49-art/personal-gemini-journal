const fs = require('fs');
const file = 'src/components/JournalApp.tsx';
let code = fs.readFileSync(file, 'utf8');

const deleteRegex = /          onDeleteEntry=\{async \(id\) => \{[\s\S]*?alert\(\`Delete failed! ID: \$\{targetId\} \| Error: \$\{err\.message\}\`\);\n              deletedIdsRef\.current\.delete\(targetId\); \/\/ Revert lock if failed\n            \}\n          \}\}/;

const newDelete = `          onDeleteEntry={async (id) => {
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
              // Delete from both paths to be absolutely sure
              let success = false;
              let errorMessage = "";
              
              try {
                await removeChat(targetId);
                success = true;
              } catch (e: any) {
                if (e.message !== "not_found") errorMessage += "Chat error: " + e.message + " ";
              }
              
              try {
                await removeEntry(targetId);
                success = true;
              } catch (e: any) {
                if (e.message !== "not_found") errorMessage += "Entry error: " + e.message;
              }
              
              if (!success && errorMessage) {
                throw new Error(errorMessage);
              }
            } catch (err: any) {
              console.error("Delete Error:", err);
              alert(\`Delete failed: \${err.message}\`);
              deletedIdsRef.current.delete(targetId); // Revert lock if failed
            }
          }}`;

if (deleteRegex.test(code)) {
  code = code.replace(deleteRegex, newDelete);
  fs.writeFileSync(file, code);
  console.log("JournalApp.tsx onDeleteEntry modified.");
} else {
  console.log("Failed to match onDeleteEntry in JournalApp.tsx");
}

const activeDeleteRegex = /  const handleDeleteActiveEntry = async \(\) => \{[\s\S]*?deletedIdsRef\.current\.delete\(targetId\); \/\/ Unmark if it truly failed\n      \}\n    \}\n  \};/;

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
        let success = false;
        let errorMessage = "";
        
        try {
          await removeChat(targetId);
          success = true;
        } catch (e: any) {
          if (e.message !== "not_found") errorMessage += "Chat error: " + e.message + " ";
        }
        
        try {
          await removeEntry(targetId);
          success = true;
        } catch (e: any) {
          if (e.message !== "not_found") errorMessage += "Entry error: " + e.message;
        }
        
        if (!success && errorMessage) {
          throw new Error(errorMessage);
        }
      } catch (err: any) {
        console.error("Delete error:", err);
        alert(\`Delete failed: \${err.message}\`);
        deletedIdsRef.current.delete(targetId);
      }
    }
  };`;

if (activeDeleteRegex.test(code)) {
  code = code.replace(activeDeleteRegex, newActiveDelete);
  fs.writeFileSync(file, code);
  console.log("JournalApp.tsx handleDeleteActiveEntry modified.");
} else {
  console.log("Failed to match handleDeleteActiveEntry in JournalApp.tsx");
}

