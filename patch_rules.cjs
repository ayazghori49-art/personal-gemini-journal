const fs = require('fs');
let code = fs.readFileSync('firestore.rules', 'utf8');

const newRule = `
    match /savedSummaries/{summaryId} {
      allow read, update: if request.auth != null && request.auth.uid == resource.data.userId;
      allow delete: if request.auth != null && (resource == null || request.auth.uid == resource.data.userId);
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
  }
}`;

code = code.replace("  }\n}", newRule);
fs.writeFileSync('firestore.rules', code);
console.log("Patched firestore.rules");
