const fs = require('fs');
let code = fs.readFileSync('src/components/views/AnalyticsInsightsView.tsx', 'utf8');

// Remove import
code = code.replace(/import \{ DiscoveriesWidget \} from '\.\/DiscoveriesWidget';\n?/, '');

// Remove widget render
const widgetRegex = /\{\/\* Discoveries Widget \*\/\}\s*<div className="mt-8">\s*<DiscoveriesWidget \/>\s*<\/div>/m;
code = code.replace(widgetRegex, '');

fs.writeFileSync('src/components/views/AnalyticsInsightsView.tsx', code);
console.log("Patched AnalyticsInsightsView");
