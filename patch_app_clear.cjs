const fs = require('fs');
let code = fs.readFileSync('src/components/JournalApp.tsx', 'utf8');

const onClearRegex = /onClearAllData=\{async \(\) => \{[\s\S]*?setCurrentTab\('home'\);\n\s*\}\}/;

const newOnClear = `onClearAllData={async () => {
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
                    deletePromises.push(
                      deleteDoc(docSnap.ref).catch(e => {
                        errors.push(\`Failed to delete \${docSnap.id} in \${collectionName}: \${e.message}\`);
                      })
                    );
                  });
                } catch (e: any) {
                  // If we get permission denied, bubble it up. If it's just 'not found' or similar, we might ignore, 
                  // but Firestore usually returns empty for non-existent collections.
                  errors.push(\`Failed to query \${collectionName}: \${e.message}\`);
                }
              }
            
              try {
                const userSettingsRef = doc(db, 'userSettings', uid);
                deletePromises.push(
                  deleteDoc(userSettingsRef).catch(e => {
                    if (e.code !== 'not-found') {
                       errors.push(\`Failed to delete userSettings: \${e.message}\`);
                    }
                  })
                );
              } catch (e: any) {
                errors.push(\`Failed to delete userSettings: \${e.message}\`);
              }
            
              await Promise.all(deletePromises);
              
              if (errors.length > 0) {
                throw new Error(errors.join('\\n'));
              }
              
              // Clear UI state
              setActiveId(null);
              setMessages([]);
              setTitle('New Brainstorming Session');
              setCurrentTab('home');
            }}`;

code = code.replace(onClearRegex, newOnClear);
fs.writeFileSync('src/components/JournalApp.tsx', code);
console.log("Patched JournalApp onClearAllData");
