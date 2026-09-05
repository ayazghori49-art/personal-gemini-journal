import { useEffect, useState } from 'react';
import { Login } from './components/Login';
import { JournalApp } from './components/JournalApp';
import { useUserSettings } from './hooks/useUserSettings';
import { auth } from './lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { Loader2 } from 'lucide-react';

function ThemeWrapper({ children }: { children: React.ReactNode }) {
  const { settings } = useUserSettings();

  useEffect(() => {
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.darkMode]);

  return <>{children}</>;
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF9F6] dark:bg-[#0D0D12]">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    );
  }

  return user ? (
    <ThemeWrapper><JournalApp onLogout={() => auth.signOut()} user={user} /></ThemeWrapper>
  ) : (
    <Login />
  );
}
