const fs = require('fs');

let file = 'src/components/views/HomeView.tsx';
let code = fs.readFileSync(file, 'utf8');

// Insert greeting hook logic inside HomeView
const hookLogic = `
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours();
      if (hour >= 5 && hour < 12) {
        setGreeting('Good morning,');
      } else if (hour >= 12 && hour < 17) {
        setGreeting('Good afternoon,');
      } else if (hour >= 17 && hour < 21) {
        setGreeting('Good evening,');
      } else {
        setGreeting('Good night,');
      }
    };
    
    updateGreeting();
    const interval = setInterval(updateGreeting, 60000);
    return () => clearInterval(interval);
  }, []);
`;

code = code.replace(/export function HomeView\([^)]+\)\s*\{/, (match) => {
  return match + hookLogic;
});

code = code.replace(/<p className="text-slate-500 dark:text-slate-400 text-\[15px\]">Good morning,<\/p>/, '<p className="text-slate-500 dark:text-slate-400 text-[15px]">{greeting}</p>');

fs.writeFileSync(file, code);
