const fs = require('fs');
let code = fs.readFileSync('src/components/layout/Drawer.tsx', 'utf8');

const importRegex = /import \{ Bookmark, X, Plus, MessageSquare, Compass, User, Settings, Home, BarChart2, Search, BrainCircuit \} from 'lucide-react';/;
code = code.replace(importRegex, "import { Bookmark, X, Plus, MessageSquare, Compass, User, Settings, Home, BarChart2, Search, BrainCircuit, FileText } from 'lucide-react';");

const targetMenu = /<button\s*onClick=\{\(\) => \{\s*onNavigate\('history'\);\s*onClose\(\);\s*\}\}\s*className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-colors text-slate-700 dark:text-slate-300 hover:bg-stone-200\/50 dark:hover:bg-white\/5"\s*>\s*<MessageSquare className="w-4 h-4 text-slate-400" \/> Chat History\s*<\/button>/;

const newMenu = `<button
            onClick={() => {
              onNavigate('history');
              onClose();
            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-colors text-slate-700 dark:text-slate-300 hover:bg-stone-200/50 dark:hover:bg-white/5"
          >
            <MessageSquare className="w-4 h-4 text-slate-400" /> Chat History
          </button>
          
          <button
            onClick={() => {
              onNavigate('summaries');
              onClose();
            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-colors text-slate-700 dark:text-slate-300 hover:bg-stone-200/50 dark:hover:bg-white/5"
          >
            <FileText className="w-4 h-4 text-slate-400" /> Summaries
          </button>`;

code = code.replace(targetMenu, newMenu);

fs.writeFileSync('src/components/layout/Drawer.tsx', code);
console.log("Patched Drawer");
