const fs = require('fs');
let code = fs.readFileSync('src/components/JournalApp.tsx', 'utf8');

const onDeleteRegex = /onDeleteEntry=\{async \(id\) => \{[\s\S]*?deletedIdsRef\.current\.delete\(targetId\); \/\/ Revert lock if failed\n\s*\}\n\s*\}\}/;

const activeDeleteRegex = /const handleDeleteActiveEntry = async \(\) => \{[\s\S]*?deletedIdsRef\.current\.delete\(targetId\);\n\s*\}\n\s*\}\n\s*\};/;

const newDeleteLogic = (targetIdVar) => `
      const targetId = ${targetIdVar};
      deletedIdsRef.current.add(targetId); // Prevent autosaves
      
      try {
        const user = auth.currentUser;
        if (!user) throw new Error('Not authenticated');
        const uid = user.uid;
        const collectionsToClear = ['chats', 'entries', 'savedMoments', 'memories', 'weeklySummaries', 'summaries'];
        let deleted = false;
        const errors = [];
        
        for (const collectionName of collectionsToClear) {
          try {
            const q = query(collection(db, collectionName), where('userId', '==', uid));
            const snapshot = await getDocs(q);
            for (const docSnap of snapshot.docs) {
              if (docSnap.id === targetId) {
                await deleteDoc(docSnap.ref);
                deleted = true;
              }
            }
          } catch (e: any) {
            errors.push(\`Failed in \${collectionName}: \${e.message}\`);
          }
        }
        
        if (!deleted && errors.length > 0) {
          throw new Error(errors.join('\\n'));
        }
        
        // After successful Firestore deletion, immediately remove from local state
        if (activeId === targetId) {
          setActiveId(null);
          setMessages([]);
          setTitle('New Brainstorming Session');
          setCurrentTab('home');
        }
        
        alert('Chat deleted successfully');
      } catch (err: any) {
        console.error("Delete error:", err);
        alert(\`Delete failed: \${err.message}\`);
        deletedIdsRef.current.delete(targetId);
      }`;

const newOnDelete = `onDeleteEntry={async (id) => {${newDeleteLogic('id')}
          }}`;

const newActiveDelete = `const handleDeleteActiveEntry = async () => {
    if (!activeId) return;
    if (confirm('Are you sure you want to delete this session? This action cannot be undone.')) {${newDeleteLogic('activeId')}
    }
  };`;

if (code.includes('onDeleteEntry={async (id) => {')) {
  code = code.replace(onDeleteRegex, newOnDelete);
}
if (code.includes('const handleDeleteActiveEntry = async () => {')) {
  code = code.replace(activeDeleteRegex, newActiveDelete);
}

fs.writeFileSync('src/components/JournalApp.tsx', code);
console.log("Patched individual delete logic");
