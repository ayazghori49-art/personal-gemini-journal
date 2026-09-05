const fs = require('fs');
let code = fs.readFileSync('src/components/views/SummariesView.tsx', 'utf8');

const handleSaveRegex = /const handleSave = async \(\) => \{[\s\S]*?setIsSaved\(true\);\s*\};/;
const newHandleSave = `const handleSave = async () => {
    if (!summary || isSaved) return;
    try {
      setError('');
      // check for exact duplicate before saving
      const isDuplicate = savedSummaries.some(s => s.summaryText === summary && s.timeRange === range);
      if (isDuplicate) {
        throw new Error("This summary has already been saved.");
      }
      await saveSummary(range, summary);
      setIsSaved(true);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to save summary.");
    }
  };`;

code = code.replace(handleSaveRegex, newHandleSave);
fs.writeFileSync('src/components/views/SummariesView.tsx', code);
console.log("Patched SummariesView.tsx");
