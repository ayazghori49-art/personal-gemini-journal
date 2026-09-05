const fs = require('fs');

function fixHook(file, collection) {
  let code = fs.readFileSync(file, 'utf8');
  
  const funcName = collection === 'chats' ? 'removeChat' : 'removeEntry';
  
  const regex = new RegExp(`  const ${funcName} = async \\(id: string\\) => \\{[\\s\\S]*?\\}\\n  \\};`);
  
  const replacement = `  const ${funcName} = async (id: string) => {
    const user = auth.currentUser;
    if (!user) throw new Error('You must be logged in to delete');
    const docRef = doc(db, '${collection}', id);
    await deleteDoc(docRef);
  };`;
  
  code = code.replace(regex, replacement);
  fs.writeFileSync(file, code);
  console.log("Fixed " + file);
}

fixHook('src/hooks/useChatData.ts', 'chats');
fixHook('src/hooks/useJournalData.ts', 'entries');
