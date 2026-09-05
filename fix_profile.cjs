const fs = require('fs');
let code = fs.readFileSync('src/components/views/ProfileView.tsx', 'utf8');

// Update signature
code = code.replace(
  /export function ProfileView\(\{(.*?)\}: any\) \{/,
  "import { ArrowLeft } from 'lucide-react';\nexport function ProfileView({$1, onNavigateBack}: any) {"
);

// Replace button at top left
code = code.replace(
  /<button onClick=\{onOpenDrawer\} className="p-2 -ml-2 rounded-full hover:bg-stone-200\/50 dark:hover:bg-stone-800\/50 transition-colors">\s*<svg.*?>.*?<\/svg>\s*<\/button>/,
  `<button onClick={onNavigateBack} className="p-2 -ml-2 rounded-full hover:bg-stone-200/50 dark:hover:bg-stone-800/50 transition-colors">\n          <ArrowLeft className="w-5 h-5 text-slate-800 dark:text-slate-200" />\n        </button>`
);

fs.writeFileSync('src/components/views/ProfileView.tsx', code);
