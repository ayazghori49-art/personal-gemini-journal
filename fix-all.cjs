const fs = require('fs');
const path = require('path');

const viewsDir = 'src/components/views';
const layoutDir = 'src/components/layout';
const rootDir = 'src/components';

function processFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  let code = fs.readFileSync(filePath, 'utf8');

  // Replace standard cards with premium-card
  code = code.replace(/bg-white dark:bg-\[#1A1A1A\] rounded-\[1\.5rem\] p-2 shadow-sm border border-stone-100 dark:border-stone-800\/50/g, 'premium-card p-2');
  code = code.replace(/bg-white dark:bg-\[#1A1A1A\] rounded-\[2rem\] p-6 border border-stone-100 dark:border-stone-800 shadow-sm/g, 'premium-card p-6');
  code = code.replace(/bg-white dark:bg-\[#1A1A1A\] border border-stone-100 dark:border-stone-800 shadow-sm/g, 'premium-card');
  code = code.replace(/bg-white\/80 dark:bg-\[#1A1A1A\]\/80 backdrop-blur-xl border-t border-stone-200 dark:border-stone-800/g, 'bg-white/40 dark:bg-[#0D0D12]/60 backdrop-blur-2xl border-t border-white/20 dark:border-white/5 premium-shadow');

  // Replace purple accents
  code = code.replace(/bg-\[#9b87f5\]/g, 'bg-violet-600 dark:bg-violet-500');
  code = code.replace(/text-\[#9b87f5\]/g, 'text-violet-600 dark:text-violet-400');
  code = code.replace(/border-\[#9b87f5\]/g, 'border-violet-600 dark:border-violet-400');
  code = code.replace(/text-\[#7E69AB\]/g, 'text-violet-600 dark:text-violet-400');

  // Header background / general backgrounds
  code = code.replace(/bg-\[#FDFBF7\]\/90 dark:bg-\[#121212\]\/90/g, 'bg-white/40 dark:bg-[#0D0D12]/60 backdrop-blur-2xl');
  code = code.replace(/bg-\[#FDFBF7\] dark:bg-\[#121212\]/g, 'bg-transparent');

  // General text colors
  code = code.replace(/text-stone-900 dark:text-stone-100/g, 'text-slate-900 dark:text-slate-100');
  code = code.replace(/text-stone-500 dark:text-stone-400/g, 'text-slate-500 dark:text-slate-400');
  code = code.replace(/text-stone-800 dark:text-stone-200/g, 'text-slate-800 dark:text-slate-200');
  code = code.replace(/text-stone-600 dark:text-stone-300/g, 'text-slate-600 dark:text-slate-300');
  code = code.replace(/text-stone-700 dark:text-stone-300/g, 'text-slate-700 dark:text-slate-300');
  
  // Drawer Background
  code = code.replace(/bg-\[#FAFAFA\] dark:bg-\[#0D0D12\]/g, 'bg-[#FAF9F6] dark:bg-[#0D0D12]');
  
  fs.writeFileSync(filePath, code);
}

const dirs = [viewsDir, layoutDir, rootDir];
for (const d of dirs) {
  const files = fs.readdirSync(d);
  for (const f of files) {
    if (f.endsWith('.tsx') || f.endsWith('.ts')) {
      processFile(path.join(d, f));
    }
  }
}
