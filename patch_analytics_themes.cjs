const fs = require('fs');
let code = fs.readFileSync('src/components/views/AnalyticsInsightsView.tsx', 'utf8');

const targetStr = /const contentStr = entries\.slice\(0, 20\)\.map\(e => e\.title \+ " " \+ e\.content\)\.join\('\\n'\);/;
const replacementStr = `const contentStr = entries.slice(0, 20).map(e => {
          let text = e.title + " ";
          if (e.messages && Array.isArray(e.messages)) {
            text += e.messages.filter(m => m.role === 'user').map(m => m.text).join(' ');
          }
          if (e.content) {
            text += " " + e.content;
          }
          return text;
        }).join('\\n');`;

code = code.replace(targetStr, replacementStr);
fs.writeFileSync('src/components/views/AnalyticsInsightsView.tsx', code);
console.log("Patched contentStr in AnalyticsInsightsView");
