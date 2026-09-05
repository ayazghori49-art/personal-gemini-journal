const fs = require('fs');
let code = fs.readFileSync('src/components/views/SummariesView.tsx', 'utf8');

const target = /const q = query\([\s\S]*?\.sort\(\(a, b\) => a\.createdAt - b\.createdAt\);/;

const replacement = `const qEntries = query(
        collection(db, 'entries'),
        where('userId', '==', user.uid)
      );
      const qChats = query(
        collection(db, 'chats'),
        where('userId', '==', user.uid)
      );
      
      const [snapEntries, snapChats] = await Promise.all([
        getDocs(qEntries),
        getDocs(qChats)
      ]);
      
      const allData = [
        ...snapEntries.docs.map(d => d.data() as JournalEntry),
        ...snapChats.docs.map(d => d.data() as JournalEntry)
      ];

      const uniqueData = Array.from(new Map(allData.map(item => [item.id, item])).values());

      const entries = uniqueData
        .filter(e => e.createdAt >= startTime)
        .sort((a, b) => a.createdAt - b.createdAt);`;

code = code.replace(target, replacement);
fs.writeFileSync('src/components/views/SummariesView.tsx', code);
console.log("Patched SummariesView.tsx");
