const fs = require('fs');
let code = fs.readFileSync('src/components/views/HistoryView.tsx', 'utf8');

const regex = /onClick=\{\(e\) => \{\s*e\.stopPropagation\(\);\s*setOpenMenuId\(null\);\s*console\.log\("DELETE CLICKED in UI for chat ID:", item\.id\);\s*if\(window\.confirm\('Delete this conversation\?'\)\) \{\s*onDeleteEntry\(item\.id\);\s*\}\s*\}\}/;

const replacement = `onPointerDown={(e) => { 
                          e.preventDefault();
                          e.stopPropagation(); 
                          setOpenMenuId(null);
                          console.log("DELETE CLICKED in UI for chat ID:", item.id);
                          if(window.confirm('Delete this conversation?')) { 
                            onDeleteEntry(item.id); 
                          } 
                        }}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}`;

code = code.replace(regex, replacement);
fs.writeFileSync('src/components/views/HistoryView.tsx', code);
console.log("Patched HistoryView to use onPointerDown");
