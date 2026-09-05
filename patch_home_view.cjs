const fs = require('fs');
let code = fs.readFileSync('src/components/views/HomeView.tsx', 'utf8');

const importRegex = /import \{ ChatView \} from '\.\/ChatView';/;
code = code.replace(importRegex, "import { ChatView } from './ChatView';\nimport { DiscoveriesWidget } from './DiscoveriesWidget';");

const targetRegex = /\{\/\* Emotional Landscape Preview \*\/\}/;
const replacement = `
        {/* Discoveries Widget */}
        <DiscoveriesWidget />

        {/* Emotional Landscape Preview */}`;
code = code.replace(targetRegex, replacement);

fs.writeFileSync('src/components/views/HomeView.tsx', code);
console.log("Patched HomeView");
