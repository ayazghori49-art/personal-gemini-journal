import { t } from '../../lib/i18n';
import { Bookmark, X, Plus, MessageSquare, Compass, User, Settings, Home, BarChart2, Search, BrainCircuit, FileText } from 'lucide-react';
import { cn } from '../../lib/utils';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: string) => void;
}

export function Drawer({ isOpen, onClose, onNavigate , lang = 'en'}: DrawerProps & {lang?: string}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex">
      <div 
        className="fixed inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div className="relative w-72 max-w-sm flex-1 bg-white/80 dark:bg-[#0D0D12]/80 backdrop-blur-2xl shadow-2xl border-r border-white/20 dark:border-white/5 transition-transform transform border-r border-slate-200 dark:border-slate-800/50 flex flex-col">
        <div className="pt-12 px-6 pb-6 flex items-center justify-between border-b border-slate-200 dark:border-slate-800/50">
          <span className="font-serif font-semibold text-lg text-slate-900 dark:text-slate-100 tracking-tight">AI Journal</span>
          <button 
            onClick={onClose}
            className="p-2 -mr-2 rounded-lg hover:bg-stone-200/50 dark:hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          <button
            onClick={() => {
              onNavigate('home');
              onClose();
            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-colors text-slate-700 dark:text-slate-300 hover:bg-stone-200/50 dark:hover:bg-white/5"
          >
            <Home className="w-4 h-4 text-slate-400" /> Journal
          </button>
          
          <button
            onClick={() => {
              onNavigate('emotional_landscape');
              onClose();
            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-colors text-slate-700 dark:text-slate-300 hover:bg-stone-200/50 dark:hover:bg-white/5"
          >
            <Compass className="w-4 h-4 text-slate-400" /> Emotional Landscape
          </button>
          
          <button
            onClick={() => {
              onNavigate('ai_insights');
              onClose();
            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-colors text-slate-700 dark:text-slate-300 hover:bg-stone-200/50 dark:hover:bg-white/5"
          >
            <BarChart2 className="w-4 h-4 text-slate-400" /> AI Insights
          </button>

          <button
            onClick={() => {
              onNavigate('discoveries');
              onClose();
            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-colors text-slate-700 dark:text-slate-300 hover:bg-stone-200/50 dark:hover:bg-white/5"
          >
            <Search className="w-4 h-4 text-slate-400" /> Discover Something About Me
          </button>
          
          <button
            onClick={() => {
              onNavigate('history');
              onClose();
            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-colors text-slate-700 dark:text-slate-300 hover:bg-stone-200/50 dark:hover:bg-white/5"
          >
            <MessageSquare className="w-4 h-4 text-slate-400" /> Chat History
          </button>
          
          <button
            onClick={() => {
              onNavigate('summaries');
              onClose();
            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-colors text-slate-700 dark:text-slate-300 hover:bg-stone-200/50 dark:hover:bg-white/5"
          >
            <FileText className="w-4 h-4 text-slate-400" /> Summaries
          </button>
          
          <button
            onClick={() => {
              onNavigate('memories');
              onClose();
            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-colors text-slate-700 dark:text-slate-300 hover:bg-stone-200/50 dark:hover:bg-white/5"
          >
            <BrainCircuit className="w-4 h-4 text-slate-400" /> Memories
          </button>          <button
            onClick={() => {
              onNavigate('saved_moments');
              onClose();
            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-colors text-slate-700 dark:text-slate-300 hover:bg-stone-200/50 dark:hover:bg-white/5"
          >
            <Bookmark className="w-4 h-4 text-slate-400" /> Saved Moments
          </button>
          
          <button
            onClick={() => {
              onNavigate('new_chat');
              onClose();
            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-colors text-slate-700 dark:text-slate-300 hover:bg-stone-200/50 dark:hover:bg-white/5"
          >
            <Plus className="w-4 h-4 text-slate-400" /> New Chat
          </button>
          
          <button
            onClick={() => {
              onNavigate('profile');
              onClose();
            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-colors text-slate-700 dark:text-slate-300 hover:bg-stone-200/50 dark:hover:bg-white/5"
          >
            <User className="w-4 h-4 text-slate-400" /> Profile
          </button>
          
          <button
            onClick={() => {
              onNavigate('settings');
              onClose();
            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-colors text-slate-700 dark:text-slate-300 hover:bg-stone-200/50 dark:hover:bg-white/5"
          >
            <Settings className="w-4 h-4 text-slate-400" /> Settings
          </button>
        </nav>
      </div>
    </div>
  );
}
