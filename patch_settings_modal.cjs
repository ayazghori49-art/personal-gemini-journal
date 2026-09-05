const fs = require('fs');
let code = fs.readFileSync('src/components/views/SettingsView.tsx', 'utf8');

// We need to add useState to imports
if (!code.includes('import { useState }')) {
  code = code.replace(/import \{ UserSettings \} from '\.\.\/\.\.\/hooks\/useUserSettings';/, `import { useState } from 'react';\nimport { UserSettings } from '../../hooks/useUserSettings';`);
}

// Add state variables inside the component
const componentStartRegex = /export function SettingsView\(\{.*?\}\: SettingsViewProps\) \{/;
code = code.replace(componentStartRegex, (match) => {
  return match + `\n  const [showClearDialog, setShowClearDialog] = useState(false);\n  const [isClearing, setIsClearing] = useState(false);`;
});

// Update the button onClick to just open the dialog
const buttonRegex = /<button onClick=\{async \(\) => \{[\s\S]*?\}\} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900\/20 transition-colors group">/;
code = code.replace(buttonRegex, `<button onClick={() => setShowClearDialog(true)} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors group">`);

// Add the dialog UI at the end of the return statement
const returnEndRegex = /<\/div>\n    <\/div>\n  \);/;
const dialogJSX = `      {showClearDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 max-w-sm w-full shadow-xl border border-slate-200 dark:border-slate-800">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">Clear All Data</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
              Are you sure? This will permanently delete all your journal data, chat history, saved moments, memories, summaries, and entries.
            </p>
            <div className="flex gap-3 justify-end">
              <button 
                disabled={isClearing}
                onClick={() => setShowClearDialog(false)} 
                className="px-4 py-2 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button 
                disabled={isClearing}
                onClick={async () => {
                  if (!onClearAllData) return;
                  setIsClearing(true);
                  try {
                    await onClearAllData();
                    setShowClearDialog(false);
                    alert('All data cleared successfully');
                  } catch (err: any) {
                    alert('Clear data failed: ' + err.message);
                  } finally {
                    setIsClearing(false);
                  }
                }} 
                className="px-4 py-2 rounded-xl text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {isClearing ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Clearing...
                  </>
                ) : 'Delete Everything'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );`;
code = code.replace(returnEndRegex, dialogJSX);

fs.writeFileSync('src/components/views/SettingsView.tsx', code);
console.log("Patched SettingsView with Modal");
