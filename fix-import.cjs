const fs = require('fs');
let code = fs.readFileSync('src/components/views/SettingsView.tsx', 'utf8');
code = code.replace(/import { t } from "\.\.\/\.\.\/lib\/i18n";[ \n]*from '\.\.\/\.\.\/lib\/i18n';/g, "import { t } from '../../lib/i18n';");
fs.writeFileSync('src/components/views/SettingsView.tsx', code);
