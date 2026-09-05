const fs = require('fs');
const file = 'src/components/JournalApp.tsx';
let code = fs.readFileSync(file, 'utf8');

const target = `  const handleDeleteActiveEntry = async () => {
    if (!activeId) return;
    if (confirm('Are you sure you want to delete this session? This action cannot be undone.')) {
      try {
        const deleted1 = await removeEntry(activeId);
        const deleted2 = await removeChat(activeId);
        if (!deleted1 && !deleted2) {
          throw new Error("Conversation not found in database.");
        }
      } catch (err: any) {
        console.error("Delete error:", err);
        alert("Failed to delete conversation: " + err.message);
      }
      setActiveId(null);
      setMessages([]);
      setTitle('New Brainstorming Session');
      setCurrentTab('home');
    }
  };`;

const replacement = `  const handleDeleteActiveEntry = async () => {
    if (!activeId) return;
    if (confirm('Are you sure you want to delete this session? This action cannot be undone.')) {
      try {
        alert("Deleting conversation...");
        console.log("DEBUG DELETE ACTIVE START:", activeId);
        const { doc, getDoc } = await import('firebase/firestore');
        const { db } = await import('../lib/firebase');
        const entryRef = doc(db, 'entries', activeId);
        const chatRef = doc(db, 'chats', activeId);
        
        const deleted1 = await removeEntry(activeId);
        const deleted2 = await removeChat(activeId);
        
        const [entrySnapAfter, chatSnapAfter] = await Promise.all([getDoc(entryRef), getDoc(chatRef)]);
        console.log("After delete - entries exists:", entrySnapAfter.exists());
        console.log("After delete - chats exists:", chatSnapAfter.exists());

        if (!deleted1 && !deleted2) {
          throw new Error("Conversation not found in database.");
        }
        alert("Conversation deleted successfully");
      } catch (err: any) {
        console.error("Delete error:", err);
        alert("Failed to delete conversation: " + err.message);
      }
      setActiveId(null);
      setMessages([]);
      setTitle('New Brainstorming Session');
      setCurrentTab('home');
    }
  };`;

code = code.replace(target, replacement);
fs.writeFileSync(file, code);
