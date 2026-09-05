const fs = require('fs');
let code = fs.readFileSync('src/components/views/DiscoveriesWidget.tsx', 'utf8');

const hookCallRegex = /const \{ discoveries, loading, saveDiscoveries, updateFeedback \} = useDiscoveries\(\);/;
const newHookCall = `const { loading, saveDiscoveries, updateFeedback } = useDiscoveries();
  const [localDiscoveries, setLocalDiscoveries] = useState<any[]>([]);`;
code = code.replace(hookCallRegex, newHookCall);

const saveRegex = /await saveDiscoveries\(obs\.slice\(0, 3\)\);/;
const newSave = `const newDocs = await saveDiscoveries(obs.slice(0, 3));
              if (newDocs) {
                setLocalDiscoveries(newDocs);
              }`;
code = code.replace(saveRegex, newSave);

const mapRegex = /\{discoveries\.map\(d => \(/g;
const newMap = `{localDiscoveries.map(d => (`;
code = code.replace(mapRegex, newMap);

const lengthRegex = /\{discoveries\.length > 0 && \(/g;
const newLength = `{localDiscoveries.length > 0 && (`;
code = code.replace(lengthRegex, newLength);

const updateYesRegex = /onClick=\{\(\) => updateFeedback\(d\.id, 'yes'\)\}/g;
const newUpdateYes = `onClick={async () => {
                      await updateFeedback(d.id, 'yes');
                      setLocalDiscoveries(prev => prev.map(p => p.id === d.id ? { ...p, feedback: 'yes' } : p));
                    }}`;
code = code.replace(updateYesRegex, newUpdateYes);

const updateNoRegex = /onClick=\{\(\) => updateFeedback\(d\.id, 'no'\)\}/g;
const newUpdateNo = `onClick={async () => {
                      await updateFeedback(d.id, 'no');
                      setLocalDiscoveries(prev => prev.map(p => p.id === d.id ? { ...p, feedback: 'no' } : p));
                    }}`;
code = code.replace(updateNoRegex, newUpdateNo);


fs.writeFileSync('src/components/views/DiscoveriesWidget.tsx', code);
console.log("Patched DiscoveriesWidget.tsx");
