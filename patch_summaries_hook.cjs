const fs = require('fs');
let code = fs.readFileSync('src/hooks/useSavedSummaries.ts', 'utf8');

const oldSaveSummary = /const saveSummary = async \(timeRange: string, summaryText: string\) => \{[\s\S]*?await setDoc\(docRef, summary\);\s*\};/;

const newSaveSummary = `const saveSummary = async (timeRange: string, summaryText: string) => {
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

    const id = \`\${user.uid}_\${hashStr(timeRange)}_\${hashStr(summaryText)}\`;
    const docRef = doc(db, 'savedSummaries', id);
    
    const summary: SavedSummary = {
      id,
      userId: user.uid,
      createdAt: Date.now(),
      timeRange,
      summaryText
    };
    
    await setDoc(docRef, summary);
  };`;

code = code.replace(oldSaveSummary, newSaveSummary);
fs.writeFileSync('src/hooks/useSavedSummaries.ts', code);
console.log("Patched useSavedSummaries.ts");
