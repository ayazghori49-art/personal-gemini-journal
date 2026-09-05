const fs = require('fs');
const file = 'src/components/JournalApp.tsx';
let code = fs.readFileSync(file, 'utf8');

const regexActiveDelete = /  const handleDeleteActiveEntry = async \(\) => \{[\s\S]*?setCurrentTab\('home'\);\n    \}\n  \};/;

const newActiveDelete = `  const handleDeleteActiveEntry = async () => {
    if (!activeId) return;
    if (confirm('Are you sure you want to delete this session? This action cannot be undone.')) {
      try {
        alert("Deleting conversation...");
        console.log("--- START DELETE ACTIVE LOG ---");
        console.log("authenticated Firebase UID:", user?.uid);
        console.log("selected conversation id:", activeId);
        
        const { doc, getDoc, deleteDoc } = await import('firebase/firestore');
        const { db } = await import('../lib/firebase');
        
        const entryRef = doc(db, 'entries', activeId);
        const chatRef = doc(db, 'chats', activeId);
        
        console.log("Firestore paths: entries/" + activeId + " and chats/" + activeId);
        
        const [entrySnap, chatSnap] = await Promise.all([getDoc(entryRef), getDoc(chatRef)]);
        
        let deleted = false;
        
        if (entrySnap.exists()) {
           console.log("document existence (entries): TRUE");
           const docUserId = entrySnap.data().userId;
           console.log("document userId:", docUserId);
           console.log("auth UID === document userId:", user?.uid === docUserId);
           
           if (user?.uid === docUserId) {
             await deleteDoc(entryRef);
             deleted = true;
             
             // verify it's gone
             const checkSnap = await getDoc(entryRef);
             console.log("re-read exists after delete (entries):", checkSnap.exists());
           }
        } else {
           console.log("document existence (entries): FALSE");
        }
        
        if (chatSnap.exists()) {
           console.log("document existence (chats): TRUE");
           const docUserId = chatSnap.data().userId;
           console.log("document userId:", docUserId);
           console.log("auth UID === document userId:", user?.uid === docUserId);
           
           if (user?.uid === docUserId) {
             await deleteDoc(chatRef);
             deleted = true;
             
             // verify it's gone
             const checkSnap = await getDoc(chatRef);
             console.log("re-read exists after delete (chats):", checkSnap.exists());
           }
        } else {
           console.log("document existence (chats): FALSE");
        }
        
        if (!deleted) {
          alert("Delete failed: Conversation not found in database or permission denied.");
          return;
        }

        setActiveId(null);
        setMessages([]);
        setTitle('New Brainstorming Session');
        setCurrentTab('home');
        alert("Conversation deleted successfully");
      } catch (err: any) {
        console.error("Delete error:", err);
        alert("Delete failed: " + err.message);
      }
    }
  };`;

code = code.replace(regexActiveDelete, newActiveDelete);
fs.writeFileSync(file, code);
console.log("Replaced active delete");
