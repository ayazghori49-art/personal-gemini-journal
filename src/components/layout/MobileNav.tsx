import { Home, MessageSquare, Compass, User as UserIcon } from 'lucide-react';
import { cn } from '../../lib/utils';

interface MobileNavProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export function MobileNav({ currentTab, setCurrentTab }: MobileNavProps) {
  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'journal', label: 'Journal', icon: MessageSquare },
    { id: 'journey', label: 'Journey', icon: Compass },
    { id: 'profile', label: 'Profile', icon: UserIcon },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 pb-safe z-50">
      <div className="flex items-center justify-around px-2 py-2">
        {tabs.map(tab => {
          const active = currentTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setCurrentTab(tab.id)}
              className="flex flex-col items-center gap-1 p-2 w-16"
            >
              <div className={cn(
                "flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300",
                active ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900" : "text-slate-500 dark:text-slate-400"
              )}>
                <Icon className={cn("w-5 h-5", active ? "scale-110" : "scale-100")} />
              </div>
              <span className={cn(
                "text-[10px] font-medium transition-colors",
                active ? "text-slate-900 dark:text-slate-100" : "text-slate-500 dark:text-slate-400"
              )}>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
