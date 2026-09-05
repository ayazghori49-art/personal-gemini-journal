import { Activity, BriefcaseBusiness, Code, Shield, Navigation, FileText, Lightbulb, MessageCircle, PenLine } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useRef } from 'react';

interface ModeSelectorProps {
  currentMode: string;
  onSelectMode: (mode: string) => void;
  recentModes?: string[];
}

export const MODES = [
  { id: 'Ask My Journal', label: 'Ask My Journal', desc: 'Chat with your memories', icon: MessageCircle },
  { id: 'Default Journal mode', label: 'Journal', desc: 'Reflective journaling', icon: PenLine },
  { id: 'Morning Intention mode', label: 'Morning Intention', desc: 'Set your daily goals', icon: Activity },
  { id: 'Evening Reflection mode', label: 'Evening Reflection', desc: 'Review your day', icon: MessageCircle },
  { id: 'Today Goal mode', label: "Today's Goal", desc: 'Focus on one thing', icon: Lightbulb },
  { id: 'Fitness Coach mode', label: 'Fitness', desc: 'Training & health', icon: Activity },
  { id: 'Business Advisor mode', label: 'Business', desc: 'Strategy & growth', icon: BriefcaseBusiness },
  { id: 'Tech Advisor mode', label: 'Tech', desc: 'Code & architecture', icon: Code },
  { id: 'Career Navigator mode', label: 'Career', desc: 'Step-by-step roadmap', icon: Navigation },
  { id: 'Government/Legal Form Helper mode', label: 'Forms', desc: 'Gov documents explained', icon: FileText },
  { id: 'Problem Solver mode', label: 'Solver', desc: 'Options, steps, risks', icon: Lightbulb },
  { id: 'Simple Explainer mode', label: 'Explainer', desc: 'Explain in simple terms', icon: MessageCircle },
  { id: 'Security Awareness mode', label: 'Security', desc: 'Safe cyber education', icon: Shield },
];

export function ModeSelector({ currentMode, onSelectMode, recentModes = [] }: ModeSelectorProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Sort modes to put recent ones first, removing duplicates
  const orderedModes = [...MODES].sort((a, b) => {
    const aIdx = recentModes.indexOf(a.id);
    const bIdx = recentModes.indexOf(b.id);
    if (aIdx !== -1 && bIdx !== -1) return aIdx - bIdx;
    if (aIdx !== -1) return -1;
    if (bIdx !== -1) return 1;
    return 0;
  });

  return (
    <div className="w-full bg-slate-50 dark:bg-slate-950/50 border-b border-slate-200 dark:border-slate-800/50 py-3">
      <div 
        ref={scrollRef}
        className="flex overflow-x-auto gap-3 px-4 sm:px-6 hide-scrollbar snap-x snap-mandatory"
      >
        {orderedModes.map(mode => {
          const active = currentMode === mode.id;
          const Icon = mode.icon;
          return (
            <button
              key={mode.id}
              onClick={() => onSelectMode(mode.id)}
              className={cn(
                "flex items-center gap-3 shrink-0 py-2 px-3 sm:px-4 rounded-xl border transition-all duration-300 snap-center",
                active 
                  ? "bg-white dark:bg-slate-800 border-indigo-200 dark:border-indigo-800 shadow-sm" 
                  : "bg-transparent border-transparent hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:border-slate-200 dark:hover:border-slate-700"
              )}
            >
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center transition-colors",
                active ? "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400" : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
              )}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="text-left hidden sm:block">
                <div className={cn("font-semibold text-sm", active ? "text-indigo-950 dark:text-indigo-100" : "text-slate-700 dark:text-slate-300")}>{mode.label}</div>
                <div className="text-[11px] text-slate-500">{mode.desc}</div>
              </div>
              <div className="text-left sm:hidden">
                <div className={cn("font-medium text-sm", active ? "text-indigo-950 dark:text-indigo-100" : "text-slate-700 dark:text-slate-300")}>{mode.label}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
