const fs = require('fs');
let code = fs.readFileSync('src/components/views/HomeView.tsx', 'utf8');

// Remove import
code = code.replace(/import \{ DiscoveriesWidget \} from '\.\/DiscoveriesWidget';\n?/, '');

// Remove widget render
const widgetRegex = /\{\/\* Discoveries Widget \*\/\}\s*<DiscoveriesWidget \/>\s*/m;
code = code.replace(widgetRegex, '');

fs.writeFileSync('src/components/views/HomeView.tsx', code);
console.log("Patched HomeView");
