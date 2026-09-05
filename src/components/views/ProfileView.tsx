import { auth } from '../../lib/firebase';
import { t } from '../../lib/i18n';

import { ArrowLeft } from 'lucide-react';
export function ProfileView({ profileName, onOpenDrawer, onNavigateToSettings, onNavigateToEditProfile, onNavigateToReminders, onLogout, onExportData, lang = "en" , onNavigateBack}: any) {
  const user = auth.currentUser;

  return (
    <div className="flex-1 flex flex-col h-full bg-transparent custom-scrollbar overflow-y-auto">
      <div className="px-6 pt-12 pb-6 flex items-center justify-between sticky top-0 bg-white/40 dark:bg-[#0D0D12]/60 backdrop-blur-2xl backdrop-blur-md z-10">
        <button onClick={onNavigateBack} className="p-2 -ml-2 rounded-full hover:bg-stone-200/50 dark:hover:bg-stone-800/50 transition-colors">
          <ArrowLeft className="w-5 h-5 text-slate-800 dark:text-slate-200" />
        </button>
        <h2 className="font-serif font-medium text-[17px] text-slate-900 dark:text-slate-100">{t('profile', lang)}</h2>
        <button className="p-2 -mr-2 rounded-full hover:bg-stone-200/50 dark:hover:bg-stone-800/50 transition-colors">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-800 dark:text-slate-200"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
        </button>
      </div>

      <div className="px-6 pb-24">
        <div className="flex flex-col items-center mt-6 mb-12">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-stone-200 dark:bg-stone-800 mb-4 border-4 border-white dark:border-[#1A1A1A] shadow-md">
            {user?.photoURL ? (
              <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-stone-400">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </div>
            )}
          </div>
          <h1 className="font-serif text-2xl text-slate-900 dark:text-slate-100">{profileName === 'there' ? 'User' : (profileName || 'User')}</h1>
          <p className="text-stone-500 text-sm mt-1">{user?.email || 'user@example.com'}</p>
        </div>

        <div className="space-y-3">
          {[
            { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>, label: 'Edit Profile', onClick: onNavigateToEditProfile },
            { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>, label: 'Journal Reminders', onClick: onNavigateToReminders },
            { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1Z"/></svg>, label: 'Settings', onClick: onNavigateToSettings },
            { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>, label: 'Export My Data', onClick: onExportData },
            { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>, label: 'Log Out', onClick: onLogout }
          ].map((item, i) => (
            <button key={i} onClick={item.onClick} className="w-full flex items-center justify-between p-4 rounded-[1.5rem] premium-card hover:shadow-md transition-all active:scale-[0.98] group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-stone-50 dark:bg-stone-800 rounded-full flex items-center justify-center text-stone-500">
                  {item.icon}
                </div>
                <span className="font-medium text-slate-900 dark:text-slate-100">{item.label}</span>
              </div>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-stone-400 group-hover:text-stone-600 dark:group-hover:text-stone-300 transition-colors"><path d="m9 18 6-6-6-6"/></svg>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
