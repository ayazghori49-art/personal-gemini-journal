const fs = require('fs');
let code = fs.readFileSync('src/components/views/HistoryView.tsx', 'utf8');

const regex = /<button \s*onClick=\{\(e\) => \{\s*e\.stopPropagation\(\);\s*setOpenMenuId\(null\);\s*if\(window\.confirm\('Delete this conversation\?'\)\) \{\s*onDeleteEntry\(item\.id\);\s*\}\s*\}\}\s*className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900\/20 flex items-center gap-2"\s*>\s*<Trash2 className="w-4 h-4" \/> Delete\s*<\/button>/;

const replacement = `<button 
                        disabled
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          setOpenMenuId(null);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-stone-400 dark:text-stone-600 flex items-center gap-2 cursor-not-allowed opacity-50"
                      >
                        <Trash2 className="w-4 h-4" /> Delete Disabled
                      </button>`;

code = code.replace(regex, replacement);
fs.writeFileSync('src/components/views/HistoryView.tsx', code);
console.log("Patched delete button to be disabled");
