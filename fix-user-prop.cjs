const fs = require('fs');

let file = 'src/App.tsx';
let code = fs.readFileSync(file, 'utf8');
code = code.replace(/<JournalApp onLogout=\{\(\) => auth\.signOut\(\)\} \/>/g, '<JournalApp onLogout={() => auth.signOut()} user={user} />');
fs.writeFileSync(file, code);

file = 'src/components/JournalApp.tsx';
code = fs.readFileSync(file, 'utf8');
code = code.replace(/interface JournalAppProps \{ onLogout: \(\) => void; \}/g, 'interface JournalAppProps { onLogout: () => void; user: any; }');
code = code.replace(/export function JournalApp\(\{ onLogout \}: JournalAppProps\) \{/g, 'export function JournalApp({ onLogout, user }: JournalAppProps) {');
code = code.replace(/const \{ entries, saveEntry, removeEntry, clearAllEntries, user \} = useJournalData\(\);/g, 'const { entries, saveEntry, removeEntry, clearAllEntries } = useJournalData();');
fs.writeFileSync(file, code);

file = 'src/hooks/useJournalData.ts';
code = fs.readFileSync(file, 'utf8');
code = code.replace(/user: auth\.currentUser,/g, '');
fs.writeFileSync(file, code);
