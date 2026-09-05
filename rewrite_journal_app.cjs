const fs = require('fs');
const file = 'src/components/JournalApp.tsx';
let code = fs.readFileSync(file, 'utf8');

// 1. Add useRef to react imports
code = code.replace(/import \{ useState, useEffect \} from 'react';/, "import { useState, useEffect, useRef } from 'react';");

// 2. Add deletedIdsRef inside the component
if (!code.includes('deletedIdsRef')) {
  code = code.replace(
    /const \[currentTab, setCurrentTab\] = useState\('home'\);/,
    "const [currentTab, setCurrentTab] = useState('home');\n  const deletedIdsRef = useRef<Set<string>>(new Set());"
  );
}

// 3. Rewrite handleUpdateEntryData
const updateRegex = /  const handleUpdateEntryData = async \(\payload: any\) => \{[\s\S]*?setIsSaving\(false\);\n  \};/;
const newUpdate = `  const handleUpdateEntryData = async (payload: any) => {
    if (!activeId || deletedIdsRef.current.has(activeId)) return;
    setIsSaving(true);
    const isEntry = entries.some(e => e.id === activeId);
    const isChat = chats.some(c => c.id === activeId);
    if (isEntry) {
      await saveEntry(activeId, { ...payload, updatedAt: Date.now() });
    } else if (isChat) {
      await saveChat(activeId, { ...payload, updatedAt: Date.now() });
    } else {
      await saveChat(activeId, { ...payload, updatedAt: Date.now() });
    }
    setIsSaving(false);
  };`;
if(updateRegex.test(code)) {
  code = code.replace(updateRegex, newUpdate);
}

// 4. Rewrite handleSendMessage
const sendRegex = /  const handleSendMessage = \(text: string, attachments: any\[\]\) => \{[\s\S]*?if \(!activeId\) setActiveId\(id\);\n        setIsSaving\(false\);\n      \}\n    \);\n  \};/;
const newSend = `  const handleSendMessage = (text: string, attachments: any[]) => {
    if (activeId && deletedIdsRef.current.has(activeId)) return;
    
    sendMessage(
      text,
      attachments,
      messages,
      persona,
      customInstruction,
      settings.memoryEnabled ? entries : [],
      (updatedMessages) => setMessages(updatedMessages),
      async (finalMessages, newTitle) => {
        const id = activeId || crypto.randomUUID();
        if (deletedIdsRef.current.has(id)) return; // DO NOT SAVE IF DELETED
        
        setIsSaving(true);
        const isEntry = entries.some(e => e.id === id);
        const isChat = chats.some(c => c.id === id);
        
        const payload = {
            id: id,
            userId: user?.uid,
            title: newTitle || title,
            messages: finalMessages,
            persona,
            customInstruction,
            mood,
            createdAt: activeId ? undefined : Date.now(),
            updatedAt: Date.now()
        };

        if (isEntry) {
          await saveEntry(id, payload);
        } else if (isChat) {
          await saveChat(id, payload);
        } else {
          await saveChat(id, payload);
        }
        
        if (!activeId && !deletedIdsRef.current.has(id)) setActiveId(id);
        setIsSaving(false);
      }
    );
  };`;
if(sendRegex.test(code)) {
  code = code.replace(sendRegex, newSend);
}

// 5. Rewrite handleDeleteActiveEntry
const activeDeleteRegex = /  const handleDeleteActiveEntry = async \(\) => \{[\s\S]*?alert\(\`Delete failed! ID: \$\{activeId\} \| Error: \$\{err\.message\}\`\);\n      \}\n    \}\n  \};/;
const newActiveDelete = `  const handleDeleteActiveEntry = async () => {
    if (!activeId) return;
    if (confirm('Are you sure you want to delete this session? This action cannot be undone.')) {
      const targetId = activeId;
      deletedIdsRef.current.add(targetId); // Mark as deleted immediately to prevent autosaves
      
      // Immediately clear UI state so it disappears instantly
      setActiveId(null);
      setMessages([]);
      setTitle('New Brainstorming Session');
      setCurrentTab('home');
      
      try {
        const isChat = chats.some(c => c.id === targetId);
        const isEntry = entries.some(e => e.id === targetId);
        
        let path = '';
        if (isChat) {
          await removeChat(targetId);
          path += 'chats ';
        }
        if (isEntry) {
          await removeEntry(targetId);
          path += 'entries ';
        }
        
        if (!isChat && !isEntry) {
          await removeChat(targetId).catch(() => {});
          await removeEntry(targetId).catch(() => {});
          path = 'fallback-both';
        }
        
      } catch (err: any) {
        console.error("Delete error:", err);
        alert(\`Delete failed! ID: \${targetId} | Error: \${err.message}\`);
        deletedIdsRef.current.delete(targetId); // Unmark if it truly failed
      }
    }
  };`;
if(activeDeleteRegex.test(code)) {
  code = code.replace(activeDeleteRegex, newActiveDelete);
}

// 6. Rewrite onDeleteEntry (from History view)
const deleteRegex = /          onDeleteEntry=\{async \(id\) => \{[\s\S]*?alert\(\`Delete failed! ID: \$\{id\} \| Error: \$\{err\.message\}\`\);\n            \}\n          \}\}/;
const newDelete = `          onDeleteEntry={async (id) => {
            const targetId = id;
            deletedIdsRef.current.add(targetId); // Prevent autosaves
            
            if (activeId === targetId) {
              setActiveId(null);
              setMessages([]);
              setTitle('New Brainstorming Session');
            }
            
            try {
              const isChat = chats.some(c => c.id === targetId);
              const isEntry = entries.some(e => e.id === targetId);
              
              let path = '';
              if (isChat) {
                await removeChat(targetId);
                path += 'chats ';
              }
              if (isEntry) {
                await removeEntry(targetId);
                path += 'entries ';
              }
              
              if (!isChat && !isEntry) {
                // If it's in neither, maybe it hasn't synced yet, try both
                await removeChat(targetId).catch(() => {});
                await removeEntry(targetId).catch(() => {});
                path = 'fallback-both';
              }
            } catch (err: any) {
              console.error("Delete Error:", err);
              alert(\`Delete failed! ID: \${targetId} | Error: \${err.message}\`);
              deletedIdsRef.current.delete(targetId); // Revert lock if failed
            }
          }}`;
if(deleteRegex.test(code)) {
  code = code.replace(deleteRegex, newDelete);
}

fs.writeFileSync(file, code);
console.log("JournalApp.tsx modified successfully.");
