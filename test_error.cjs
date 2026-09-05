const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');
content = content.replace("console.error('Error in /api/chat:', error);", "console.error('Error in /api/chat:', error, error.stack);");
fs.writeFileSync('server.ts', content);
