const fs = require('fs');
let code = fs.readFileSync('src/components/views/SettingsView.tsx', 'utf8');

// Remove toggleNotifications function
code = code.replace(/  const toggleNotifications = async \(\) => \{[\s\S]*?  \};\n/, '');

// Remove the buttons/labels for notifications and daily reminder
// We want to remove the first two <button> / <label> inside the "general" section
const toRemove1 = `            <button onClick={toggleNotifications} className="w-full flex items-center justify-between p-3 hover:bg-stone-50 dark:hover:bg-stone-800/50 rounded-xl transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-600 dark:text-slate-300"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
                </div>
                <span className="text-slate-900 dark:text-slate-100 font-medium">{t('notifications', lang)}</span>
              </div>
              <div className={\`w-11 h-6 rounded-full relative transition-colors \${settings.notificationsEnabled ? 'bg-violet-600 dark:bg-violet-500' : 'bg-stone-300 dark:bg-stone-600'}\`}>
                <div className={\`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform \${settings.notificationsEnabled ? 'right-1' : 'left-1'}\`}></div>
              </div>
            </button>
            <label className="flex items-center justify-between p-3 cursor-pointer hover:bg-stone-50 dark:hover:bg-stone-800/50 rounded-xl transition-colors">
              <div className="flex items-center gap-3">
                <input 
                  type="checkbox"
                  checked={settings.dailyReminderEnabled}
                  onChange={(e) => updateSettings({ dailyReminderEnabled: e.target.checked })}
                  disabled={!settings.notificationsEnabled}
                  className="w-4 h-4 ml-2 accent-[#9b87f5] cursor-pointer disabled:opacity-50"
                />
                <span className={\`text-stone-600 dark:text-stone-400 select-none \${!settings.notificationsEnabled ? 'opacity-50' : ''}\`}>{t('daily_reminder', lang)}</span>
              </div>
              <div className="flex items-center gap-2 text-stone-500 text-sm">
                <input 
                  type="time" 
                  value={settings.dailyReminderTime || '20:00'} 
                  onChange={(e) => updateSettings({ dailyReminderTime: e.target.value })}
                  disabled={!settings.dailyReminderEnabled || !settings.notificationsEnabled}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-transparent focus:outline-none border border-stone-200 dark:border-stone-700 rounded px-2 py-1 disabled:opacity-50 cursor-pointer"
                />
              </div>
            </label>`;

code = code.replace(toRemove1, '');

fs.writeFileSync('src/components/views/SettingsView.tsx', code);
