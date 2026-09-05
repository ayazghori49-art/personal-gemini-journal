const fs = require('fs');
let code = fs.readFileSync('src/components/layout/Sidebar.tsx', 'utf8');

// Update background
code = code.replace(/bg-white\/50 dark:bg-\[#121212\]\/50 backdrop-blur-xl border-r border-stone-200 dark:border-stone-800\/50/g, 'bg-white/40 dark:bg-[#0D0D12]/60 backdrop-blur-2xl border-r border-white/20 dark:border-white/5');

// Update item colors
code = code.replace(/text-stone-700 dark:text-stone-300 hover:bg-white dark:hover:bg-\[#1A1A1A\] hover:shadow-sm/g, 'text-slate-700 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-white/5 hover:shadow-sm');

// Active background
code = code.replace(/bg-white dark:bg-\[#1A1A1A\] shadow-sm text-stone-900 dark:text-stone-100/g, 'premium-card p-3 shadow-sm text-slate-900 dark:text-slate-100');
code = code.replace(/text-\[#9b87f5\]/g, 'text-violet-600 dark:text-violet-400');
code = code.replace(/text-stone-400/g, 'text-slate-400');

fs.writeFileSync('src/components/layout/Sidebar.tsx', code);
