import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import config from '../../firebase-applet-config.json';

// Initialize Firebase
export const app = initializeApp(config);
export const auth = getAuth(app);

// Use the dynamically provisioned database ID from the config
export const db = getFirestore(app, config.firestoreDatabaseId);
