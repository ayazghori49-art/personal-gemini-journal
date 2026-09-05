import { useState } from 'react';
import { UserSettings } from '../../hooks/useUserSettings';
import { t } from '../../lib/i18n';

interface SettingsViewProps {
  onLogout?: () => void;
  settings: UserSettings;
  updateSettings: (newSettings: Partial<UserSettings>) => Promise<void>;
  onClearHistory: () => Promise<void>;
  onClearAllData?: () => Promise<void>;
  onOpenDrawer: () => void;
  onNavigateBack: () => void;
}

export function SettingsView({ settings, updateSettings, onClearHistory, onClearAllData, onOpenDrawer, onNavigateBack, onLogout }: SettingsViewProps) {
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const onSignOut = () => { if(onLogout) onLogout(); else window.location.reload(); };
  const lang = settings.language || 'en';


  return (
    <div className="flex-1 flex flex-col h-full bg-transparent custom-scrollbar overflow-y-auto">
      <div className="px-6 pt-12 pb-6 flex items-center justify-between sticky top-0 bg-white/40 dark:bg-[#0D0D12]/60 backdrop-blur-2xl backdrop-blur-md z-10">
        <button onClick={onNavigateBack} className="p-2 -ml-2 rounded-full hover:bg-stone-200/50 dark:hover:bg-stone-800/50 transition-colors">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-800 dark:text-slate-200"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <h2 className="font-serif font-medium text-[17px] text-slate-900 dark:text-slate-100">{t('settings', lang)}</h2>
        <button className="p-2 -mr-2 rounded-full hover:bg-stone-200/50 dark:hover:bg-stone-800/50 transition-colors opacity-0 disabled">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
        </button>
      </div>
      
      <div className="px-6 pb-24">
        <div className="mb-8">
          <h3 className="text-sm font-medium text-stone-500 mb-4">{t('appearance', lang)}</h3>
          <div className="premium-card p-2">
            <button onClick={() => updateSettings({ darkMode: false })} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-600 dark:text-slate-300"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
                </div>
                <span className="text-slate-900 dark:text-slate-100 font-medium">{t('light_mode', lang)}</span>
              </div>
              {!settings.darkMode && <div className="w-5 h-5 rounded-full bg-violet-600 dark:bg-violet-500 flex items-center justify-center"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg></div>}
            </button>
            <button onClick={() => updateSettings({ darkMode: true })} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-600 dark:text-slate-300"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
                </div>
                <span className="text-slate-900 dark:text-slate-100 font-medium">{t('dark_mode', lang)}</span>
              </div>
              {settings.darkMode && <div className="w-5 h-5 rounded-full bg-violet-600 dark:bg-violet-500 flex items-center justify-center"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg></div>}
            </button>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-sm font-medium text-stone-500 mb-4">{t('general', lang)}</h3>
          <div className="premium-card p-2 mb-4 space-y-1 relative z-20 pointer-events-auto">
            <button onClick={() => setShowClearDialog(true)} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors group">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center text-red-600 dark:text-red-400">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                </div>
                <span className="text-red-600 dark:text-red-400 font-medium">Clear All Data</span>
              </div>
            </button>
          </div>
          <h3 className="text-sm font-medium text-stone-500 mb-4">{t('general', lang)}</h3>
          <div className="premium-card p-2 space-y-1 relative z-20 pointer-events-auto">

            <label className="flex items-center justify-between p-3 cursor-pointer hover:bg-stone-50 dark:hover:bg-stone-800/50 rounded-xl transition-colors">
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
            </label>
          </div>
        </div>
        
        <button onClick={onSignOut} className="w-full py-4 text-red-500 font-medium bg-red-50 dark:bg-red-500/10 rounded-[1.5rem] border border-red-100 dark:border-red-900/30">
          {t('sign_out', lang)}
        </button>
            {showClearDialog && (
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
  );
}
