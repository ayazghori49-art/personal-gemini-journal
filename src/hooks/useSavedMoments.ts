import { useState, useEffect } from 'react';
import { SavedMoment } from '../types';
import { auth, db } from '../lib/firebase';
import { collection, doc, setDoc, deleteDoc, query, where, onSnapshot } from 'firebase/firestore';

export function useSavedMoments() {
  const [savedMoments, setSavedMoments] = useState<SavedMoment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      setSavedMoments([]);
      setLoading(false);
      return;
    }

    const q = query(collection(db, 'savedMoments'), where('userId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SavedMoment));
      data.sort((a, b) => b.createdAt - a.createdAt); // Newest first
      setSavedMoments(data);
      setLoading(false);
    }, (error) => {
      console.error("Firestore onSnapshot error in useSavedMoments:", error);
      setLoading(false);
    });

    return unsubscribe;
  }, [auth.currentUser]);

  const saveMoment = async (userMessage: string, aiMessage: string) => {
    const user = auth.currentUser;
    if (!user) return;
    
    // First, ask our server endpoint to summarize
    let summary = "Saved reflection";
    try {
      const token = await user.getIdToken();
      const res = await fetch('/api/summarize-moment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ userMessage, aiMessage })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.summary) {
          summary = data.summary;
        }
      }
    } catch (e) {
      console.error('Error getting summary:', e);
    }
    
    // The ID will be a hash of the content to prevent duplicates or we can just use doc().
    // Since we need to toggle save/unsave based on content, let's generate a predictable ID.
    // Simple hash function for the AI text:
    const hashStr = (str: string) => {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
      }
      return hash.toString(36);
    };
    
    const id = `${user.uid}_${hashStr(userMessage)}_${hashStr(aiMessage)}`;
    const docRef = doc(db, 'savedMoments', id);
    
    const moment: SavedMoment = {
      id,
      userId: user.uid,
      createdAt: Date.now(),
      userMessage,
      aiMessage,
      summary
    };
    
    await setDoc(docRef, moment);
  };

  const removeMoment = async (id: string) => {
    const docRef = doc(db, 'savedMoments', id);
    await deleteDoc(docRef);
  };
  
  // Predictable ID generator so we can check if it's saved
  const getMomentId = (userMessage: string, aiMessage: string) => {
    const user = auth.currentUser;
    if (!user) return null;
    const hashStr = (str: string) => {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
      }
      return hash.toString(36);
    };
    return `${user.uid}_${hashStr(userMessage)}_${hashStr(aiMessage)}`;
  };

  return { savedMoments, saveMoment, removeMoment, getMomentId, loading };
}
