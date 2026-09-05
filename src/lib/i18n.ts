const translations = {
  en: {
    'journal': 'Journal',
    'settings': 'Settings',
    'profile': 'Profile',
    'chat_history': 'Chat History',
    'new_chat': 'New Chat',
    'start_journaling': 'Start Journaling',
    'analytics_insights': 'Analytics & Insights',
    'emotional_landscape': 'Emotional Landscape',
    'notifications': 'Notifications',
    'daily_reminder': 'Daily Reminder',
    'save': 'Save',
    'back': 'Back',
    'sign_out': 'Sign Out',
    'appearance': 'Appearance',
    'light_mode': 'Light Mode',
    'dark_mode': 'Dark Mode',
    'general': 'General',
    'language': 'Language',
    'home': 'Home',
    'history': 'History',
    'clear_history': 'Clear History',
    'search_history': 'Search history...',
    'log_mood': 'Log Mood',
    'write_entry': 'Write a new entry',
    'talk_entry': 'Talk about your day',
    'ask_journal': 'Ask your journal'
  },
  hi: {
    'journal': 'डायरी (Journal)',
    'settings': 'सेटिंग्स (Settings)',
    'profile': 'प्रोफ़ाइल (Profile)',
    'chat_history': 'चैट इतिहास (Chat History)',
    'new_chat': 'नई चैट (New Chat)',
    'start_journaling': 'डायरी लिखना शुरू करें (Start Journaling)',
    'analytics_insights': 'विश्लेषण और अंतर्दृष्टि (Analytics & Insights)',
    'emotional_landscape': 'भावनात्मक परिदृश्य (Emotional Landscape)',
    'notifications': 'सूचनाएं (Notifications)',
    'daily_reminder': 'दैनिक अनुस्मारक (Daily Reminder)',
    'save': 'सहेजें (Save)',
    'back': 'वापस (Back)',
    'sign_out': 'साइन आउट (Sign Out)',
    'appearance': 'दिखावट (Appearance)',
    'light_mode': 'लाइट मोड (Light Mode)',
    'dark_mode': 'डार्क मोड (Dark Mode)',
    'general': 'सामान्य (General)',
    'language': 'भाषा (Language)',
    'home': 'होम (Home)',
    'history': 'इतिहास (History)',
    'clear_history': 'इतिहास साफ़ करें (Clear History)',
    'search_history': 'इतिहास खोजें... (Search history...)',
    'log_mood': 'मनोदशा दर्ज करें (Log Mood)',
    'write_entry': 'नई प्रविष्टि लिखें (Write a new entry)',
    'talk_entry': 'अपने दिन के बारे में बात करें (Talk about your day)',
    'ask_journal': 'अपनी डायरी से पूछें (Ask your journal)'
  }
};

export type Language = 'en' | 'hi';

export function t(key: string, lang: string): string {
  const currentTranslations = translations[lang as Language] || translations.en;
  return currentTranslations[key as keyof typeof translations['en']] || key;
}
