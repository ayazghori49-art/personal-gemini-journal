import React, { useState } from 'react';
import { auth } from '../../lib/firebase';
import { updateProfile } from 'firebase/auth';
import { t } from '../../lib/i18n';

export function EditProfileView({ onNavigateBack, lang = "en" }: any) {
  const user = auth.currentUser;
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSave = async () => {
    if (!user) return;
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await updateProfile(user, {
        displayName: displayName
      });
      setSuccess('Profile updated successfully.');
      setTimeout(() => {
        onNavigateBack();
      }, 1500);
    } catch (e: any) {
      console.error(e);
      setError(e.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-transparent custom-scrollbar overflow-y-auto">
      <div className="px-6 pt-12 pb-6 flex items-center justify-between sticky top-0 bg-white/40 dark:bg-[#0D0D12]/60 backdrop-blur-2xl backdrop-blur-md z-10">
        <button onClick={onNavigateBack} className="p-2 -ml-2 rounded-full hover:bg-stone-200/50 dark:hover:bg-stone-800/50 transition-colors">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-800 dark:text-slate-200"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <h2 className="font-serif font-medium text-[17px] text-slate-900 dark:text-slate-100">Edit Profile</h2>
        <div className="w-9" /> {/* Spacer */}
      </div>

      <div className="px-6 pb-24">
        <div className="flex flex-col items-center mt-6 mb-8">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-stone-200 dark:bg-stone-800 mb-4 border-4 border-white dark:border-[#1A1A1A] shadow-md">
            {user?.photoURL ? (
              <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-stone-400">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </div>
            )}
          </div>
          <p className="text-stone-500 text-sm">{user?.email || 'user@example.com'}</p>
        </div>

        <div className="mb-8 space-y-4">
          <div>
            <label className="block text-sm font-medium text-stone-500 mb-2">Display Name</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-[#1A1A1A] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
              placeholder="Your name"
            />
          </div>
        </div>

        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
        {success && <div className="text-green-500 text-sm mb-4">{success}</div>}

        <button 
          onClick={handleSave} 
          disabled={loading}
          className="w-full py-4 text-white font-medium bg-violet-600 dark:bg-violet-500 rounded-[1.5rem] shadow-md hover:bg-violet-700 dark:hover:bg-violet-600 transition-colors disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}
