const fs = require('fs');
const file = 'src/components/JournalApp.tsx';
let code = fs.readFileSync(file, 'utf8');

const target1 = `{currentTab === 'saved_moments' && <SavedMomentsView />}`;
const replacement1 = `{currentTab === 'saved_moments' && <SavedMomentsView onOpenDrawer={() => setIsDrawerOpen(true)} />}`;

code = code.replace(target1, replacement1);

fs.writeFileSync(file, code);
