const fs = require('fs');
let code = fs.readFileSync('src/components/views/SettingsView.tsx', 'utf8');

const interfaceRegex = /onClearHistory: \(\) => Promise<void>;/;
const interfaceReplacement = `onClearHistory: () => Promise<void>;
  onClearAllData?: () => Promise<void>;`;

code = code.replace(interfaceRegex, interfaceReplacement);

const propsRegex = /onClearHistory, onOpenDrawer, onNavigateBack, onLogout \}: SettingsViewProps\) \{/;
const propsReplacement = `onClearHistory, onClearAllData, onOpenDrawer, onNavigateBack, onLogout }: SettingsViewProps) {`;

code = code.replace(propsRegex, propsReplacement);

const htmlRegex = /<h3 className="text-sm font-medium text-stone-500 mb-4">\{t\('general', lang\)\}<\/h3>/;
const htmlReplacement = `<h3 className="text-sm font-medium text-stone-500 mb-4">{t('general', lang)}</h3>
          <div className="premium-card p-2 mb-4 space-y-1 relative z-20 pointer-events-auto">
            <button onClick={async () => {
              if (onClearAllData) {
                if (confirm('Are you sure? This will permanently delete all your journal data, chat history, saved moments, memories, summaries, and entries.')) {
                  try {
                    await onClearAllData();
                    alert('All data cleared successfully');
                  } catch (err: any) {
                    alert('Clear data failed: ' + err.message);
                  }
                }
              }
            }} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors group">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center text-red-600 dark:text-red-400">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                </div>
                <span className="text-red-600 dark:text-red-400 font-medium">Clear All Data</span>
              </div>
            </button>
          </div>
          <h3 className="text-sm font-medium text-stone-500 mb-4">{t('general', lang)}</h3>`;

code = code.replace(htmlRegex, htmlReplacement);
// deduplicate the double general heading if it inserted it
code = code.replace(/<h3 className="text-sm font-medium text-stone-500 mb-4">\{t\('general', lang\)\}<\/h3>\n          <h3 className="text-sm font-medium text-stone-500 mb-4">\{t\('general', lang\)\}<\/h3>/g, `<h3 className="text-sm font-medium text-stone-500 mb-4">{t('general', lang)}</h3>`);


fs.writeFileSync('src/components/views/SettingsView.tsx', code);
console.log("Patched SettingsView");
