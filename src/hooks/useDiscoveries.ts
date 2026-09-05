import { useState, useEffect } from 'react';
import { auth, db } from '../lib/firebase';
import { collection, query, where, onSnapshot, setDoc, doc, updateDoc } from 'firebase/firestore';

export type Discovery = {
  id: string;
  userId: string;
  text: string;
  feedback: 'yes' | 'no' | null;
  createdAt: number;
};

export function useDiscoveries() {
  const [discoveries, setDiscoveries] = useState<Discovery[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      setDiscoveries([]);
      setLoading(false);
      return;
    }

    const q = query(collection(db, 'discoveries'), where('userId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Discovery));
      data.sort((a, b) => b.createdAt - a.createdAt);
      setDiscoveries(data);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const saveDiscoveries = async (texts: string[]) => {
    const user = auth.currentUser;
    if (!user) return [];
    
    const newDocs: Discovery[] = [];
    for (const text of texts) {
      const id = doc(collection(db, 'discoveries')).id;
      const newDoc: Discovery = {
        id,
        userId: user.uid,
        text,
        feedback: null,
        createdAt: Date.now()
      };
      await setDoc(doc(db, 'discoveries', id), newDoc);
      newDocs.push(newDoc);
    }
    return newDocs;
  };

  const updateFeedback = async (id: string, feedback: 'yes' | 'no') => {
    await updateDoc(doc(db, 'discoveries', id), { feedback });
  };

  return { discoveries, loading, saveDiscoveries, updateFeedback };
}
