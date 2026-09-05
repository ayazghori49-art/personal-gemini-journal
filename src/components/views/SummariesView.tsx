import React, { useState } from 'react';
import { Menu, ArrowLeft, FileText, Loader2, Sparkles, Bookmark, BookmarkCheck, Trash2 } from 'lucide-react';
import { useSavedSummaries } from '../../hooks/useSavedSummaries';
import { auth, db } from '../../lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { JournalEntry } from '../../types';
import Markdown from 'react-markdown';

type TimeRange = '1 Day' | '1 Week' | '1 Month';

export function SummariesView({ onOpenDrawer, onNavigateBack }: { onOpenDrawer?: () => void, onNavigateBack?: () => void }) {
  const [range, setRange] = useState<TimeRange>('1 Week');
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState('');
  const [error, setError] = useState('');
  const { savedSummaries, saveSummary, removeSummary } = useSavedSummaries();
  const [isSaved, setIsSaved] = useState(false);

  const generateSummary = async () => {
    setLoading(true);
    setSummary('');
    setError('');
    setIsSaved(false);
    
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Not authenticated");
      
      const now = new Date();
      let startTime = 0;
      if (range === '1 Day') {
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        startTime = startOfToday.getTime();
      }
      if (range === '1 Week') {
        const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
        startTime = startOfWeek.getTime();
      }
      if (range === '1 Month') {
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 30);
        startTime = startOfMonth.getTime();
      }

      const qEntries = query(
        collection(db, 'entries'),
        where('userId', '==', user.uid)
      );
      const qChats = query(
        collection(db, 'chats'),
        where('userId', '==', user.uid)
      );
      
      const [snapEntries, snapChats] = await Promise.all([
        getDocs(qEntries),
        getDocs(qChats)
      ]);
      
      const allData = [
        ...snapEntries.docs.map(d => d.data() as JournalEntry),
        ...snapChats.docs.map(d => d.data() as JournalEntry)
      ];

      const uniqueData = Array.from(new Map(allData.map(item => [item.id, item])).values());

      const entries = uniqueData
        .filter(e => {
          const timestamp = e.updatedAt || e.createdAt;
          return timestamp && timestamp >= startTime;
        })
        .sort((a, b) => (a.updatedAt || a.createdAt) - (b.updatedAt || b.createdAt));

      if (entries.length === 0) {
        setLoading(false);
        setSummary(`No journal entries found for the past ${range.toLowerCase()}.`);
        return;
      }

      let entriesText = entries.map(e => {
        const ts = e.updatedAt || e.createdAt;
        let txt = `Date: ${new Date(ts).toLocaleString()}\n`;
        if (e.title) txt += `Title: ${e.title}\n`;
        if (e.messages) {
          const userMsgs = e.messages.filter(m => m.role === 'user').map(m => m.text).join("\n");
          txt += `Content:\n${userMsgs}\n`;
        } else if (e.content) {
          txt += `Content:\n${e.content}\n`;
        }
        return txt;
      }).join("\n---\n");

      // To avoid huge payloads, truncate if necessary
      if (entriesText.length > 20000) {
        entriesText = entriesText.slice(0, 20000) + "... [truncated]";
      }

      const token = await user.getIdToken();
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: `Here are my journal entries for the past ${range.toLowerCase()}:\n\n${entriesText}\n\nPlease provide a thoughtful, empathetic summary of my entries. Highlight key themes, emotional trends, and any notable events. Keep it concise but meaningful. ONLY use the provided journal entries, do not include or invent any external information.` }] }],
          systemInstruction: "You are an insightful and empathetic journaling assistant. Provide a structured summary of the user's journal entries. Strictly base your summary on the provided entries and nothing else.",
          responseMimeType: "text/plain"
        })
      });

      if (!res.ok) throw new Error("API failed");
      
      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) throw new Error("No reader");

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n\n');
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.replace('data: ', '').trim();
            if (!dataStr) continue;
            try {
              const data = JSON.parse(dataStr);
              if (data.error) setError(data.error);
              else if (data.text) {
                setSummary(prev => prev + data.text);
              }
            } catch (e) {}
          }
        }
      }

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to generate summary.");
    } finally {
      setLoading(false);
    }
  };

  
  const handleSave = async () => {
    if (!summary || isSaved) return;
    try {
      setError('');
      // check for exact duplicate before saving
      const isDuplicate = savedSummaries.some(s => s.summaryText === summary && s.timeRange === range);
      if (isDuplicate) {
        throw new Error("This summary has already been saved.");
      }
      await saveSummary(range, summary);
      setIsSaved(true);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to save summary.");
    }
  };
return (
    <div className="flex-1 h-full overflow-y-auto bg-stone-50 dark:bg-[#0D0D12] text-slate-800 dark:text-slate-200">
      <div className="max-w-4xl mx-auto py-8 px-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-serif font-bold text-slate-900 dark:text-slate-100">Summaries</h1>
              <p className="text-stone-500">Reflect on your journey over time.</p>
            </div>
          </div>
          {onOpenDrawer && (
            <button
              onClick={onOpenDrawer}
              className="md:hidden p-2 rounded-xl hover:bg-stone-200/50 dark:hover:bg-white/5 transition-colors"
            >
              <Menu className="w-6 h-6 text-slate-700 dark:text-slate-300" />
            </button>
          )}
        </div>

        {onNavigateBack && (
          <button
            onClick={onNavigateBack}
            className="mb-8 flex items-center gap-2 text-stone-500 hover:text-slate-900 dark:hover:text-slate-100 transition-colors font-medium text-[15px]"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
        )}

        <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl p-6 shadow-sm border border-stone-100 dark:border-stone-800/50 mb-8">
          <div className="flex flex-wrap gap-2 mb-6">
            {(['1 Day', '1 Week', '1 Month'] as TimeRange[]).map(r => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  range === r 
                    ? 'bg-indigo-600 text-white shadow-md' 
                    : 'bg-stone-100 dark:bg-stone-800 text-slate-700 dark:text-slate-300 hover:bg-stone-200 dark:hover:bg-stone-700'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          <button
            onClick={generateSummary}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl font-medium transition-colors shadow-sm"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
            {loading ? 'Analyzing entries...' : 'Generate Summary'}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 p-4 rounded-xl mb-8 border border-red-100 dark:border-red-500/20">
            {error}
          </div>
        )}

        {summary && (
          <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl p-8 shadow-sm border border-stone-100 dark:border-stone-800/50">
            <div className="flex justify-end mb-4">
              <button
                onClick={handleSave}
                disabled={isSaved}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  isSaved 
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
                }`}
              >
                {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                {isSaved ? 'Saved' : 'Save Summary'}
              </button>
            </div>
            <div className="prose prose-stone dark:prose-invert max-w-none">
              <Markdown>{summary}</Markdown>
            </div>
          </div>
        )}
      
        {savedSummaries.length > 0 && (
          <div className="mt-12">
            <h3 className="text-xl font-serif font-bold text-slate-900 dark:text-slate-100 mb-6">Saved Summaries</h3>
            <div className="space-y-6">
              {savedSummaries.map(s => (
                <div key={s.id} className="bg-white dark:bg-[#1A1A1A] rounded-2xl p-8 shadow-sm border border-stone-100 dark:border-stone-800/50 relative group">
                  <button
                    onClick={() => removeSummary(s.id)}
                    className="absolute top-4 right-4 p-2 text-stone-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors opacity-0 group-hover:opacity-100"
                    title="Delete saved summary"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                  <div className="flex items-center gap-3 mb-6">
                    <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full text-xs font-semibold uppercase tracking-wider">
                      {s.timeRange}
                    </span>
                    <span className="text-sm text-stone-500">
                      {new Date(s.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="prose prose-stone dark:prose-invert max-w-none">
                    <Markdown>{s.summaryText}</Markdown>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>

  );
}
