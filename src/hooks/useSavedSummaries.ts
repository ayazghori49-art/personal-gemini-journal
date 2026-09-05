import { useState, useEffect } from 'react';
import { SavedSummary } from '../types';
import { auth, db } from '../lib/firebase';
import { collection, doc, setDoc, deleteDoc, query, where, onSnapshot } from 'firebase/firestore';

export function useSavedSummaries() {
  const [savedSummaries, setSavedSummaries] = useState<SavedSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      setSavedSummaries([]);
      setLoading(false);
      return;
    }

    const q = query(collection(db, 'savedSummaries'), where('userId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SavedSummary));
      data.sort((a, b) => b.createdAt - a.createdAt); // Newest first
      setSavedSummaries(data);
      setLoading(false);
    }, (error) => {
      console.error("Firestore onSnapshot error in useSavedSummaries:", error);
      setLoading(false);
    });

    return unsubscribe;
  }, [auth.currentUser]);

  const saveSummary = async (timeRange: string, summaryText: string) => {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated.");
    
    // Hash function to create unique ID based on content
    const hashStr = (str: string) => {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
      }
      return hash.toString(36);
    };

    const id = `${user.uid}_${hashStr(timeRange)}_${hashStr(summaryText)}`;
    const docRef = doc(db, 'savedSummaries', id);
    
    const summary: SavedSummary = {
      id,
      userId: user.uid,
      createdAt: Date.now(),
      timeRange,
      summaryText
    };
    
    await setDoc(docRef, summary);
  };

  const removeSummary = async (id: string) => {
    const docRef = doc(db, 'savedSummaries', id);
    await deleteDoc(docRef);
  };

  return { savedSummaries, saveSummary, removeSummary, loading };
}
