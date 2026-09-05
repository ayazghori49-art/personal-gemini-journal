const fs = require('fs');
let code = fs.readFileSync('src/components/JournalApp.tsx', 'utf8');

const historyEntriesRegex = /<HistoryView lang=\{settings\.language\}[\s\S]*?entries=\{Array\.from\(new Map\(\[\.\.\.chats, \.\.\.entries\]\.map\(item => \[item\.id, item\]\)\)\.values\(\)\)\}/;
code = code.replace(historyEntriesRegex, `<HistoryView lang={settings.language} \n          entries={chats}`);

const onDeleteRegex = /onDeleteEntry=\{async \(id\) => \{[\s\S]*?deletedIdsRef\.current\.delete\(targetId\); \/\/ Revert lock if failed\n\s*\}\n\s*\}\}/;
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
              const user = auth.currentUser;
              if (!user) throw new Error('Not authenticated');
              await deleteDoc(doc(db, 'chats', targetId));
              alert('Chat deleted successfully');
            } catch (err: any) {
              console.error("Delete Error:", err);
              alert(\`Delete failed: \${err.message}\`);
              deletedIdsRef.current.delete(targetId); // Revert lock if failed
            }
          }}`;

if (code.includes('deletedIdsRef.current.delete(targetId); // Revert lock if failed')) {
  code = code.replace(onDeleteRegex, newOnDelete);
}

const activeDeleteRegex = /const handleDeleteActiveEntry = async \(\) => \{[\s\S]*?deletedIdsRef\.current\.delete\(targetId\);\n\s*\}\n\s*\}\n\s*\};/;
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
        const user = auth.currentUser;
        if (!user) throw new Error('Not authenticated');
        await deleteDoc(doc(db, 'chats', targetId));
        alert('Chat deleted successfully');
      } catch (err: any) {
        console.error("Delete error:", err);
        alert(\`Delete failed: \${err.message}\`);
        deletedIdsRef.current.delete(targetId);
      }
    }
  };`;
  
if (code.includes('const handleDeleteActiveEntry = async () => {')) {
  code = code.replace(activeDeleteRegex, newActiveDelete);
}

fs.writeFileSync('src/components/JournalApp.tsx', code);
console.log("Patched delete logic in JournalApp");
