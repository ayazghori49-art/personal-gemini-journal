const fs = require('fs');
let code = fs.readFileSync('src/hooks/useDiscoveries.ts', 'utf8');

code = code.replace(/return newDocs;\s*\}\s*\};/g, 'return newDocs;\n  };');
fs.writeFileSync('src/hooks/useDiscoveries.ts', code);
console.log("Fixed useDiscoveries.ts syntax");
