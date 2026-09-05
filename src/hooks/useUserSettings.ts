import { useState, useEffect } from 'react';
import { auth, db } from '../lib/firebase';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';

export interface UserSettings {
  language: string;
  darkMode: boolean;
  notificationsEnabled: boolean;
  dailyReminderEnabled: boolean;
  dailyReminderTime: string;
  memoryEnabled: boolean;
  recentModes?: string[];
}

const DEFAULT_SETTINGS: UserSettings = {
  language: 'en',
  darkMode: false,
  notificationsEnabled: true,
  dailyReminderEnabled: true,
  dailyReminderTime: '20:00',
  memoryEnabled: true,
  recentModes: ['Morning Intention', 'Evening Reflection', 'Goal Setting']
};

export function useUserSettings() {
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      setSettings(DEFAULT_SETTINGS);
      setLoading(false);
      return;
    }

    const docRef = doc(db, 'userSettings', user.uid);
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setSettings({ ...DEFAULT_SETTINGS, ...docSnap.data() } as UserSettings);
      } else {
        setSettings(DEFAULT_SETTINGS);
      }
      setLoading(false);
    }, (error) => {
      console.error("Firestore onSnapshot error in useUserSettings:", error);
      setLoading(false);
    });

    return unsubscribe;
  }, [auth.currentUser]);

  const updateSettings = async (newSettings: Partial<UserSettings>) => {
    const user = auth.currentUser;
    const updated = { ...settings, ...newSettings };
    setSettings(updated); // Optimistic update
    
    if (user) {
      const docRef = doc(db, 'userSettings', user.uid);
      await setDoc(docRef, updated, { merge: true });
    }
  };

  return {
    settings,
    updateSettings,
    loading
  };
}
