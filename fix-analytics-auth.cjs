const fs = require('fs');
const file = 'src/components/views/AnalyticsInsightsView.tsx';
let code = fs.readFileSync(file, 'utf8');

if (!code.includes("import { auth }")) {
  code = `import { auth } from '../../lib/firebase';\n` + code;
}

fs.writeFileSync(file, code);
