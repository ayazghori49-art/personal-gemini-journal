const fs = require('fs');
let code = fs.readFileSync('src/components/views/SettingsView.tsx', 'utf8');

code = code.replace(/<h3 className="text-sm font-medium text-stone-500 mb-4" onClick={\(e\) => console.log\("Clicked General Title", e.target\)}>/g, '<h3 className="text-sm font-medium text-stone-500 mb-4">');

code = code.replace(/<button onClick={\(e\) => { console.log\("Clicked Notifications", e.target\); toggleNotifications\(\); }}/g, '<button onClick={toggleNotifications}');

fs.writeFileSync('src/components/views/SettingsView.tsx', code);
