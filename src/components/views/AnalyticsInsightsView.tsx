import { auth } from '../../lib/firebase';
import { t } from '../../lib/i18n';
import { JournalEntry } from '../../types';
import { Loader2, ChevronDown } from 'lucide-react';
import React, { useState, useMemo, useEffect } from 'react';

interface AnalyticsInsightsViewProps {
  onNavigateBack?: () => void;
  onOpenDrawer: () => void;
  entries: JournalEntry[];
  lang?: string;
  onAction?: (action: string) => void;
}

export function AnalyticsInsightsView({ entries, onOpenDrawer, onNavigateBack, lang = 'en' }: AnalyticsInsightsViewProps) {
  const [activeTab, setActiveTab] = useState<'Journal' | 'Mood History'>('Journal');
  
  // Mood Trend State
  const [trendPeriod, setTrendPeriod] = useState<'This Week' | 'Last Week' | 'This Month'>('This Week');
  const [showTrendDropdown, setShowTrendDropdown] = useState(false);

  // Top Themes State
  const [themes, setThemes] = useState<string[]>([]);
  const [loadingThemes, setLoadingThemes] = useState(false);
  const [showAllThemes, setShowAllThemes] = useState(false);
  const [themesError, setThemesError] = useState('');

  // 1. Calculate Mood History Data
  const moodHistory = useMemo(() => {
    return entries
      .filter(e => e.mood)
      .sort((a, b) => b.createdAt - a.createdAt);
  }, [entries]);


  // Calculate Activity Data (Last 6 Months)
  const activityData = useMemo(() => {
    const data = [];
    const now = new Date();
    let maxCount = 0;
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const m = d.getMonth();
      const y = d.getFullYear();
      const count = entries.filter(e => {
        const ed = new Date(e.createdAt);
        return ed.getMonth() === m && ed.getFullYear() === y;
      }).length;
      if (count > maxCount) maxCount = count;
      data.push(count);
    }
    return {
      counts: data,
      max: maxCount === 0 ? 1 : maxCount
    };
  }, [entries]);

  // 2. Calculate Mood Trend based on selected period
  const trendData = useMemo(() => {
    const now = new Date();
    let startDate = new Date();
    
    if (trendPeriod === 'This Week') {
      const day = now.getDay() || 7;
      startDate.setDate(now.getDate() - day + 1);
      startDate.setHours(0, 0, 0, 0);
    } else if (trendPeriod === 'Last Week') {
      const day = now.getDay() || 7;
      startDate.setDate(now.getDate() - day - 6);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);
      endDate.setHours(23, 59, 59, 999);
      now.setTime(endDate.getTime());
    } else if (trendPeriod === 'This Month') {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    const filteredEntries = entries.filter(e => {
      const d = new Date(e.createdAt);
      return d >= startDate && d <= now && e.mood;
    });

    
    filteredEntries.sort((a, b) => a.createdAt - b.createdAt);
    
    const moodScores: Record<string, number> = {
      '😊': 80, '😌': 70, '😐': 50, '😔': 30, '😭': 10, '😡': 20, '🥳': 100, '🥰': 90, '😴': 40, '🤔': 50, '😅': 60, '😁': 85, '😎': 80, '🥺': 25, '😫': 20
    };
    const getScore = (mood?: string) => {
      if (!mood) return 50;
      const m = mood.split(' ')[0];
      return moodScores[m] || 50;
    };

    const points: [number, number][] = [];
    if (filteredEntries.length > 0) {
       const numPoints = filteredEntries.length;
       filteredEntries.forEach((e, i) => {
         const x = numPoints === 1 ? 50 : Math.round((i / (numPoints - 1)) * 100);
         const score = getScore(e.mood);
         const y = 100 - score;
         points.push([x, y]);
       });
    }
    const pathD = points.length > 0 ? `M${points.map(p => `${p[0]},${p[1]}`).join(' L')}` : '';

    const moodCounts: Record<string, number> = {};
    let totalMoods = 0;
    
    filteredEntries.forEach(e => {
      const emoji = e.mood?.split(' ')[0];
      if (emoji) {
        moodCounts[emoji] = (moodCounts[emoji] || 0) + 1;
        totalMoods++;
      }
    });

    const percentages = Object.entries(moodCounts)
      .map(([emoji, count]) => ({
        emoji,
        percentage: Math.round((count / totalMoods) * 100)
      }))
      .sort((a, b) => b.percentage - a.percentage);

    return { totalMoods, percentages, points, pathD };
  }, [entries, trendPeriod]);

  // Generate Top Themes
  useEffect(() => {
    const generateThemes = async () => {
      if (entries.length < 3) {
        setThemesError('Not enough entries yet.');
        return;
      }
      setLoadingThemes(true);
      try {
        const user = auth.currentUser;
        if (!user) return;
        const token = await user.getIdToken();
        const contentStr = entries.slice(0, 20).map(e => {
          let text = e.title + " ";
          if (e.messages && Array.isArray(e.messages)) {
            text += e.messages.filter(m => m.role === 'user').map(m => m.text).join(' ');
          }
          if (e.content) {
            text += " " + e.content;
          }
          return text;
        }).join('\n');
        
        const systemInstruction = "You analyze journal entries and extract exactly 5 to 10 short recurring themes (e.g., Growth, Gratitude, Stress, Family, Work). Return ONLY a JSON array of strings.";
        
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: contentStr.substring(0, 20000) }] }],
            systemInstruction,
            responseMimeType: 'application/json'
          })
        });
        
        if (res.ok) {
          const reader = res.body?.getReader();
          const decoder = new TextDecoder();
          let fullText = "";
          if (reader) {
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              const chunk = decoder.decode(value, { stream: true });
              const lines = chunk.split('\n\n');
              for (const line of lines) {
                if (line.startsWith('data: ')) {
                  try {
                    const data = JSON.parse(line.replace('data: ', '').trim());
                    if (data.text) fullText += data.text;
                  } catch (e) {}
                }
              }
            }
          }
          const cleanJson = fullText.replace(/```json/g, '').replace(/```/g, '').trim();
          const parsed = JSON.parse(cleanJson);
          if (Array.isArray(parsed)) {
            setThemes(parsed);
          }
        }
      } catch (e) {
        console.error(e);
        setThemesError('Failed to analyze themes.');
      } finally {
        setLoadingThemes(false);
      }
    };
    
    if (themes.length === 0 && !themesError) {
      generateThemes();
    }
  }, [entries]);

  const displayedThemes = showAllThemes ? themes : themes.slice(0, 5);

  return (
    <div className="flex-1 flex flex-col h-full bg-transparent custom-scrollbar overflow-y-auto">
      {/* Header */}
      <div className="px-6 pt-12 pb-6 flex items-center justify-between sticky top-0 bg-white/40 dark:bg-[#0D0D12]/60 backdrop-blur-2xl backdrop-blur-md z-10">
        <button onClick={onNavigateBack} className="p-2 -ml-2 rounded-full hover:bg-stone-200/50 dark:hover:bg-stone-800/50 transition-colors">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-800 dark:text-slate-200"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <h2 className="font-serif font-medium text-[17px] text-slate-900 dark:text-slate-100">{t('analytics_insights', lang)}</h2>
        <div className="w-10"></div>
      </div>

      <div className="px-6 pb-24">
        {/* Tabs */}
        <div className="flex items-center gap-2 mb-8 bg-stone-100/50 dark:bg-[#1A1A1A] p-1.5 rounded-full w-full max-w-sm mx-auto">
          {['Journal', 'Mood History'].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`flex-1 py-3 rounded-full text-sm font-medium transition-all ${activeTab === tab ? 'bg-violet-600 dark:bg-violet-500 text-white shadow-sm' : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'Mood History' ? (
          <div className="bg-white dark:bg-[#1A1A1A] rounded-[2rem] p-6 shadow-xl shadow-stone-200/50 dark:shadow-none border border-stone-100 dark:border-stone-800/50">
            <h3 className="font-medium text-slate-900 dark:text-slate-100 mb-6">Mood History</h3>
            {moodHistory.length === 0 ? (
              <p className="text-stone-500 text-sm text-center py-8">No mood data recorded yet.</p>
            ) : (
              <div className="space-y-4">
                {moodHistory.map(entry => (
                  <div key={entry.id} className="flex items-center justify-between p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/50">
                    <div>
                      <p className="text-slate-900 dark:text-slate-100 font-medium text-sm">{new Date(entry.createdAt).toLocaleDateString()}</p>
                      <p className="text-stone-500 text-xs">{new Date(entry.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                    </div>
                    <div className="text-2xl bg-white dark:bg-stone-800 p-2 rounded-full shadow-sm border border-stone-100 dark:border-stone-700">
                      {entry.mood?.split(' ')[0]}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Total Journals Card */}
            <div className="bg-white dark:bg-[#1A1A1A] rounded-[2rem] p-6 shadow-xl shadow-stone-200/50 dark:shadow-none mb-6 border border-stone-100 dark:border-stone-800/50 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
              <div>
                <h3 className="text-slate-900 dark:text-slate-100 font-medium mb-2">Total Journals</h3>
                <div className="text-[3rem] font-serif leading-none tracking-tight text-stone-900 dark:text-stone-50 mb-1">
                  {entries.length}
                </div>
                <p className="text-stone-400 text-sm font-medium">
                  +{entries.filter(e => new Date(e.createdAt).getMonth() === new Date().getMonth()).length} this month
                </p>
              </div>
              {/* Simple Bar Chart */}
              <div className="flex items-end gap-2 h-24">
                {activityData.counts.map((count, i) => {
                  const h = Math.max((count / activityData.max) * 100, 5);
                  return (
                    <div key={i} className={`w-5 rounded-full ${i === 5 ? 'bg-violet-600 dark:bg-violet-500' : 'bg-violet-600 dark:bg-violet-500/20 dark:bg-violet-600 dark:bg-violet-500/10'}`} style={{ height: `${h}%` }} title={`${count} entries`}></div>
                  );
                })}
              </div>
            </div>
            {/* Mood Trend Card */}
            <div className="bg-white dark:bg-[#1A1A1A] rounded-[2rem] p-6 shadow-xl shadow-stone-200/50 dark:shadow-none mb-6 border border-stone-100 dark:border-stone-800/50">
              <div className="flex items-center justify-between mb-8 relative">
                <h3 className="font-medium text-slate-900 dark:text-slate-100">Mood Trend</h3>
                <button 
                  onClick={() => setShowTrendDropdown(!showTrendDropdown)}
                  className="text-stone-500 text-sm font-medium flex items-center gap-1 hover:text-stone-800 dark:hover:text-stone-200"
                >
                  {trendPeriod}
                  <ChevronDown className="w-4 h-4" />
                </button>
                {showTrendDropdown && (
                  <div className="absolute top-8 right-0 bg-white dark:bg-stone-800 border border-stone-100 dark:border-stone-700 rounded-xl shadow-lg p-2 z-20">
                    {['This Week', 'Last Week', 'This Month'].map(period => (
                      <button 
                        key={period} 
                        onClick={() => { setTrendPeriod(period as any); setShowTrendDropdown(false); }}
                        className="block w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-stone-100 dark:hover:bg-stone-700 rounded-lg whitespace-nowrap"
                      >
                        {period}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              {trendData.totalMoods === 0 ? (
                <p className="text-stone-500 text-sm text-center py-6">No mood data for {trendPeriod.toLowerCase()}.</p>
              ) : (
                <>
                  <div className="relative h-24 mb-4">
                    <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
                      {trendData.pathD && <path d={trendData.pathD} fill="none" stroke="#9b87f5" strokeWidth="3" vectorEffect="non-scaling-stroke" opacity="0.5" />}
                      {trendData.points.map(([x,y], i) => (
                        <circle key={i} cx={x} cy={y} r="3" fill="#9b87f5" vectorEffect="non-scaling-stroke" />
                      ))}
                    </svg>
                  </div>
                  <div className="flex justify-between items-center text-sm overflow-x-auto hide-scrollbar gap-4 pb-2">
                    {trendData.percentages.map((p, i) => (
                      <div key={i} className="flex flex-col items-center gap-1 shrink-0">
                        <span className="text-xl">{p.emoji}</span>
                        <span className="text-stone-400 font-medium">{p.percentage}%</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Top Themes */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-slate-900 dark:text-slate-100">Top Themes</h3>
                {themes.length > 5 && (
                  <button 
                    onClick={() => setShowAllThemes(!showAllThemes)}
                    className="text-stone-400 text-sm hover:text-stone-800 dark:hover:text-stone-200"
                  >
                    {showAllThemes ? 'View less' : 'View all'}
                  </button>
                )}
              </div>
              {loadingThemes ? (
                <div className="flex items-center gap-2 text-stone-500 text-sm">
                  <Loader2 className="w-4 h-4 animate-spin" /> Analyzing themes...
                </div>
              ) : themesError ? (
                <p className="text-stone-500 text-sm">{themesError}</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {displayedThemes.map((theme, i) => (
                    <span key={theme} className={`px-4 py-2 rounded-full text-sm font-medium ${i === 0 ? 'bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400' : 'bg-stone-50 text-stone-600 dark:bg-[#1A1A1A] dark:border dark:border-stone-800/50 dark:text-stone-300'}`}>
                      {theme}
                    </span>
                  ))}
                </div>
              )}
            </div>

            
          </>
        )}
      </div>
    </div>
  );
}
