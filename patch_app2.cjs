const fs = require('fs');
let code = fs.readFileSync('src/components/JournalApp.tsx', 'utf8');

const importRegex = /import \{ t \} from '\.\.\/lib\/i18n';/;
const importReplacement = `import { t } from '../lib/i18n';\nimport { auth, db } from '../lib/firebase';\nimport { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';`;
if (code.includes(`import { t } from '../lib/i18n';`) && !code.includes(`import { auth, db } from '../lib/firebase';`)) {
  code = code.replace(importRegex, importReplacement);
}

const splitStr = "onClearHistory={async () => {";
if (code.includes(splitStr)) {
  const parts = code.split(splitStr);
  let rest = parts[1];
  
  // Find the end of onClearHistory block
  // It should end with }}
  // We can just use a regex on the rest
  const endMatch = rest.match(/\}\n\s*\}\}/);
  if (endMatch) {
    const remaining = rest.slice(endMatch.index + endMatch[0].length);
    
    const newBlock = `onClearHistory={async () => {
              try {
                await clearAllEntries();
                await clearAllChats();
                setActiveId(null);
                setMessages([]);
                setTitle('New Brainstorming Session');
                setMood('');
                setCustomInstruction('');
              } catch (err: any) {
                console.error('Delete error details:', err);
                alert(\`Failed to clear history: \${err.message}\`);
              }
            }}
            onClearAllData={async () => {
              const user = auth.currentUser;
              if (!user) throw new Error('Not authenticated');
              
              const uid = user.uid;
              const collectionsToClear = ['chats', 'entries', 'savedMoments', 'memories', 'weeklySummaries', 'summaries'];
              const deletePromises = [];
            
              for (const collectionName of collectionsToClear) {
                try {
                  const q = query(collection(db, collectionName), where('userId', '==', uid));
                  const snapshot = await getDocs(q);
                  snapshot.docs.forEach(docSnap => {
                    deletePromises.push(deleteDoc(docSnap.ref));
                  });
                } catch (e) {
                  console.warn(\`Could not clear collection \${collectionName}\`, e);
                }
              }
            
              try {
                const userSettingsRef = doc(db, 'userSettings', uid);
                deletePromises.push(deleteDoc(userSettingsRef));
              } catch (e) {}
            
              await Promise.all(deletePromises);
              
              // Clear UI state
              setActiveId(null);
              setMessages([]);
              setTitle('New Brainstorming Session');
              setCurrentTab('home');
            }}`;
            
    code = parts[0] + newBlock + remaining;
    fs.writeFileSync('src/components/JournalApp.tsx', code);
    console.log("Patched JournalApp.tsx successfully.");
  } else {
    console.log("Could not find the end of the block.");
  }
} else {
  console.log("Could not find onClearHistory");
}
