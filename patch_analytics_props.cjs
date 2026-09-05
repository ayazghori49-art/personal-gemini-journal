const fs = require('fs');
let code = fs.readFileSync('src/components/views/AnalyticsInsightsView.tsx', 'utf8');

const targetProps = /interface AnalyticsInsightsViewProps \{\s*onNavigateBack\?: \(\) => void;\s*onOpenDrawer: \(\) => void;\s*entries: JournalEntry\[\];\s*lang\?: string;\s*\}/m;

const replacementProps = `interface AnalyticsInsightsViewProps {
  onNavigateBack?: () => void;
  onOpenDrawer: () => void;
  entries: JournalEntry[];
  lang?: string;
  onAction?: (action: string) => void;
}`;

code = code.replace(targetProps, replacementProps);
fs.writeFileSync('src/components/views/AnalyticsInsightsView.tsx', code);
console.log("Patched AnalyticsInsightsViewProps in AnalyticsInsightsView.tsx");
