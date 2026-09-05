import { useState, useEffect } from 'react';
import { ChatSession } from '../types';
import { auth, db } from '../lib/firebase';
import { collection, doc, setDoc, deleteDoc, query, where, onSnapshot, getDocs, getDoc } from 'firebase/firestore';

export function useChatData() {
  const [chats, setChats] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      setChats([]);
      setLoading(false);
      return;
    }

    const q = query(collection(db, 'chats'), where('userId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ChatSession));
      setChats(data);
      setLoading(false);
    }, (error) => {
      console.error("Firestore onSnapshot error in useChatData:", error);
      setLoading(false);
    });

    return unsubscribe;
  }, [auth.currentUser]);

  const saveChat = async (id: string, chatData: Partial<ChatSession>) => {
    const user = auth.currentUser;
    if (!user) return;
    
    // Remove any undefined fields using JSON parsing
    const cleanData = JSON.parse(JSON.stringify({ ...chatData, userId: user.uid }));
    
    const docRef = doc(db, 'chats', id);
    await setDoc(docRef, cleanData, { merge: true });
  };

  const removeChat = async (id: string) => {
    const user = auth.currentUser;
    if (!user) throw new Error('You must be logged in to delete');
    const docRef = doc(db, 'chats', id);
    await deleteDoc(docRef);
  };

  const clearAllChats = async () => {
    const user = auth.currentUser;
    if (!user) return;
    const q = query(collection(db, 'chats'), where('userId', '==', user.uid));
    const snapshot = await getDocs(q);
    const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
  };

  return { chats, saveChat, removeChat, clearAllChats, loading };
}
