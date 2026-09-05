const fs = require('fs');
const file = 'src/components/JournalApp.tsx';
let code = fs.readFileSync(file, 'utf8');

const target = `          onDeleteEntry={async (id) => {
            try {
              const deleted1 = await removeEntry(id);
              const deleted2 = await removeChat(id);
              if (!deleted1 && !deleted2) {
                throw new Error("Conversation not found in database.");
              }
              if (activeId === id) {
                setActiveId(null);
                setMessages([]);
                setTitle('New Brainstorming Session');
              }
            } catch (err: any) {
              console.error("Delete Error:", err);
              alert("Failed to delete conversation: " + err.message);
            }
          }}`;

const replacement = `          onDeleteEntry={async (id) => {
            try {
              alert("Deleting conversation...");
              console.log("DEBUG DELETE START:", id);
              console.log("Current user:", user?.uid);
              const { doc, getDoc } = await import('firebase/firestore');
              const { db } = await import('../lib/firebase');
              
              // Log before delete
              const entryRef = doc(db, 'entries', id);
              const chatRef = doc(db, 'chats', id);
              const [entrySnap, chatSnap] = await Promise.all([getDoc(entryRef), getDoc(chatRef)]);
              
              console.log("entries exists:", entrySnap.exists(), "userId:", entrySnap.exists() ? entrySnap.data().userId : null);
              console.log("chats exists:", chatSnap.exists(), "userId:", chatSnap.exists() ? chatSnap.data().userId : null);
              
              const deleted1 = await removeEntry(id);
              const deleted2 = await removeChat(id);
              
              // Verify after delete
              const [entrySnapAfter, chatSnapAfter] = await Promise.all([getDoc(entryRef), getDoc(chatRef)]);
              console.log("After delete - entries exists:", entrySnapAfter.exists());
              console.log("After delete - chats exists:", chatSnapAfter.exists());
              
              if (!deleted1 && !deleted2) {
                throw new Error("Conversation not found in database.");
              }
              
              if (activeId === id) {
                setActiveId(null);
                setMessages([]);
                setTitle('New Brainstorming Session');
              }
              alert("Conversation deleted successfully");
            } catch (err: any) {
              console.error("Delete Error:", err);
              alert("Failed to delete conversation: " + err.message);
            }
          }}`;

code = code.replace(target, replacement);
fs.writeFileSync(file, code);
