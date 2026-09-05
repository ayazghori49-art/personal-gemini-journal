import React from 'react';
import { t } from '../../lib/i18n';

export function JournalRemindersView({ onNavigateBack, settings, updateSettings, lang = "en" }: any) {
  const toggleNotifications = async () => {
    let newEnabled = !settings.notificationsEnabled;
    if (newEnabled && 'Notification' in window) {
      try {
        if (Notification.permission !== 'granted') {
          await Notification.requestPermission();
        }
      } catch (e) {
        console.error('Notification permission error:', e);
      }
    }
    await updateSettings({ notificationsEnabled: newEnabled });
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-transparent custom-scrollbar overflow-y-auto">
      <div className="px-6 pt-12 pb-6 flex items-center justify-between sticky top-0 bg-white/40 dark:bg-[#0D0D12]/60 backdrop-blur-2xl backdrop-blur-md z-10">
        <button onClick={onNavigateBack} className="p-2 -ml-2 rounded-full hover:bg-stone-200/50 dark:hover:bg-stone-800/50 transition-colors">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-800 dark:text-slate-200"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <h2 className="font-serif font-medium text-[17px] text-slate-900 dark:text-slate-100">Journal Reminders</h2>
        <div className="w-9" />
      </div>

      <div className="px-6 pb-24">
        <div className="mb-8">
          <h3 className="text-sm font-medium text-stone-500 mb-4">Reminder Settings</h3>
          <div className="premium-card p-2 space-y-1">
            <button onClick={toggleNotifications} className="w-full flex items-center justify-between p-3 hover:bg-stone-50 dark:hover:bg-stone-800/50 rounded-xl transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-600 dark:text-slate-300"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
                </div>
                <span className="text-slate-900 dark:text-slate-100 font-medium">{t('notifications', lang)}</span>
              </div>
              <div className={`w-11 h-6 rounded-full relative transition-colors ${settings.notificationsEnabled ? 'bg-violet-600 dark:bg-violet-500' : 'bg-stone-300 dark:bg-stone-600'}`}>
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${settings.notificationsEnabled ? 'right-1' : 'left-1'}`}></div>
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
                <span className={`text-stone-600 dark:text-stone-400 select-none ${!settings.notificationsEnabled ? 'opacity-50' : ''}`}>{t('daily_reminder', lang)}</span>
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
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
