const fs = require('fs');
let code = fs.readFileSync('src/components/JournalApp.tsx', 'utf8');

const importHook = "import { useSavedMoments } from '../hooks/useSavedMoments';";
code = code.replace(importHook, importHook + "\nimport { useSavedSummaries } from '../hooks/useSavedSummaries';");

const useHook = "const { savedMoments, loading: savedMomentsLoading } = useSavedMoments();";
code = code.replace(useHook, useHook + "\n  const { savedSummaries, loading: savedSummariesLoading } = useSavedSummaries();");

const exportRegex = /const handleExportData = \(\) => \{[\s\S]*?URL\.revokeObjectURL\(dataUri\);\s*\}, 60000\);\s*\} catch \(err\) \{[\s\S]*?\}\s*\};/;

const newExport = `const handleExportData = () => {
    try {
      if (savedMomentsLoading || savedSummariesLoading) {
        alert("Data is still loading, please wait...");
        return;
      }
      if ((!savedMoments || savedMoments.length === 0) && (!savedSummaries || savedSummaries.length === 0)) {
        alert("No saved data to export.");
        return;
      }
      
      let textContent = "YOUR EXPORTED DATA\\n=======================\\n\\n";
      
      if (savedMoments && savedMoments.length > 0) {
        textContent += "--- SAVED MOMENTS ---\\n\\n";
        savedMoments.forEach((moment) => {
          textContent += \`[\${new Date(moment.createdAt).toLocaleString()}]\\n\`;
          textContent += \`Summary: \${moment.summary || 'Saved Reflection'}\\n\\n\`;
          textContent += \`YOU:\\n\${moment.userMessage}\\n\\n\`;
          textContent += \`AI:\\n\${moment.aiMessage}\\n\`;
          textContent += \`\\n----------------------------------------\\n\\n\`;
        });
      }

      if (savedSummaries && savedSummaries.length > 0) {
        textContent += "--- SAVED SUMMARIES ---\\n\\n";
        savedSummaries.forEach((summary) => {
          textContent += \`[\${new Date(summary.createdAt).toLocaleString()}] - \${summary.timeRange}\\n\\n\`;
          textContent += \`\${summary.summaryText}\\n\`;
          textContent += \`\\n----------------------------------------\\n\\n\`;
        });
      }

      const blob = new Blob([textContent], { type: 'text/plain' });
      const dataUri = URL.createObjectURL(blob);
      const exportFileDefaultName = 'saved-data-export.txt';
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.style.display = 'none';
      document.body.appendChild(linkElement);
      linkElement.click();
      document.body.removeChild(linkElement);
      
      setTimeout(() => {
        URL.revokeObjectURL(dataUri);
      }, 60000);
    } catch (err) {
      console.error("Export Error:", err);
      alert("Failed to export data: " + err);
    }
  };`;

code = code.replace(exportRegex, newExport);

fs.writeFileSync('src/components/JournalApp.tsx', code);
console.log("Patched JournalApp.tsx for export");
