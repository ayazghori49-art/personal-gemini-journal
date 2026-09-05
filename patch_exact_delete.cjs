const fs = require('fs');
let code = fs.readFileSync('src/components/JournalApp.tsx', 'utf8');

const regex = /onDeleteEntry=\{async \(id\) => \{[\s\S]*?deletedIdsRef\.current\.delete\(targetId\);\s*\}\s*\}\}/;

const exactLogic = `onDeleteEntry={async (id) => {
      console.log("DELETE CLICKED in JournalApp for chat ID:", id);
      const targetId = id;
      deletedIdsRef.current.add(targetId); // Prevent autosaves
      
      try {
        const user = auth.currentUser;
        if (!user) throw new Error('Not authenticated');
        
        const uid = user.uid;
        const collectionsToClear = ['chats', 'entries', 'savedMoments', 'memories', 'weeklySummaries', 'summaries'];
        const deletePromises = [];
        const errors = [];
        
        for (const collectionName of collectionsToClear) {
          try {
            const q = query(collection(db, collectionName), where('userId', '==', uid));
            const snapshot = await getDocs(q);
            snapshot.docs.forEach(docSnap => {
              if (docSnap.id === targetId) {
                deletePromises.push(
                  deleteDoc(docSnap.ref).catch(e => {
                    errors.push(\`Failed to delete \${docSnap.id} in \${collectionName}: \${e.message}\`);
                  })
                );
              }
            });
          } catch (e: any) {
             errors.push(\`Failed to query \${collectionName}: \${e.message}\`);
          }
        }
        
        await Promise.all(deletePromises);
        
        if (errors.length > 0) {
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
        console.log("DELETE SUCCESS for ID:", targetId);
        setRefreshCounter(c => c + 1);
      } catch (err: any) {
        console.error("DELETE ERROR:", err);
        alert(\`Delete failed: \${err.message}\`);
        deletedIdsRef.current.delete(targetId);
      }
    }}`;

if (code.includes('onDeleteEntry={async (id) => {')) {
  code = code.replace(regex, exactLogic);
}

fs.writeFileSync('src/components/JournalApp.tsx', code);
console.log("Patched JournalApp exact logic");
