const fs = require('fs');
let code = fs.readFileSync('src/components/layout/Drawer.tsx', 'utf8');
code = code.replace(/\\n\\n          <button/g, '          <button');
fs.writeFileSync('src/components/layout/Drawer.tsx', code);
