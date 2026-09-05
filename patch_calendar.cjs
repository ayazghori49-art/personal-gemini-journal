const fs = require('fs');
let code = fs.readFileSync('src/components/views/EmotionalLandscapeView.tsx', 'utf8');

// 1. Fix the createdAt undefined bug in sortedEntries
code = code.replace(
  `return [...entries].sort((a, b) => b.createdAt - a.createdAt);`,
  `return [...entries].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));`
);

// 2. Filter calendarDays based on activeTab
const newCalendarLogic = `
  const calendarDays = Array.from({ length: 42 }).map((_, i) => {
    const day = i - startOffset + 1;
    if (day > 0 && day <= daysInMonth) {
      return new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    }
    return null;
  });

  const displayDays = useMemo(() => {
    if (activeTab === 'Monthly') return calendarDays;
    
    // For Weekly or Today, find the week containing selectedDate or currentDate
    const targetDate = selectedDate || currentDate;
    const targetIdx = calendarDays.findIndex(d => d && d.toDateString() === targetDate.toDateString());
    
    if (targetIdx !== -1) {
      const weekStart = Math.floor(targetIdx / 7) * 7;
      return calendarDays.slice(weekStart, weekStart + 7);
    }
    
    // Fallback if not found in current month page
    return calendarDays.slice(0, 7);
  }, [calendarDays, activeTab, selectedDate, currentDate]);
`;

code = code.replace(
  `  const calendarDays = Array.from({ length: 42 }).map((_, i) => {
    const day = i - startOffset + 1;
    if (day > 0 && day <= daysInMonth) {
      return new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    }
    return null;
  });`,
  newCalendarLogic
);

// 3. Change {calendarDays.map to {displayDays.map
code = code.replace(`{calendarDays.map((date, i) => {`, `{displayDays.map((date, i) => {`);

// 4. Make Today button set the date
code = code.replace(
  `onClick={() => setActiveTab(tab)}`,
  `onClick={() => {
                setActiveTab(tab);
                if (tab === 'Today') {
                  const now = new Date();
                  setCurrentDate(now);
                  setSelectedDate(now);
                }
              }}`
);

fs.writeFileSync('src/components/views/EmotionalLandscapeView.tsx', code);
