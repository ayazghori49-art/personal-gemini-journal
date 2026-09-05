const fs = require('fs');

function patchHook(file, collection) {
  let code = fs.readFileSync(file, 'utf8');
  
  const funcName = collection === 'chats' ? 'removeChat' : 'removeEntry';
  
  const regex = new RegExp(`  const ${funcName} = async \\(id: string\\) => \\{[\\s\\S]*?await deleteDoc\\(docRef\\);\\n  \\};`);
  
  const replacement = `  const ${funcName} = async (id: string) => {
    const user = auth.currentUser;
    if (!user) throw new Error('You must be logged in to delete');
    const docRef = doc(db, '${collection}', id);
    
    try {
      const snap = await getDoc(docRef);
      if (!snap.exists()) {
        throw new Error("not_found");
      }
      
      if (snap.data().userId !== user.uid) {
        throw new Error('Permission denied: Document does not belong to you.');
      }
      
      await deleteDoc(docRef);
    } catch (e: any) {
      if (e.message !== "not_found" && e.code !== "permission-denied") {
        throw e;
      } else if (e.code === "permission-denied" || e.message?.includes("Missing or insufficient permissions")) {
         // If it's permission denied, it might mean the doc doesn't exist (because of our strict rules).
         // So we treat it as not_found essentially.
         throw new Error("not_found");
      }
      throw e;
    }
  };`;
  
  if (regex.test(code)) {
    code = code.replace(regex, replacement);
    fs.writeFileSync(file, code);
    console.log("Patched " + file);
  } else {
    console.log("Regex not found in " + file);
  }
}

patchHook('src/hooks/useChatData.ts', 'chats');
patchHook('src/hooks/useJournalData.ts', 'entries');
