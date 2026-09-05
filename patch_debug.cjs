const fs = require('fs');

function patchHook(file, collection) {
  let code = fs.readFileSync(file, 'utf8');
  
  const funcName = collection === 'chats' ? 'removeChat' : 'removeEntry';
  
  const regex = new RegExp(`  const ${funcName} = async \\(id: string\\) => \\{\\s*const user = auth\\.currentUser;\\s*if \\(!user\\) throw new Error\\('You must be logged in to delete'\\);\\s*const docRef = doc\\(db, '${collection}', id\\);\\s*await deleteDoc\\(docRef\\);\\s*\\};`);
  
  const replacement = `  const ${funcName} = async (id: string) => {
    const user = auth.currentUser;
    console.log(\`[DELETE DEBUG] Starting delete for /\${'${collection}'}/\${id}\`);
    console.log(\`[DELETE DEBUG] User UID: \${user?.uid}\`);
    if (!user) {
      console.error(\`[DELETE DEBUG] Delete failed: No user logged in\`);
      throw new Error('You must be logged in to delete');
    }
    const docRef = doc(db, '${collection}', id);
    try {
      await deleteDoc(docRef);
      console.log(\`[DELETE DEBUG] Successfully deleted /\${'${collection}'}/\${id}\`);
    } catch (error) {
      console.error(\`[DELETE DEBUG] Failed to delete /\${'${collection}'}/\${id}:\`, error);
      throw error;
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
