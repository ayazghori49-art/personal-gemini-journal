import { Book, Compass, Sparkles, MessageSquare } from 'lucide-react';
import { cn } from '../../lib/utils';

interface BottomNavProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
}

export function BottomNav({ currentTab, onNavigate }: BottomNavProps) {
  const navItems = [
    { id: 'home', icon: Book, label: 'Journal' },
    { id: 'emotional_landscape', icon: Compass, label: 'Landscape' },
    { id: 'ai_insights', icon: Sparkles, label: 'AI Insights' },
    { id: 'history', icon: MessageSquare, label: 'Chat' },
  ];

  return (
    <nav className="flex-shrink-0 bg-white/40 dark:bg-[#0D0D12]/60 backdrop-blur-2xl border-t border-white/20 dark:border-white/5 premium-shadow pb-safe relative z-[50]">
      <div className="flex justify-around items-center px-2 py-2">
        {navItems.map((item) => {
          const isActive = currentTab === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className="flex flex-col items-center justify-center p-2 w-16 gap-1"
            >
              <div className={cn(
                "w-12 h-8 rounded-full flex items-center justify-center transition-colors",
                isActive 
                  ? "bg-violet-600 dark:bg-violet-500/20 text-violet-600 dark:text-violet-400 dark:text-[#B6A2F2]" 
                  : "text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-400"
              )}>
                <Icon className={cn("w-5 h-5", isActive ? "fill-current" : "")} />
              </div>
              <span className={cn(
                "text-[10px] font-medium transition-colors",
                isActive 
                  ? "text-violet-600 dark:text-violet-400 dark:text-[#B6A2F2]" 
                  : "text-stone-400 dark:text-stone-500"
              )}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
