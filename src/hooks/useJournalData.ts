import { useState, useEffect } from 'react';
import { JournalEntry } from '../types';
import { auth, db } from '../lib/firebase';
import { collection, doc, setDoc, deleteDoc, query, where, onSnapshot, getDocs, getDoc } from 'firebase/firestore';

export function useJournalData() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      setEntries([]);
      setLoading(false);
      return;
    }

    const q = query(collection(db, 'entries'), where('userId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as JournalEntry));
      setEntries(data);
      setLoading(false);
    }, (error) => {
      console.error("Firestore onSnapshot error in useJournalData:", error);
      setLoading(false);
    });

    return unsubscribe;
  }, [auth.currentUser]);

  const saveEntry = async (id: string, entryData: Partial<JournalEntry>) => {
    const user = auth.currentUser;
    if (!user) return;
    
    // Remove any undefined fields using JSON parsing
    const cleanData = JSON.parse(JSON.stringify({ ...entryData, userId: user.uid }));
    
    const docRef = doc(db, 'entries', id);
    await setDoc(docRef, cleanData, { merge: true });
  };

  const removeEntry = async (id: string) => {
    const user = auth.currentUser;
    if (!user) throw new Error('You must be logged in to delete');
    const docRef = doc(db, 'entries', id);
    await deleteDoc(docRef);
  };

  const clearAllEntries = async () => {
    const user = auth.currentUser;
    if (!user) return;
    const q = query(collection(db, 'entries'), where('userId', '==', user.uid));
    const snapshot = await getDocs(q);
    const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
  };

  return { entries, saveEntry, removeEntry, clearAllEntries, loading };
}
