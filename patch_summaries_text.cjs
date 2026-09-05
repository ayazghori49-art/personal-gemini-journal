const fs = require('fs');
let code = fs.readFileSync('src/components/views/SummariesView.tsx', 'utf8');

const targetText = /let txt = \`Date: \$\{new Date\(e\.createdAt\)\.toLocaleString\(\)\}\\n\`;/;
const newText = `const ts = e.updatedAt || e.createdAt;
        let txt = \`Date: \$\{new Date(ts).toLocaleString()\}\\n\`;`;

code = code.replace(targetText, newText);

fs.writeFileSync('src/components/views/SummariesView.tsx', code);
console.log("Patched SummariesView text");
