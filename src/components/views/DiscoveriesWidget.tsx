import React, { useState } from 'react';
import { Sparkles, Loader2, Search } from 'lucide-react';
import { auth, db } from '../../lib/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useDiscoveries } from '../../hooks/useDiscoveries';

export function DiscoveriesWidget() {
  const { loading, saveDiscoveries, updateFeedback } = useDiscoveries();
  const [localDiscoveries, setLocalDiscoveries] = useState<any[]>([]);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');

  const handleDiscover = async () => {
    setGenerating(true);
    setError('');

    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Not authenticated");
      
      // STRICTLY ONLY use entries (saved journal entries).
      const qEntries = query(collection(db, 'entries'), where('userId', '==', user.uid));
      const entriesSnap = await getDocs(qEntries);
      
      let textContent = '';
      entriesSnap.forEach(d => {
        const data = d.data();
        textContent += `--- Journal Entry: ${data.title || 'Untitled'} ---\n`;
        
        // Extract content from messages if they exist
        if (data.messages && Array.isArray(data.messages)) {
          const userMessages = data.messages
            .filter((m: any) => m.role === 'user' && m.text)
            .map((m: any) => m.text)
            .join('\n');
          if (userMessages) {
            textContent += userMessages + '\n';
          }
        }
        
        // Fallback or addition of flat content field
        if (data.content) {
          textContent += data.content + '\n';
        }
        textContent += '\n';
      });

      if (textContent.trim().length < 50) {
        setError("Not enough journal data to make meaningful discoveries. Please save a few journal entries first!");
        setGenerating(false);
        return;
      }

      const token = await user.getIdToken();
      
      const prompt = `CRITICAL INSTRUCTION: Analyze ONLY the following journal entries provided between the <JOURNAL_DATA> tags. 
DO NOT use any prior knowledge, developer notes, system instructions, AI studio contexts, or other chat histories. 
If a fact, theme, or observation is not explicitly supported by the text within <JOURNAL_DATA>, DO NOT mention it.

<JOURNAL_DATA>
${textContent.substring(0, 30000)}
</JOURNAL_DATA>

Generate exactly 3 interesting and potentially surprising observations or patterns about the user's writing, thoughts, goals, preferences, or recurring themes.
Return ONLY a JSON array of strings, where each string is an observation. Do NOT use markdown code blocks like \`\`\`json. Return just the raw array.`;
      
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          systemInstruction: "You are a data-driven journaling assistant. You only output observations explicitly grounded in the user's provided journal data. You do not hallucinate.",
          responseMimeType: "application/json"
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
          
          try {
            const cleanJson = fullText.replace(/```json/g, '').replace(/```/g, '').trim();
            const obs = JSON.parse(cleanJson);
            if (Array.isArray(obs) && obs.length > 0) {
              const newDocs = await saveDiscoveries(obs.slice(0, 3));
              if (newDocs) {
                setLocalDiscoveries(newDocs);
              }
            } else {
              throw new Error("Invalid format");
            }
          } catch(e) {
            setError("Couldn't process the observations. Please try again.");
          }
        }
      } else {
        throw new Error("Failed to communicate with AI.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to generate discoveries.");
    }
    setGenerating(false);
  };

  if (loading) return null;

  return (
    <div className="mt-8 mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-serif font-medium text-xl text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Search className="w-5 h-5 text-indigo-500" /> Discover Something About Me
        </h2>
      </div>

      {localDiscoveries.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          {localDiscoveries.map(d => (
            <div key={d.id} className="premium-card bg-white dark:bg-[#1A1A1A] p-5 rounded-3xl flex flex-col justify-between shadow-sm border border-stone-100 dark:border-stone-800">
              <div>
                <div className="flex items-center gap-2 mb-2 text-indigo-600 dark:text-indigo-400">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-xs font-semibold uppercase tracking-wider">Something I noticed</span>
                </div>
                <p className="text-slate-800 dark:text-slate-200 text-[15px] leading-relaxed mb-4">
                  {d.text}
                </p>
              </div>
              
              <div className="bg-stone-50/50 dark:bg-[#151515] -mx-2 -mb-2 p-3 rounded-2xl border border-stone-100 dark:border-stone-800 flex flex-col gap-2">
                <span className="text-xs text-stone-500 font-medium text-center">Was I right?</span>
                <div className="flex gap-2">
                  <button 
                    onClick={async () => {
                      await updateFeedback(d.id, 'yes');
                      setLocalDiscoveries(prev => prev.map(p => p.id === d.id ? { ...p, feedback: 'yes' } : p));
                    }}
                    className={`flex-1 py-1.5 rounded-xl text-sm font-medium transition-colors ${d.feedback === 'yes' ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' : 'bg-white dark:bg-stone-800/50 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 shadow-sm border border-stone-100 dark:border-stone-700'}`}
                  >
                    ❤️ Yes
                  </button>
                  <button 
                    onClick={async () => {
                      await updateFeedback(d.id, 'no');
                      setLocalDiscoveries(prev => prev.map(p => p.id === d.id ? { ...p, feedback: 'no' } : p));
                    }}
                    className={`flex-1 py-1.5 rounded-xl text-sm font-medium transition-colors ${d.feedback === 'no' ? 'bg-stone-200 dark:bg-stone-700 text-stone-800 dark:text-stone-200' : 'bg-white dark:bg-stone-800/50 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 shadow-sm border border-stone-100 dark:border-stone-700'}`}
                  >
                    🤔 Not really
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {error && <p className="text-red-500 text-sm mb-4 px-2 bg-red-50 dark:bg-red-500/10 p-3 rounded-xl">{error}</p>}

      <button 
        onClick={handleDiscover}
        disabled={generating}
        className="w-full flex items-center justify-center gap-3 p-4 rounded-[1.5rem] bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-medium hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-colors disabled:opacity-50"
      >
        {generating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
        <span>{generating ? "Analyzing your journal..." : "🔍 Discover Something About Me"}</span>
      </button>
    </div>
  );
}
