const fs = require('fs');
const file = 'src/components/views/HistoryView.tsx';

const content = `import { t } from '../../lib/i18n';
import { useState, useRef } from 'react';
import { ChatSession } from '../../types';
import { MessageSquare, Trash2 } from 'lucide-react';

export function HistoryView({ entries, onOpenEntry, onDeleteEntry, onOpenDrawer, onNavigateBack , lang = 'en'}: any) {
  const [searchQuery, setSearchQuery] = useState('');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isLongPressRef = useRef(false);

  const startPress = (id: string, e: React.PointerEvent | React.TouchEvent | React.MouseEvent) => {
    if ('button' in e && e.button !== 0) return;
    
    isLongPressRef.current = false;
    timerRef.current = setTimeout(() => {
      isLongPressRef.current = true;
      setOpenMenuId(id);
    }, 500);
  };

  const cancelPress = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleItemClick = (id: string, e: React.MouseEvent) => {
    if (isLongPressRef.current) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    if (openMenuId === id) {
      setOpenMenuId(null);
      return;
    }
    onOpenEntry(id);
  };

  const sortedEntries = [...entries].sort((a, b) => (b.updatedAt || b.createdAt) - (a.updatedAt || a.createdAt)).filter(e => e.title?.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="flex-1 flex flex-col h-full bg-transparent custom-scrollbar overflow-y-auto">
      {/* Header */}
      <div className="px-6 pt-12 pb-6 flex items-center justify-between sticky top-0 bg-white/40 dark:bg-[#0D0D12]/60 backdrop-blur-2xl backdrop-blur-md z-10">
        <button onClick={onNavigateBack} className="p-2 -ml-2 rounded-full hover:bg-stone-200/50 dark:hover:bg-stone-800/50 transition-colors">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-800 dark:text-slate-200"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <h2 className="font-serif font-medium text-[17px] text-slate-900 dark:text-slate-100">{t('chat_history', lang)}</h2>
        <button className="p-2 -mr-2 rounded-full hover:bg-stone-200/50 dark:hover:bg-stone-800/50 transition-colors">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-800 dark:text-slate-200"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
        </button>
      </div>

      <div className="px-6 pb-24">
        {/* Search */}
        <div className="mb-6">
          <input 
            type="text" 
            placeholder="Search conversations..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent border-none text-slate-900 dark:text-slate-100 placeholder-stone-400 focus:ring-0 px-2 py-3 outline-none text-sm"
          />
        </div>

        {/* History List */}
        <div className="space-y-6">
          {sortedEntries.length === 0 ? (
            <div className="text-center py-12 text-stone-500">No conversations found.</div>
          ) : (
            sortedEntries.map(item => (
              <div 
                key={item.id} 
                className="relative flex items-center justify-between group cursor-pointer hover:bg-stone-100/50 dark:hover:bg-stone-800/30 p-2 -mx-2 rounded-xl transition-colors select-none touch-manipulation"
                onPointerDown={(e) => startPress(item.id, e)}
                onPointerUp={cancelPress}
                onPointerLeave={cancelPress}
                onPointerCancel={cancelPress}
                onTouchMove={cancelPress}
                onClick={(e) => handleItemClick(item.id, e)}
                onContextMenu={(e) => {
                  e.preventDefault();
                  setOpenMenuId(item.id);
                }}
              >
                <div className="flex items-start gap-4 flex-1 pointer-events-none">
                  <div className="mt-1 flex-shrink-0">
                    <MessageSquare className="w-5 h-5 text-stone-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-[15px] text-slate-900 dark:text-slate-100 mb-0.5 line-clamp-1 group-hover:text-violet-600 dark:text-violet-400 transition-colors">{item.title}</h3>
                    <p className="text-xs text-stone-400">{new Date(item.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                  </div>
                </div>
                
                {openMenuId === item.id && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={(e) => { e.stopPropagation(); setOpenMenuId(null); }} />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 w-32 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-stone-200 dark:border-slate-700 py-1 z-50 overflow-hidden">
                      <button 
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          setOpenMenuId(null);
                          if(window.confirm('Delete this conversation?')) { 
                            onDeleteEntry(item.id); 
                          } 
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" /> Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
`;

fs.writeFileSync(file, content);
console.log("Updated HistoryView.tsx");
