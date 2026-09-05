const fs = require('fs');
let code = fs.readFileSync('src/components/JournalApp.tsx', 'utf8');

const viewTarget = /\{currentTab === 'ai_insights' && \(\s*<AnalyticsInsightsView[\s\S]*?\/>\s*\)\}/;
const viewReplacement = `{currentTab === 'ai_insights' && (
          <AnalyticsInsightsView lang={settings.language} onOpenDrawer={() => setIsDrawerOpen(true)} 
            entries={entries}
            onAction={handleAction}
            onNavigateBack={() => setCurrentTab('home')}
          />
        )}

        {currentTab === 'discoveries' && (
          <DiscoveriesView onOpenDrawer={() => setIsDrawerOpen(true)} onNavigateBack={() => setCurrentTab('home')} />
        )}`;

code = code.replace(viewTarget, viewReplacement);
fs.writeFileSync('src/components/JournalApp.tsx', code);
console.log("Patched JournalApp");
