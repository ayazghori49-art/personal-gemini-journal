const fs = require('fs');
let code = fs.readFileSync('src/index.css', 'utf8');

code = code.replace(/@apply bg-white\/80 dark:bg-\[#16161E\]\/80 backdrop-blur-xl border border-white\/50 dark:border-white\/5 rounded-3xl premium-shadow;/g, '  @apply bg-white/80 dark:bg-[#16161E]/80 backdrop-blur-xl border border-white/50 dark:border-white/5 rounded-3xl;\n  box-shadow: 0 10px 40px -10px rgba(0,0,0,0.06), 0 4px 12px -6px rgba(0,0,0,0.03);\n}\n.dark .premium-card {\n  box-shadow: 0 10px 40px -10px rgba(0,0,0,0.3), 0 4px 12px -6px rgba(0,0,0,0.2);\n');

fs.writeFileSync('src/index.css', code);
