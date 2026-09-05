import * as admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
admin.initializeApp({ projectId: 'ai-studio-securegeminijour-d54ac4ae-2a53-4060-98cc-63eae142f4ed' });
const db = getFirestore();

async function run() {
  const users = await db.collection('userSettings').get();
  let uid = '';
  users.forEach(u => {
    uid = u.id; // assume the only user
  });
  
  if (!uid) {
    console.log("No user found");
  } else {
    const qEntries = await db.collection('entries').where('userId', '==', uid).get();
    console.log(`Found ${qEntries.size} entries for user ${uid}`);
    qEntries.forEach(doc => {
      console.log('Entry:', doc.id, doc.data().createdAt, new Date(doc.data().createdAt).toISOString(), doc.data().title);
    });

    const qChats = await db.collection('chats').where('userId', '==', uid).get();
    console.log(`Found ${qChats.size} chats for user ${uid}`);
    qChats.forEach(doc => {
      console.log('Chat:', doc.id, doc.data().createdAt, new Date(doc.data().createdAt).toISOString(), doc.data().title);
    });
  }
}
run().catch(console.error);
