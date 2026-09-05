const fs = require('fs');
let code = fs.readFileSync('src/components/views/ChatView.tsx', 'utf8');

const regex = /return \(\s*<button[\s\S]*?<\/button>\s*\);/g;
code = code.replace(regex, 'return null;');

fs.writeFileSync('src/components/views/ChatView.tsx', code);
console.log("Patched ChatView.tsx");
