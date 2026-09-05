import { Home, MessageSquare, Compass, User as UserIcon, Plus, Settings, BarChart2, Bookmark } from 'lucide-react';
import { cn } from '../../lib/utils';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onNewSession: () => void;
}

export function Sidebar({ currentTab, setCurrentTab, onNewSession }: SidebarProps) {
  const tabs = [
    { id: 'home', label: 'Journal', icon: Home },
    { id: 'emotional_landscape', label: 'Emotional Landscape', icon: Compass },
    { id: 'ai_insights', label: 'AI Insights', icon: BarChart2 },
    { id: 'history', label: 'Chat History', icon: MessageSquare },
    
    { id: 'profile', label: 'Profile', icon: UserIcon },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="hidden md:flex flex-col w-64 h-full bg-slate-50 dark:bg-slate-900 border-r border-stone-200 dark:border-stone-800/50 transition-colors py-6 px-4">
      <div className="flex items-center gap-3 mb-8 px-2">
        <div className="w-8 h-8 bg-slate-900 dark:bg-slate-100 rounded-lg flex items-center justify-center shadow-sm">
          <MessageSquare className="w-4 h-4 text-white dark:text-slate-900" />
        </div>
        <span className="font-serif font-semibold text-lg text-slate-900 dark:text-slate-100 tracking-tight">AI Journal</span>
      </div>
      
      <button
        onClick={onNewSession}
        className="w-full mb-8 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-xl py-3 px-4 flex items-center justify-center gap-2 transition-all font-medium text-sm shadow-sm"
      >
        <Plus className="w-4 h-4" /> New Chat
      </button>

      <nav className="flex flex-col gap-2 flex-1">
        {tabs.map(tab => {
          const active = currentTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setCurrentTab(tab.id)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-300",
                active 
                  ? "bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-100" 
                  : "text-slate-600 dark:text-slate-400 hover:bg-stone-200/50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-slate-200"
              )}
            >
              <Icon className={cn("w-4 h-4", active ? "text-slate-900 dark:text-slate-100" : "")} />
              {tab.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
