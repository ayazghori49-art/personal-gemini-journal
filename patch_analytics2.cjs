const fs = require('fs');
let code = fs.readFileSync('src/components/views/AnalyticsInsightsView.tsx', 'utf8');

const targetTotalCard = /\{\/\* Total Journals Card \*\/\}\s*<div className="bg-white dark:bg-\[\#1A1A1A\] rounded-\[2rem\] p-6 shadow-xl shadow-stone-200\/50 dark:shadow-none mb-6 border border-stone-100 dark:border-stone-800\/50 flex flex-col sm:flex-row sm:items-end justify-between gap-6">\s*<div>\s*<h3 className="text-slate-900 dark:text-slate-100 font-medium mb-2">Total Journals<\/h3>\s*<div className="text-\[3rem\] font-serif leading-none tracking-tight text-stone-900 dark:text-stone-50 mb-1">\s*\{entries.length\}\s*<\/div>\s*<\/div>\s*<\/div>/m;

const replacementTotalCard = `{/* Total Journals Card */}
            <div className="bg-white dark:bg-[#1A1A1A] rounded-[2rem] p-6 shadow-xl shadow-stone-200/50 dark:shadow-none mb-6 border border-stone-100 dark:border-stone-800/50 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
              <div>
                <h3 className="text-slate-900 dark:text-slate-100 font-medium mb-2">Total Journals</h3>
                <div className="text-[3rem] font-serif leading-none tracking-tight text-stone-900 dark:text-stone-50 mb-1">
                  {entries.length}
                </div>
                <p className="text-stone-400 text-sm font-medium">
                  +{entries.filter(e => new Date(e.createdAt).getMonth() === new Date().getMonth()).length} this month
                </p>
              </div>
              {/* Simple Bar Chart */}
              <div className="flex items-end gap-2 h-24">
                {[40, 60, 30, 80, 100, 60].map((h, i) => (
                  <div key={i} className={\`w-5 rounded-full \${i === 4 ? 'bg-violet-600 dark:bg-violet-500' : 'bg-violet-600 dark:bg-violet-500/20 dark:bg-violet-600 dark:bg-violet-500/10'}\`} style={{ height: \`\${h}%\` }}></div>
                ))}
              </div>
            </div>`;

code = code.replace(targetTotalCard, replacementTotalCard);
fs.writeFileSync('src/components/views/AnalyticsInsightsView.tsx', code);
console.log("Patched Total Journals Card");
