const fs = require('fs');
let code = fs.readFileSync('src/components/JournalApp.tsx', 'utf8');

const importTarget = /import \{ AnalyticsInsightsView \} from '\.\/views\/AnalyticsInsightsView';/;
code = code.replace(importTarget, "import { AnalyticsInsightsView } from './views/AnalyticsInsightsView';\nimport { DiscoveriesView } from './views/DiscoveriesView';");

const viewTarget = /\{currentTab === 'ai_insights' && \(\s*<AnalyticsInsightsView lang=\{settings.language\} onOpenDrawer=\{\(\) => setIsDrawerOpen\(true\)\} onNavigateBack=\{\(\) => setCurrentTab\('home'\)\} entries=\{entries\} \/>\s*\)\}/;
const viewReplacement = `{currentTab === 'ai_insights' && (
          <AnalyticsInsightsView lang={settings.language} onOpenDrawer={() => setIsDrawerOpen(true)} onNavigateBack={() => setCurrentTab('home')} entries={entries} />
        )}

        {currentTab === 'discoveries' && (
          <DiscoveriesView onOpenDrawer={() => setIsDrawerOpen(true)} onNavigateBack={() => setCurrentTab('home')} />
        )}`;
code = code.replace(viewTarget, viewReplacement);

const navTarget = /else if \(tab === 'ai_insights'\) setCurrentTab\('ai_insights'\);/;
const navReplacement = `else if (tab === 'ai_insights') setCurrentTab('ai_insights');
            else if (tab === 'discoveries') setCurrentTab('discoveries');`;
code = code.replace(navTarget, navReplacement);

fs.writeFileSync('src/components/JournalApp.tsx', code);
console.log("Patched JournalApp");
