const fs = require('fs');
let code = fs.readFileSync('src/components/JournalApp.tsx', 'utf8');

const importRegex = /import \{ MemoriesView \} from '\.\/views\/MemoriesView';/;
const newImport = `import { MemoriesView } from './views/MemoriesView';
import { SummariesView } from './views/SummariesView';`;
code = code.replace(importRegex, newImport);

const viewRegex = /\{currentTab === 'memories' && \(\s*<MemoriesView onOpenDrawer=\{\(\) => setIsDrawerOpen\(true\)\} onNavigateBack=\{\(\) => setCurrentTab\('home'\)\} \/>\s*\)\}/;
const newView = `{currentTab === 'memories' && (
          <MemoriesView onOpenDrawer={() => setIsDrawerOpen(true)} onNavigateBack={() => setCurrentTab('home')} />
        )}

        {currentTab === 'summaries' && (
          <SummariesView onOpenDrawer={() => setIsDrawerOpen(true)} onNavigateBack={() => setCurrentTab('home')} />
        )}`;
code = code.replace(viewRegex, newView);

const navRegex = /else if \(tab === 'memories'\) setCurrentTab\('memories'\);/;
const newNav = `else if (tab === 'memories') setCurrentTab('memories');
            else if (tab === 'summaries') setCurrentTab('summaries');`;
code = code.replace(navRegex, newNav);

fs.writeFileSync('src/components/JournalApp.tsx', code);
console.log("Patched JournalApp");
