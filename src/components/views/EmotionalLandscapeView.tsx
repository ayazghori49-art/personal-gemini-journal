import { t } from '../../lib/i18n';
import { JournalEntry } from '../../types';
import { Compass, Calendar, Menu, ArrowRight } from 'lucide-react';
import { useState, useMemo } from 'react';
import { cn } from '../../lib/utils';
import { motion } from 'motion/react';

interface EmotionalLandscapeViewProps {
  onNavigateBack?: () => void;
  onOpenDrawer: () => void;
  entries: JournalEntry[];
  onAction: (action: string) => void;
  lang?: string;
}

export function EmotionalLandscapeView({ entries, onAction, onOpenDrawer, onNavigateBack, lang = 'en' }: EmotionalLandscapeViewProps) {
  const [activeTab, setActiveTab] = useState<'Today' | 'Weekly' | 'Monthly'>('Weekly');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  
  const sortedEntries = useMemo(() => {
    return [...entries].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  }, [entries]);

  const changeMonth = (offset: number) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + offset);
      return newDate;
    });
  };

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  // Adjust so Monday is 0
  const startOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
  

  const calendarDays = Array.from({ length: 42 }).map((_, i) => {
    const day = i - startOffset + 1;
    if (day > 0 && day <= daysInMonth) {
      return new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    }
    return null;
  });

  const displayDays = useMemo(() => {
    if (activeTab === 'Monthly') return calendarDays;
    
    // For Weekly or Today, find the week containing selectedDate or currentDate
    const targetDate = selectedDate || currentDate;
    const targetIdx = calendarDays.findIndex(d => d && d.toDateString() === targetDate.toDateString());
    
    if (targetIdx !== -1) {
      const weekStart = Math.floor(targetIdx / 7) * 7;
      return calendarDays.slice(weekStart, weekStart + 7);
    }
    
    // Fallback if not found in current month page
    return calendarDays.slice(0, 7);
  }, [calendarDays, activeTab, selectedDate, currentDate]);


  const selectedEntries = useMemo(() => {
    if (!selectedDate) return [];
    return sortedEntries.filter(e => {
      const d = new Date(e.createdAt || 0);
      return d.toDateString() === selectedDate.toDateString();
    });
  }, [sortedEntries, selectedDate]);

  return (
    <div className="flex-1 flex flex-col h-full bg-transparent custom-scrollbar overflow-y-auto">
      {/* Header */}
      <div className="px-6 pt-12 pb-6 flex items-center justify-between sticky top-0 bg-white/40 dark:bg-[#0D0D12]/60 backdrop-blur-2xl backdrop-blur-md z-10">
        <button onClick={onNavigateBack} className="p-2 -ml-2 rounded-full hover:bg-stone-200/50 dark:hover:bg-stone-800/50 transition-colors">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-800 dark:text-slate-200"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <h2 className="font-serif font-medium text-[17px] text-slate-900 dark:text-slate-100">Journal</h2>
        <button onClick={onOpenDrawer} className="p-2 -mr-2 rounded-full hover:bg-stone-200/50 dark:hover:bg-stone-800/50 transition-colors">
          <Menu className="w-5 h-5 text-slate-800 dark:text-slate-200" />
        </button>
      </div>

      <div className="px-6 pb-24">
        {/* Tabs */}
        <div className="flex items-center gap-2 mb-8 bg-stone-100/50 dark:bg-[#1A1A1A] p-1.5 rounded-full w-fit mx-auto">
          {(['Today', 'Weekly', 'Monthly'] as const).map(tab => (
            <button 
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                if (tab === 'Today') {
                  const now = new Date();
                  setCurrentDate(now);
                  setSelectedDate(now);
                }
              }}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${activeTab === tab ? 'bg-[#3A3945] text-white shadow-sm' : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Calendar Card */}
        <div className="bg-white dark:bg-[#1A1A1A] rounded-[2rem] p-6 shadow-xl shadow-stone-200/50 dark:shadow-none mb-6 border border-stone-100 dark:border-stone-800/50">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-medium text-slate-900 dark:text-slate-100">{t('emotional_landscape', lang)}</h3>
            <div className="w-6 h-6 rounded-full border border-stone-200 flex items-center justify-center text-stone-400 text-xs">i</div>
          </div>
          
          <div className="flex items-center justify-between mb-4 text-sm font-medium">
            <button onClick={() => changeMonth(-1)} className="p-1 px-3 text-stone-500 hover:text-stone-800 transition-colors">&lt;</button>
            <span className="text-slate-900 dark:text-slate-100">{currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
            <button onClick={() => changeMonth(1)} className="p-1 px-3 text-stone-500 hover:text-stone-800 transition-colors">&gt;</button>
          </div>
          
          <div className="grid grid-cols-7 gap-y-4 mb-2">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
              <div key={day} className="text-center text-xs font-medium text-stone-400">{day}</div>
            ))}
            
            {/* Calendar Days */}
            {displayDays.map((date, i) => {
              if (!date) {
                return <div key={i} className="h-10"></div>;
              }
              const isToday = date.toDateString() === new Date().toDateString();
              const isSelected = selectedDate?.toDateString() === date.toDateString();
              const dayEntries = sortedEntries.filter(e => new Date(e.createdAt || 0).toDateString() === date.toDateString());
              const hasEntry = dayEntries.length > 0;
              const latestEntry = hasEntry ? dayEntries[0] : null;

              return (
                <button 
                  key={i} 
                  onClick={() => setSelectedDate(date)}
                  className="flex justify-center items-center h-10"
                >
                  {hasEntry && latestEntry?.mood ? (
                    <div className={`w-8 h-8 flex items-center justify-center rounded-full transition-all ${isSelected ? 'ring-2 ring-violet-500 bg-violet-50 dark:bg-violet-900/20' : ''} ${isToday ? 'bg-stone-100 dark:bg-stone-800' : ''}`}>
                      <span className="text-lg leading-none">{latestEntry.mood.split(' ')[0]}</span>
                    </div>
                  ) : (
                    <div className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium transition-all ${isSelected ? 'bg-violet-600 text-white shadow-md' : isToday ? 'bg-stone-100 dark:bg-stone-800 text-slate-900 dark:text-slate-100' : 'text-stone-500 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-900'}`}>
                      {date.getDate()}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Day Details */}
        {selectedDate && (
          selectedEntries.length > 0 ? (
            selectedEntries.map(entry => (
              <div key={entry.id} className="bg-white dark:bg-[#1A1A1A] rounded-[2rem] p-6 shadow-xl shadow-stone-200/50 dark:shadow-none border border-stone-100 dark:border-stone-800/50 mb-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-slate-900 dark:text-slate-100">{new Date(entry.createdAt).getDate()} {new Date(entry.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h3>
                  {entry.mood && (
                    <span className="bg-stone-50 dark:bg-stone-800/50 px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5 shadow-sm border border-stone-100 dark:border-stone-700/50 text-slate-800 dark:text-slate-200">
                      {entry.mood}
                    </span>
                  )}
                </div>
                <h4 className="font-medium text-slate-800 dark:text-slate-200 mb-2">{entry.title}</h4>
                <p className="text-stone-600 dark:text-stone-400 text-[15px] leading-relaxed mb-6">
                  {entry.content || (entry.messages && entry.messages.length > 0 ? entry.messages.filter(m => m.role === 'user').pop()?.text : 'No content')}
                </p>
                {entry.persona && (
                  <div className="flex gap-2 flex-wrap">
                    <span className="bg-stone-50 dark:bg-stone-800/80 border border-stone-100 dark:border-stone-700/50 text-slate-600 dark:text-slate-300 px-4 py-1.5 rounded-full text-xs font-medium tracking-wide">
                      {entry.persona}
                    </span>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="bg-white dark:bg-[#1A1A1A] rounded-[2rem] p-8 text-center border border-stone-100 dark:border-stone-800/50">
              <div className="w-16 h-16 mx-auto bg-stone-50 dark:bg-stone-800/50 rounded-full flex items-center justify-center mb-4">
                <Calendar className="w-8 h-8 text-stone-400" />
              </div>
              <h3 className="font-medium text-slate-900 dark:text-slate-100 mb-2">No Entries</h3>
              <p className="text-stone-500 text-sm">There are no journal entries for {selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}.</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}
