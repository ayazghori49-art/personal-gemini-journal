const fs = require('fs');
let code = fs.readFileSync('src/components/views/SettingsView.tsx', 'utf8');

code = code.replace(/alert\('Notification permission is required to enable notifications.'\);/g, "console.warn('Notification permission is required to enable notifications.');");
code = code.replace(/alert\('Your browser does not support notifications.'\);/g, "console.warn('Your browser does not support notifications.');");

const dailyReminderChunk = `<div className="flex items-center justify-between p-3">
              <div className="flex items-center gap-3">
                <input onClick={(e) => console.log("Clicked Input", e.target)}  
                  type="checkbox"
                  checked={settings.dailyReminderEnabled}
                  onChange={(e) => updateSettings({ dailyReminderEnabled: e.target.checked })}
                  className="w-4 h-4 ml-2 accent-[#9b87f5]"
                />
                <span className="text-stone-600 dark:text-stone-400">{t('daily_reminder', lang)}</span>
              </div>
              <div className="flex items-center gap-2 text-stone-500 text-sm">
                <input onClick={(e) => console.log("Clicked Input", e.target)}  
                  type="time" 
                  value={settings.dailyReminderTime || '20:00'} 
                  onChange={(e) => updateSettings({ dailyReminderTime: e.target.value })}
                  disabled={!settings.dailyReminderEnabled}
                  className="bg-transparent focus:outline-none border border-stone-200 dark:border-stone-700 rounded px-2 py-1 disabled:opacity-50"
                />
              </div>
            </div>`;

const dailyReminderReplacement = `<label className="flex items-center justify-between p-3 cursor-pointer hover:bg-stone-50 dark:hover:bg-stone-800/50 rounded-xl transition-colors">
              <div className="flex items-center gap-3">
                <input 
                  type="checkbox"
                  checked={settings.dailyReminderEnabled}
                  onChange={(e) => updateSettings({ dailyReminderEnabled: e.target.checked })}
                  className="w-4 h-4 ml-2 accent-[#9b87f5] cursor-pointer"
                />
                <span className="text-stone-600 dark:text-stone-400 select-none">{t('daily_reminder', lang)}</span>
              </div>
              <div className="flex items-center gap-2 text-stone-500 text-sm">
                <input 
                  type="time" 
                  value={settings.dailyReminderTime || '20:00'} 
                  onChange={(e) => updateSettings({ dailyReminderTime: e.target.value })}
                  disabled={!settings.dailyReminderEnabled}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-transparent focus:outline-none border border-stone-200 dark:border-stone-700 rounded px-2 py-1 disabled:opacity-50 cursor-pointer"
                />
              </div>
            </label>`;

const languageChunk = `<div className="flex items-center justify-between p-3">
              <span className="text-stone-600 dark:text-stone-400 pl-11">{t('language', lang)}</span>
              <div className="flex items-center gap-2 text-stone-500 text-sm">
                <select 
                  value={settings.language || 'en'} 
                  onChange={(e) => updateSettings({ language: e.target.value })}
                  className="bg-transparent focus:outline-none cursor-pointer"
                >
                  <option value="en">English</option>
                  <option value="hi">Hindi</option>
                </select>
              </div>
            </div>`;

const languageReplacement = `<label className="flex items-center justify-between p-3 cursor-pointer hover:bg-stone-50 dark:hover:bg-stone-800/50 rounded-xl transition-colors">
              <span className="text-stone-600 dark:text-stone-400 pl-11 select-none">{t('language', lang)}</span>
              <div className="flex items-center gap-2 text-stone-500 text-sm">
                <select 
                  value={settings.language || 'en'} 
                  onChange={(e) => updateSettings({ language: e.target.value })}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-transparent focus:outline-none cursor-pointer"
                >
                  <option value="en">English</option>
                  <option value="hi">Hindi</option>
                </select>
              </div>
            </label>`;

code = code.replace(dailyReminderChunk, dailyReminderReplacement);
code = code.replace(languageChunk, languageReplacement);

fs.writeFileSync('src/components/views/SettingsView.tsx', code);
