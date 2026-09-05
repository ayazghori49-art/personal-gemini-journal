const fs = require('fs');
let code = fs.readFileSync('src/components/JournalApp.tsx', 'utf8');

if (!code.includes('const [refreshCounter, setRefreshCounter] = useState(0);')) {
  const stateRegex = /const \[currentTab, setCurrentTab\] = useState\('home'\);/;
  code = code.replace(stateRegex, "const [currentTab, setCurrentTab] = useState('home');\n  const [refreshCounter, setRefreshCounter] = useState(0);");
}

code = code.replace(/alert\('Chat deleted successfully'\);/g, "alert('Chat deleted successfully');\n        setRefreshCounter(c => c + 1);");

fs.writeFileSync('src/components/JournalApp.tsx', code);
console.log("Patched force render");
