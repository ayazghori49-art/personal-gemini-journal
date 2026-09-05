const fs = require('fs');

let jApp = fs.readFileSync('src/components/JournalApp.tsx', 'utf8');
jApp = jApp.replace(/<SettingsView/g, '<SettingsView onLogout={onLogout}');
jApp = jApp.replace(/<ProfileView/g, '<ProfileView onLogout={onLogout}');
fs.writeFileSync('src/components/JournalApp.tsx', jApp);

let settings = fs.readFileSync('src/components/views/SettingsView.tsx', 'utf8');
settings = settings.replace(/interface SettingsViewProps {/g, 'interface SettingsViewProps {\n  onLogout?: () => void;');
settings = settings.replace(/export function SettingsView\({ settings, updateSettings, onClearHistory, onOpenDrawer, onNavigateBack }: SettingsViewProps\) {/g, 'export function SettingsView({ settings, updateSettings, onClearHistory, onOpenDrawer, onNavigateBack, onLogout }: SettingsViewProps) {');
settings = settings.replace(/const onSignOut = \(\) => window\.location\.reload\(\);/g, 'const onSignOut = () => { if(onLogout) onLogout(); else window.location.reload(); };');
fs.writeFileSync('src/components/views/SettingsView.tsx', settings);

let profile = fs.readFileSync('src/components/views/ProfileView.tsx', 'utf8');
profile = profile.replace(/export function ProfileView\({ profileName, onOpenDrawer, onNavigateToSettings , lang = 'en'}: any\) {/g, 'export function ProfileView({ profileName, onOpenDrawer, onNavigateToSettings, onLogout, lang = "en" }: any) {');
profile = profile.replace(/onClick=\{\(\) => window\.location\.reload\(\)\}/g, 'onClick={() => { if(onLogout) onLogout(); else window.location.reload(); }}');
fs.writeFileSync('src/components/views/ProfileView.tsx', profile);

