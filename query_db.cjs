const admin = require('firebase-admin');

// Ensure we have a project to connect to. We can just use default.
if (!admin.apps.length) {
  admin.initializeApp({
    projectId: 'ai-studio-securegeminijour-d54ac4ae-2a53-4060-98cc-63eae142f4ed' // from prompt
  });
}

const db = admin.firestore();

async function run() {
  const users = await db.collection('userSettings').get();
  let uid = '';
  users.forEach(u => {
    // just get the first one for testing, or we can fetch all emails if stored
    console.log("User:", u.id);
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
