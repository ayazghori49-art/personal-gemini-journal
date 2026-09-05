const fs = require('fs');
const file = 'src/components/JournalApp.tsx';
let code = fs.readFileSync(file, 'utf8');

// Fix handleUpdateEntryData
const regexUpdate = /  const handleUpdateEntryData = async \(\payload: any\) => \{[\s\S]*?setIsSaving\(false\);\n  \};/;
const newUpdate = `  const handleUpdateEntryData = async (payload: any) => {
    if (!activeId) return;
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

// Fix handleSendMessage
const regexSend = /  const handleSendMessage = \(text: string, attachments: any\[\]\) => \{[\s\S]*?if \(!activeId\) setActiveId\(id\);\n        setIsSaving\(false\);\n      \}\n    \);\n  \};/;
const newSend = `  const handleSendMessage = (text: string, attachments: any[]) => {
    sendMessage(
      text,
      attachments,
      messages,
      persona,
      customInstruction,
      settings.memoryEnabled ? entries : [],
      (updatedMessages) => setMessages(updatedMessages),
      async (finalMessages, newTitle) => {
        setIsSaving(true);
        const id = activeId || crypto.randomUUID();
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
        
        if (!activeId) setActiveId(id);
        setIsSaving(false);
      }
    );
  };`;

code = code.replace(regexUpdate, newUpdate);
code = code.replace(regexSend, newSend);
fs.writeFileSync(file, code);
console.log("Fixed save logic");
