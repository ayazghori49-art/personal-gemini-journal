const fs = require('fs');
let code = fs.readFileSync('src/components/layout/Drawer.tsx', 'utf8');

code = code.replace(/bg-\[#FAF9F6\] dark:bg-\[#0D0D12\] shadow-xl/g, 'bg-white/80 dark:bg-[#0D0D12]/80 backdrop-blur-2xl shadow-2xl border-r border-white/20 dark:border-white/5');
code = code.replace(/border-stone-200 dark:border-stone-800\/50/g, 'border-slate-200 dark:border-slate-800/50');
code = code.replace(/text-stone-400/g, 'text-slate-400');
code = code.replace(/text-stone-500/g, 'text-slate-500');

fs.writeFileSync('src/components/layout/Drawer.tsx', code);
