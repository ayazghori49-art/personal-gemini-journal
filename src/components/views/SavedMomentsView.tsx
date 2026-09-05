import React, { useState, useEffect } from 'react';
import { Bookmark, Loader2, Sparkles, Trash2, Quote, Menu, ArrowLeft } from 'lucide-react';
import { useSavedMoments } from '../../hooks/useSavedMoments';
import { auth } from '../../lib/firebase';
import ReactMarkdown from 'react-markdown';

export function SavedMomentsView({ onOpenDrawer, onNavigateBack }: { onOpenDrawer?: () => void, onNavigateBack?: () => void }) {
  const { savedMoments, loading, removeMoment } = useSavedMoments();
  const [overallSummary, setOverallSummary] = useState('');
  const [summarizing, setSummarizing] = useState(false);

  useEffect(() => {
    const generateOverallSummary = async () => {
      if (savedMoments.length === 0) return;
      
      const lastMoments = savedMoments.slice(0, 10); // Limit to last 10 to avoid huge context
      const summaries = lastMoments.map(m => m.summary).join("\n- ");
      
      const prompt = `Based ONLY on these recent saved reflection summaries, write a brief, encouraging 2-sentence overall summary of my journaling journey:\n- ${summaries}`;
      
      setSummarizing(true);
      try {
        const user = auth.currentUser;
        if (!user) return;
        const token = await user.getIdToken();
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            systemInstruction: "You are an empathetic journaling assistant.",
            responseMimeType: "text/plain"
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
                   const dataStr = line.replace('data: ', '').trim();
                   if (!dataStr) continue;
                   try {
                     const data = JSON.parse(dataStr);
                     if (data.text) fullText += data.text;
                   } catch (e) {}
                 }
               }
             }
             setOverallSummary(fullText);
           }
        }
      } catch (err) {
        console.error("Failed to generate overall summary", err);
      }
      setSummarizing(false);
    };

    generateOverallSummary();
  }, [savedMoments.length]); // regenerate if length changes? Actually, just on mount or significant change. We'll leave it simple.

  if (loading) {
    return (
      <div className="flex-1 h-full flex items-center justify-center bg-white dark:bg-slate-950">
        <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
      </div>
    );
  }

  return (
    <div className="flex-1 h-full overflow-y-auto bg-stone-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200">
      <div className="max-w-4xl mx-auto py-8 px-6">
        {onNavigateBack && (
          <button
            onClick={onNavigateBack}
            className="mb-8 flex items-center gap-2 text-stone-500 hover:text-slate-900 dark:hover:text-slate-100 transition-colors font-medium text-[15px]"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
        )}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 rounded-2xl flex items-center justify-center">
              <Bookmark className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-serif font-bold text-slate-900 dark:text-slate-100">Saved Moments</h1>
              <p className="text-stone-500">Your most important reflections and breakthroughs.</p>
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
        
        {savedMoments.length > 0 && (
          <div className="bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 rounded-3xl p-6 mb-12 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-violet-500" />
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Your Saved Reflections</h2>
            </div>
            {summarizing ? (
              <div className="flex items-center gap-2 text-stone-500">
                <Loader2 className="w-4 h-4 animate-spin" /> Synthesizing your moments...
              </div>
            ) : (
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-[15px]">
                {overallSummary || "Keep saving moments to see your personal growth summary here."}
              </p>
            )}
          </div>
        )}

        {savedMoments.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-stone-200 dark:border-slate-800 border-dashed">
            <Bookmark className="w-10 h-10 text-stone-300 dark:text-stone-700 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">No saved moments yet</h3>
            <p className="text-stone-500 max-w-sm mx-auto">When you have a meaningful exchange with the AI, click the Save button to keep it here.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {savedMoments.map((moment) => (
              <div key={moment.id} className="bg-white dark:bg-slate-900 rounded-3xl border border-stone-200 dark:border-slate-800 overflow-hidden shadow-sm group">
                <div className="px-6 py-4 border-b border-stone-100 dark:border-slate-800/50 bg-stone-50/50 dark:bg-slate-900/50 flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-slate-900 dark:text-slate-100 mb-1">{moment.summary || 'Saved Reflection'}</h3>
                    <p className="text-xs text-stone-500">{new Date(moment.createdAt).toLocaleString()}</p>
                  </div>
                  <button onClick={() => removeMoment(moment.id)} className="text-stone-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-2 bg-white dark:bg-slate-800 rounded-full shadow-sm border border-stone-200 dark:border-slate-700">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="p-6 space-y-6 text-[15px]">
                  <div className="relative pl-6">
                    <Quote className="absolute top-0 left-0 w-4 h-4 text-stone-300 dark:text-stone-600" />
                    <div className="font-medium text-slate-800 dark:text-slate-200 whitespace-pre-wrap">{moment.userMessage}</div>
                  </div>
                  <div className="pl-6 border-l-2 border-violet-200 dark:border-violet-900/50">
                    <div className="markdown-body text-slate-700 dark:text-slate-300">
                      <ReactMarkdown>{moment.aiMessage}</ReactMarkdown>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
