const fs = require('fs');
let code = fs.readFileSync('src/components/views/AnalyticsInsightsView.tsx', 'utf8');

const regex = /\{\/\* Simple Bar Chart \*\/\}[\s\S]*?\{\/\* Mood Trend Card \*\//;
code = code.replace(regex, 
`{/* Simple Bar Chart */}
              <div className="flex items-end gap-2 h-24">
                {activityData.counts.map((count, i) => {
                  const h = Math.max((count / activityData.max) * 100, 5);
                  return (
                    <div key={i} className={\`w-5 rounded-full \${i === 5 ? 'bg-violet-600 dark:bg-violet-500' : 'bg-violet-600 dark:bg-violet-500/20 dark:bg-violet-600 dark:bg-violet-500/10'}\`} style={{ height: \`\${h}%\` }} title={\`\${count} entries\`}></div>
                  );
                })}
              </div>
            </div>
            {/* Mood Trend Card */`);

fs.writeFileSync('src/components/views/AnalyticsInsightsView.tsx', code);
