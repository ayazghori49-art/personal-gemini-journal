const fs = require('fs');
let code = fs.readFileSync('src/components/views/HomeView.tsx', 'utf8');

// Replace standard cards with premium-card
code = code.replace(/bg-white dark:bg-\[#1A1A1A\] border border-stone-100 dark:border-stone-800 shadow-sm/g, 'premium-card');
code = code.replace(/bg-white dark:bg-\[#1A1A1A\] rounded-\[2rem\] p-6 border border-stone-100 dark:border-stone-800 shadow-sm/g, 'premium-card p-6');

// Replace purple accents
code = code.replace(/bg-\[#9b87f5\]/g, 'bg-violet-600 dark:bg-violet-500');
code = code.replace(/text-\[#9b87f5\]/g, 'text-violet-600 dark:text-violet-400');
code = code.replace(/border-\[#9b87f5\]/g, 'border-violet-600 dark:border-violet-400');

// Header background
code = code.replace(/bg-\[#FDFBF7\]\/90 dark:bg-\[#121212\]\/90/g, 'bg-white/40 dark:bg-[#0D0D12]/60');

// General text colors
code = code.replace(/text-stone-900 dark:text-stone-100/g, 'text-slate-900 dark:text-slate-100');
code = code.replace(/text-stone-500 dark:text-stone-400/g, 'text-slate-500 dark:text-slate-400');
code = code.replace(/text-stone-800 dark:text-stone-200/g, 'text-slate-800 dark:text-slate-200');

fs.writeFileSync('src/components/views/HomeView.tsx', code);
