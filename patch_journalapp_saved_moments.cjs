const fs = require('fs');
let code = fs.readFileSync('src/components/JournalApp.tsx', 'utf8');

const regex = /\{currentTab === 'saved_moments' && <SavedMomentsView onOpenDrawer=\{\(\) => setIsDrawerOpen\(true\)\} \/>\}/;
code = code.replace(regex, "{currentTab === 'saved_moments' && <SavedMomentsView onOpenDrawer={() => setIsDrawerOpen(true)} onNavigateBack={() => setCurrentTab('home')} />}");

fs.writeFileSync('src/components/JournalApp.tsx', code);
console.log("Patched JournalApp");
