const fs = require('fs');
let code = fs.readFileSync('src/components/views/SavedMomentsView.tsx', 'utf8');

const importRegex = /import \{ Bookmark, Loader2, Sparkles, Trash2, Quote, Menu \} from 'lucide-react';/;
code = code.replace(importRegex, "import { Bookmark, Loader2, Sparkles, Trash2, Quote, Menu, ArrowLeft } from 'lucide-react';");

const propsRegex = /export function SavedMomentsView\(\{ onOpenDrawer \}: \{ onOpenDrawer\?: \(\) => void \}\) \{/;
code = code.replace(propsRegex, "export function SavedMomentsView({ onOpenDrawer, onNavigateBack }: { onOpenDrawer?: () => void, onNavigateBack?: () => void }) {");

const renderRegex = /<div className="max-w-4xl mx-auto py-12 px-6">/;
const replacement = `<div className="max-w-4xl mx-auto py-8 px-6">
        {onNavigateBack && (
          <button
            onClick={onNavigateBack}
            className="mb-8 flex items-center gap-2 text-stone-500 hover:text-slate-900 dark:hover:text-slate-100 transition-colors font-medium text-[15px]"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
        )}`;
code = code.replace(renderRegex, replacement);

fs.writeFileSync('src/components/views/SavedMomentsView.tsx', code);
console.log("Patched SavedMomentsView");
