const fs = require('fs');
let code = fs.readFileSync('src/main.tsx', 'utf8');
code = code.replace(/document\.addEventListener\("click", \(e\) => {[\s\S]*?}, true\);/g, "");
fs.writeFileSync('src/main.tsx', code);
