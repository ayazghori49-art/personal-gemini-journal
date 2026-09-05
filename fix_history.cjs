const fs = require('fs');
let code = fs.readFileSync('src/components/views/HistoryView.tsx', 'utf8');

// Add state for openMenuId
if (!code.includes('const [openMenuId, setOpenMenuId]')) {
  code = code.replace(
    /const \[searchQuery, setSearchQuery\] = useState\(''\);/,
    "const [searchQuery, setSearchQuery] = useState('');\n  const [openMenuId, setOpenMenuId] = useState<string | null>(null);"
  );
}

const targetButtons = `<button 
                  onClick={(e) => { e.stopPropagation(); if(window.confirm('Delete this conversation?')) { onDeleteEntry(item.id); } }}
                  className="p-2 -mr-2 rounded-full text-stone-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all opacity-0 group-hover:opacity-100 sm:opacity-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button className="p-2 -mr-2 rounded-full text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors sm:hidden opacity-100">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
                </button>`;

const replacement = `<div className="relative flex items-center">
                  <button 
                    onClick={(e) => { e.stopPropagation(); if(window.confirm('Delete this conversation?')) { onDeleteEntry(item.id); } }}
                    className="p-2 rounded-full text-stone-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all hidden sm:block opacity-0 group-hover:opacity-100"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === item.id ? null : item.id); }}
                    className="p-2 -mr-2 rounded-full text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors sm:hidden block relative z-10"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
                  </button>
                  
                  {openMenuId === item.id && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={(e) => { e.stopPropagation(); setOpenMenuId(null); }} />
                      <div className="absolute right-0 top-10 w-32 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-stone-200 dark:border-slate-700 py-1 z-50 overflow-hidden">
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
                </div>`;

code = code.replace(targetButtons, replacement);
fs.writeFileSync('src/components/views/HistoryView.tsx', code);
