const fs = require('fs');
let code = fs.readFileSync('src/components/views/SummariesView.tsx', 'utf8');

const targetDates = /const now = Date\.now\(\);\s*let startTime = 0;\s*if \(range === '1 Day'\) startTime = now - 24 \* 60 \* 60 \* 1000;\s*if \(range === '1 Week'\) startTime = now - 7 \* 24 \* 60 \* 60 \* 1000;\s*if \(range === '1 Month'\) startTime = now - 30 \* 24 \* 60 \* 60 \* 1000;/;

const newDates = `const now = new Date();
      let startTime = 0;
      if (range === '1 Day') {
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        startTime = startOfToday.getTime();
      }
      if (range === '1 Week') {
        const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
        startTime = startOfWeek.getTime();
      }
      if (range === '1 Month') {
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 30);
        startTime = startOfMonth.getTime();
      }`;

code = code.replace(targetDates, newDates);

const targetFilter = /const entries = uniqueData\s*\.filter\(e => e\.createdAt >= startTime\)\s*\.sort\(\(a, b\) => a\.createdAt - b\.createdAt\);/;
const newFilter = `const entries = uniqueData
        .filter(e => {
          const timestamp = e.updatedAt || e.createdAt;
          return timestamp && timestamp >= startTime;
        })
        .sort((a, b) => (a.updatedAt || a.createdAt) - (b.updatedAt || b.createdAt));`;

code = code.replace(targetFilter, newFilter);

fs.writeFileSync('src/components/views/SummariesView.tsx', code);
console.log("Patched SummariesView dates");
