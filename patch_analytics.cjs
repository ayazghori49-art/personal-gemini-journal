const fs = require('fs');
let code = fs.readFileSync('src/components/views/AnalyticsInsightsView.tsx', 'utf8');

// 1. Add activityData calculation
const trendDataIndex = code.indexOf('  // 2. Calculate Mood Trend based on selected period');
const activityDataSnippet = `
  // Calculate Activity Data (Last 6 Months)
  const activityData = useMemo(() => {
    const data = [];
    const now = new Date();
    let maxCount = 0;
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const m = d.getMonth();
      const y = d.getFullYear();
      const count = entries.filter(e => {
        const ed = new Date(e.createdAt);
        return ed.getMonth() === m && ed.getFullYear() === y;
      }).length;
      if (count > maxCount) maxCount = count;
      data.push(count);
    }
    return {
      counts: data,
      max: maxCount === 0 ? 1 : maxCount
    };
  }, [entries]);

`;
code = code.slice(0, trendDataIndex) + activityDataSnippet + code.slice(trendDataIndex);

// 2. Fix trendData to return points and path
const moodCountsRegex = /const moodCounts: Record<string, number> = \{\};\s*let totalMoods = 0;/;

code = code.replace(moodCountsRegex, `
    filteredEntries.sort((a, b) => a.createdAt - b.createdAt);
    
    const moodScores: Record<string, number> = {
      '😊': 80, '😌': 70, '😐': 50, '😔': 30, '😭': 10, '😡': 20, '🥳': 100, '🥰': 90, '😴': 40, '🤔': 50, '😅': 60, '😁': 85, '😎': 80, '🥺': 25, '😫': 20
    };
    const getScore = (mood?: string) => {
      if (!mood) return 50;
      const m = mood.split(' ')[0];
      return moodScores[m] || 50;
    };

    const points: [number, number][] = [];
    if (filteredEntries.length > 0) {
       const numPoints = filteredEntries.length;
       filteredEntries.forEach((e, i) => {
         const x = numPoints === 1 ? 50 : Math.round((i / (numPoints - 1)) * 100);
         const score = getScore(e.mood);
         const y = 100 - score;
         points.push([x, y]);
       });
    }
    const pathD = points.length > 0 ? \`M\${points.map(p => \`\${p[0]},\${p[1]}\`).join(' L')}\` : '';

    const moodCounts: Record<string, number> = {};
    let totalMoods = 0;`);

code = code.replace(/return \{ totalMoods, percentages \};/, "return { totalMoods, percentages, points, pathD };");


// 3. Update Bar Chart UI
const barChartRegex = /\{\/\* Simple Bar Chart \*\/\}[\s\S]*?<\/div>/;
const newBarChart = `{/* Simple Bar Chart */}
              <div className="flex items-end gap-2 h-24">
                {activityData.counts.map((count, i) => {
                  const h = Math.max((count / activityData.max) * 100, 5);
                  return (
                    <div key={i} className={\`w-5 rounded-full \${i === 5 ? 'bg-violet-600 dark:bg-violet-500' : 'bg-violet-600 dark:bg-violet-500/20 dark:bg-violet-600 dark:bg-violet-500/10'}\`} style={{ height: \`\${h}%\` }} title={\`\${count} entries\`}></div>
                  );
                })}
              </div>`;
code = code.replace(barChartRegex, newBarChart);


// 4. Update Line Chart UI
const lineChartRegex = /<svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">[\s\S]*?<\/svg>/;
const newLineChart = `<svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
                      {trendData.pathD && <path d={trendData.pathD} fill="none" stroke="#9b87f5" strokeWidth="3" vectorEffect="non-scaling-stroke" opacity="0.5" />}
                      {trendData.points.map(([x,y], i) => (
                        <circle key={i} cx={x} cy={y} r="3" fill="#9b87f5" vectorEffect="non-scaling-stroke" />
                      ))}
                    </svg>`;
code = code.replace(lineChartRegex, newLineChart);

fs.writeFileSync('src/components/views/AnalyticsInsightsView.tsx', code);
console.log("Patched AnalyticsInsightsView.tsx");
