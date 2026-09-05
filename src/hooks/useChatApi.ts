import { useState } from 'react';
import { ChatMessage, JournalEntry } from '../types';
import { auth, db } from '../lib/firebase';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';

export function useChatApi() {
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (
    text: string,
    attachments: any[],
    currentMessages: ChatMessage[],
    persona: string,
    customInstruction: string,
    entriesContext: JournalEntry[],
    onUpdateMessages: (messages: ChatMessage[]) => void,
    onSaveInteraction: (messages: ChatMessage[], newTitle?: string) => Promise<void>
  ) => {
    setIsLoading(true);
    
    // Add user message
    const userMessage: ChatMessage = { role: 'user', text: text, attachments: attachments.length > 0 ? attachments : undefined };
    const messagesWithUser = [...currentMessages, userMessage];
    onUpdateMessages(messagesWithUser);
    
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Not authenticated");
      const token = await user.getIdToken();

      // Format messages for Gemini API
      const contents = messagesWithUser.map(msg => ({
        role: msg.role === 'model' ? 'model' : 'user',
        parts: [{ text: msg.text }] // Note: attach attachments if needed, but keeping it simple for now
      }));

      // Fetch user memories if it's a new chat, or simply fetch them to inject into context
      let memoriesContext = "";
      try {
        const memQ = query(collection(db, 'memories'), where('userId', '==', user.uid));
        const memSnap = await getDocs(memQ);
        const mems = memSnap.docs.map(d => d.data().content);
        if (mems.length > 0) {
          memoriesContext = "Here are some core memories and facts about the user you should remember:\n- " + mems.join("\n- ");
        }
      } catch (e) {
        console.error("Failed to fetch memories for context", e);
      }

      let finalInstruction = customInstruction || `You are a helpful journaling assistant. Persona: ${persona}`;
      if (memoriesContext) {
        finalInstruction += "\n\n" + memoriesContext;
      }

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          contents,
          systemInstruction: finalInstruction
        })
      });

      if (!res.ok) {
        throw new Error(`API returned ${res.status}`);
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) throw new Error("No reader");

      let aiMessage: ChatMessage = { role: 'model', text: '' };
      const finalMessages = [...messagesWithUser, aiMessage];
      onUpdateMessages(finalMessages); // initial empty

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.replace('data: ', '').trim();
            if (!dataStr) continue;
            try {
              const data = JSON.parse(dataStr);
              if (data.error) {
                 aiMessage.text += `\n[Error: ${data.error}]`;
              } else if (data.text) {
                 aiMessage.text += data.text;
              }
              if (data.imageUrl) {
                 aiMessage.imageUrl = data.imageUrl;
              }
              // Update state with accumulated text
              onUpdateMessages([...messagesWithUser, { ...aiMessage }]);
            } catch (e) {
              console.error("Error parsing JSON chunk", e, dataStr);
            }
          }
        }
      }

      // Determine title if this is the first message
      let newTitle;
      if (currentMessages.length === 0) {
        newTitle = text.slice(0, 30) + (text.length > 30 ? '...' : '');
      }
      
      await onSaveInteraction([...messagesWithUser, aiMessage], newTitle);
      
      // Memory Extraction Logic
      const lowerText = text.toLowerCase();
      if (lowerText.includes('remember this') || lowerText.includes('yaad rakhna')) {
        try {
          const memRes = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({
              contents: [{ role: 'user', parts: [{ text: `Extract the core fact, preference, or detail the user wants to remember from this message. Return ONLY the concise fact, nothing else.\n\nMessage: "${text}"` }] }],
              systemInstruction: "You extract facts.",
              responseMimeType: "text/plain"
            })
          });
          if (memRes.ok) {
            const reader = memRes.body?.getReader();
            const decoder = new TextDecoder();
            let memText = "";
            if (reader) {
              while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                const chunk = decoder.decode(value, { stream: true });
                const lines = chunk.split('\n\n');
                for (const line of lines) {
                  if (line.startsWith('data: ')) {
                    const dataStr = line.replace('data: ', '').trim();
                    if (!dataStr) continue;
                    try {
                      const data = JSON.parse(dataStr);
                      if (data.text) memText += data.text;
                    } catch (e) {}
                  }
                }
              }
            }
            if (memText.trim()) {
              await addDoc(collection(db, 'memories'), {
                userId: user.uid,
                content: memText.trim(),
                createdAt: Date.now()
              });
            }
          }
        } catch (memErr) {
          console.error("Failed to save memory", memErr);
        }
      }
    } catch (err: any) {
      console.error(err);
      const errorMessage: ChatMessage = { role: 'model', text: `Sorry, there was an error: ${err.message}` };
      const finalMessages = [...messagesWithUser, errorMessage];
      onUpdateMessages(finalMessages);
      await onSaveInteraction(finalMessages);
    }

    setIsLoading(false);
  };

  return {
    sendMessage,
    isLoading
  };
}
