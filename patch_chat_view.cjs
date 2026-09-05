const fs = require('fs');
let code = fs.readFileSync('src/components/views/ChatView.tsx', 'utf8');

const regex = /return null;/;

const replacement = `return (
                         <button 
                           onClick={async () => {
                             if (!momentId) return;
                             setSavingMoments(prev => ({...prev, [momentId]: true}));
                             if (isSaved) {
                               await removeMoment(momentId);
                             } else {
                               await saveMoment(userMsgText, m.text);
                             }
                             setSavingMoments(prev => ({...prev, [momentId]: false}));
                           }}
                           disabled={isSaving}
                           className="flex items-center gap-1.5 px-3 py-1.5 mt-2 rounded-lg text-xs font-medium transition-colors border border-transparent shadow-sm bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 hover:border-stone-300 dark:hover:border-stone-600 disabled:opacity-50"
                         >
                           {isSaving ? (
                             <Loader2 className="w-3.5 h-3.5 animate-spin" />
                           ) : isSaved ? (
                             <>
                               <Check className="w-3.5 h-3.5 text-violet-500" />
                               <span className="text-violet-600 dark:text-violet-400">Saved</span>
                             </>
                           ) : (
                             <>
                               <Bookmark className="w-3.5 h-3.5" />
                               <span>Save</span>
                             </>
                           )}
                         </button>
                       );`;

code = code.replace(regex, replacement);
fs.writeFileSync('src/components/views/ChatView.tsx', code);
console.log("Patched ChatView to show save button");
