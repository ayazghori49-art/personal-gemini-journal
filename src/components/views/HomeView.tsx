import { t } from '../../lib/i18n';
import { useState, useEffect, useMemo } from 'react';

import { ChatView } from './ChatView';
import { ChatMessage, JournalEntry } from '../../types';
import { Menu, Sparkles, Moon, Sun, ArrowRight, PenLine, Calendar } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

interface HomeViewProps {
  profileName?: string;
  messages: ChatMessage[];
  isLoading: boolean;
  onSendMessage: (text: string, attachments: any[]) => void;
  isRecording: boolean;
  onToggleMic: () => void;
  persona: string;
  onOpenDrawer?: () => void;
  entries?: JournalEntry[];
  onStartReflection?: () => void;
  onSelectMode?: (mode: string) => void;
  onOpenEntry?: (id: string) => void;
  onSetMood?: (mood: string) => void;
  onViewAllJournals?: () => void;
}


export function HomeView({ 
  profileName, 
  entries = [], 
  onStartReflection, 
  onSelectMode, 
  onOpenEntry, 
  onViewAllJournals, 
  onOpenDrawer 
, lang = 'en'}: any) {
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours();
      if (hour >= 5 && hour < 12) {
        setGreeting('Good morning,');
      } else if (hour >= 12 && hour < 17) {
        setGreeting('Good afternoon,');
      } else if (hour >= 17 && hour < 21) {
        setGreeting('Good evening,');
      } else {
        setGreeting('Good night,');
      }
    };
    
    updateGreeting();
    const interval = setInterval(updateGreeting, 60000);
    return () => clearInterval(interval);
  }, []);

return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto bg-transparent custom-scrollbar">
      {/* Top Header */}
      <div className="px-6 pt-12 pb-6 flex items-center justify-between sticky top-0 bg-white/40 dark:bg-[#0D0D12]/60 backdrop-blur-md z-10">
        <button onClick={onOpenDrawer} className="p-2 -ml-2 rounded-full hover:bg-stone-200/50 dark:hover:bg-stone-800/50 transition-colors">
          <Menu className="w-6 h-6 text-slate-800 dark:text-slate-200" />
        </button>
        <button className="p-2 -mr-2 rounded-full hover:bg-stone-200/50 dark:hover:bg-stone-800/50 transition-colors relative">
          <div className="absolute top-2 right-2.5 w-2 h-2 bg-violet-600 dark:bg-violet-500 rounded-full border border-white dark:border-[#121212]"></div>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-800 dark:text-slate-200"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
        </button>
      </div>

      <div className="px-6 pb-24">
        {/* Welcome Section */}
        <div className="flex justify-between items-start mb-2">
          <div>
            <p className="text-slate-500 dark:text-slate-400 text-[15px]">{greeting}</p>
            <h1 className="font-serif text-[2.5rem] leading-[1.1] text-stone-900 dark:text-stone-50 font-medium tracking-tight mt-1">
              {profileName || 'Guest'} 👋
            </h1>
          </div>
          <div className="text-right">
            <p className="text-stone-900 dark:text-stone-200 font-medium text-[15px]">{new Date().toLocaleDateString('en-US', { weekday: 'short' })}</p>
            <p className="text-slate-500 dark:text-slate-400 text-sm">{new Date().getDate()} {new Date().toLocaleDateString('en-US', { month: 'short' })}</p>
          </div>
        </div>
        <p className="text-slate-500 dark:text-slate-400 mb-8 text-[15px]">Take a deep breath. Let's begin.</p>

        {/* Start Journaling Card */}
        <button 
          onClick={onStartReflection}
          className="w-full bg-[#2D2D2D] dark:bg-[#1A1A1A] rounded-[2rem] p-6 text-left relative overflow-hidden group shadow-xl shadow-stone-200/50 dark:shadow-none mb-8 transition-transform active:scale-[0.98]"
        >
          <div className="relative z-10 flex items-start gap-4">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center shrink-0">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
            </div>
            <div className="flex-1">
              <h2 className="text-white text-xl font-medium mb-1 tracking-tight">{t('start_journaling', lang)}</h2>
              <p className="text-stone-400 text-sm leading-relaxed font-serif italic">Clear your mind, capture a thought, reflect on your day.</p>
            </div>
          </div>
          <div className="mt-6">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
              <ArrowRight className="w-5 h-5 text-stone-900" />
            </div>
          </div>
          {/* Decorative shapes */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-bl-full pointer-events-none"></div>
        </button>

        {/* Quick Prompts */}
        <div className="space-y-4 mb-10">
          <button onClick={() => onSelectMode?.('Morning Intention')} className="w-full flex items-center gap-4 p-4 rounded-[1.5rem] premium-card hover:shadow-md transition-all active:scale-[0.98] group">
            <div className="w-12 h-12 bg-orange-50 dark:bg-orange-500/10 rounded-2xl flex items-center justify-center shrink-0">
              <Sun className="w-6 h-6 text-orange-500" />
            </div>
            <div className="text-left flex-1">
              <h3 className="text-slate-900 dark:text-slate-100 font-medium">Morning Intention</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Start your day with purpose</p>
            </div>
            <ArrowRight className="w-5 h-5 text-stone-300 dark:text-stone-600 group-hover:text-stone-400 transition-colors" />
          </button>
          
          <button onClick={() => onSelectMode?.('Goal Setting')} className="w-full flex items-center gap-4 p-4 rounded-[1.5rem] premium-card hover:shadow-md transition-all active:scale-[0.98] group">
            <div className="w-12 h-12 bg-green-50 dark:bg-green-500/10 rounded-2xl flex items-center justify-center shrink-0">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>
            </div>
            <div className="text-left flex-1">
              <h3 className="text-slate-900 dark:text-slate-100 font-medium">Today's Goal</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm">What do you want to achieve?</p>
            </div>
            <ArrowRight className="w-5 h-5 text-stone-300 dark:text-stone-600 group-hover:text-stone-400 transition-colors" />
          </button>

          <button onClick={() => onSelectMode?.('Evening Reflection')} className="w-full flex items-center gap-4 p-4 rounded-[1.5rem] premium-card hover:shadow-md transition-all active:scale-[0.98] group">
            <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl flex items-center justify-center shrink-0">
              <Moon className="w-6 h-6 text-indigo-500" />
            </div>
            <div className="text-left flex-1">
              <h3 className="text-slate-900 dark:text-slate-100 font-medium">Evening Reflection</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Reflect and unwind</p>
            </div>
            <ArrowRight className="w-5 h-5 text-stone-300 dark:text-stone-600 group-hover:text-stone-400 transition-colors" />
          </button>
        </div>

        {/* Your Journal Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif font-medium text-xl text-slate-900 dark:text-slate-100">Your Journal</h2>
            <button onClick={onViewAllJournals} className="text-slate-500 dark:text-slate-400 text-sm hover:text-stone-800 dark:hover:text-stone-200">View all</button>
          </div>
          
          <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar -mx-6 px-6">
            {entries.length === 0 ? (
              <div className="w-[280px] shrink-0 p-6 rounded-[2rem] bg-white dark:bg-[#1A1A1A] border border-stone-100 dark:border-stone-800 text-center shadow-sm">
                <p className="text-slate-500 dark:text-slate-400 text-[15px]">No entries yet. Start journaling above.</p>
              </div>
            ) : (
              entries.slice(0, 5).map((entry) => {
                const date = new Date(entry.createdAt);
                return (
                  <button
                    key={entry.id}
                    onClick={() => onOpenEntry?.(entry.id)}
                    className="w-[280px] shrink-0 p-5 rounded-[2rem] bg-white dark:bg-[#1A1A1A] border border-stone-100 dark:border-stone-800 text-left shadow-sm hover:shadow-md transition-all active:scale-[0.98] flex flex-col"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-xs font-medium text-stone-500">{date.getDate()} {date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                      {entry.mood && (
                        <span className="text-lg leading-none bg-stone-50 dark:bg-stone-800/50 px-2.5 py-1 rounded-full">{entry.mood.split(' ')[0]}</span>
                      )}
                    </div>
                    <p className="text-slate-800 dark:text-slate-200 text-sm line-clamp-3 font-serif italic mb-4 leading-relaxed">
                      {entry.title || "Untitled Entry"}...
                    </p>
                    <div className="mt-auto flex items-center gap-1.5 bg-[#F6F4F0] dark:bg-stone-800/50 w-fit px-2.5 py-1 rounded-full">
                      <Sparkles className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
                      <span className="text-xs font-medium text-slate-600 dark:text-slate-300 text-nowrap truncate max-w-[150px]">{entry.persona}</span>
                    </div>
                  </button>
                )
              })
            )}
          </div>
        </div>

        
        {/* Emotional Landscape Preview */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif font-medium text-xl text-slate-900 dark:text-slate-100">{t('emotional_landscape', lang)}</h2>
            <button className="text-slate-500 dark:text-slate-400 text-sm hover:text-stone-800 dark:hover:text-stone-200">View all</button>
          </div>
          <div className="premium-card p-6 flex items-center justify-between">
            {[...Array(7)].map((_, i) => {
              const d = new Date();
              d.setDate(d.getDate() - (6 - i));
              const entry = entries.find(e => new Date(e.createdAt).toDateString() === d.toDateString());
              const mood = entry?.mood?.split(' ')[0] || '⚪';
              const isToday = i === 6;
              return (
                <div key={i} className="flex flex-col items-center gap-2">
                  <span className="text-xs text-stone-400 font-medium">{d.toLocaleDateString('en-US', { weekday: 'short' })[0]}</span>
                  <div className={"w-10 h-10 rounded-full flex items-center justify-center text-xl " + (isToday ? "bg-violet-600 dark:bg-violet-500/10 border border-violet-600 dark:border-violet-400/30" : "bg-stone-50 dark:bg-stone-800/50")}>
                    {mood}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
