const fs = require('fs');
let settingsCode = fs.readFileSync('src/components/views/SettingsView.tsx', 'utf8');
settingsCode = settingsCode.replace(/import { auth } from '\.\.\/\.\.\/lib\/firebase';\n/g, '');
settingsCode = settingsCode.replace(/const onSignOut = \(\) => auth\.signOut\(\);/g, 'const onSignOut = () => window.location.reload();');
fs.writeFileSync('src/components/views/SettingsView.tsx', settingsCode);

if (fs.existsSync('src/components/views/ProfileView.tsx')) {
  let profileCode = fs.readFileSync('src/components/views/ProfileView.tsx', 'utf8');
  profileCode = profileCode.replace(/import { auth } from '\.\.\/\.\.\/lib\/firebase';\n/g, '');
  profileCode = profileCode.replace(/auth\.signOut\(\)/g, 'window.location.reload()');
  fs.writeFileSync('src/components/views/ProfileView.tsx', profileCode);
}
