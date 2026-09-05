const fs = require('fs');
let code = fs.readFileSync('src/components/views/ChatView.tsx', 'utf8');

// The bubble background
code = code.replace(/bg-white dark:bg-\[#1A1A1A\] border border-stone-100 dark:border-stone-800\/50 shadow-xl shadow-stone-200\/50 dark:shadow-none text-slate-800 dark:text-slate-200 rounded-3xl rounded-tl-md shadow-sm/g, 'premium-card text-slate-800 dark:text-slate-200 rounded-tl-md');

code = code.replace(/bg-white dark:bg-\[#1A1A1A\] border border-slate-100 dark:border-slate-800\/50 shadow-xl shadow-slate-200\/50 dark:shadow-none text-slate-800 dark:text-slate-200 rounded-3xl rounded-tl-md shadow-sm/g, 'premium-card text-slate-800 dark:text-slate-200 rounded-tl-md');


// Chat input container
code = code.replace(/bg-white\/90 dark:bg-\[#121212\]\/90 backdrop-blur-xl border-t border-stone-200 dark:border-stone-800\/50/g, 'bg-white/40 dark:bg-[#0D0D12]/60 backdrop-blur-2xl border-t border-white/20 dark:border-white/5 premium-shadow');

// Quick prompt container
code = code.replace(/premium-card p-4 hover:shadow-md transition-shadow cursor-pointer/g, 'premium-card p-4 hover:shadow-md transition-all active:scale-[0.98] cursor-pointer group');
code = code.replace(/hover:bg-slate-50/g, 'hover:bg-white/50 dark:hover:bg-white/5');

fs.writeFileSync('src/components/views/ChatView.tsx', code);
