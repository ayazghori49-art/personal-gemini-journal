import { Sparkles, ArrowRight } from 'lucide-react';
import { auth } from '../lib/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

export function Login() {
  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent relative overflow-hidden px-4">
      {/* Decorative Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-300/30 dark:bg-violet-900/30 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-pink-300/20 dark:bg-pink-900/20 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="premium-card max-w-md w-full p-10 flex flex-col items-center relative z-10 text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-violet-100 to-violet-50 dark:from-violet-900/40 dark:to-violet-800/20 rounded-3xl flex items-center justify-center mb-8 shadow-inner border border-violet-100 dark:border-violet-800/50">
          <Sparkles className="w-10 h-10 text-violet-600 dark:text-violet-400" />
        </div>
        
        <h1 className="text-3xl font-serif font-semibold text-slate-900 dark:text-slate-100 mb-4 tracking-tight">
          Personal Gemini Journal
        </h1>
        
        <p className="text-slate-500 dark:text-slate-400 mb-10 leading-relaxed max-w-[280px]">
          A private, AI-guided space for reflection, clarity, and personal growth.
        </p>

        <button 
          onClick={handleLogin}
          className="w-full flex items-center justify-center gap-3 bg-white dark:bg-[#1A1A1A] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 py-3.5 px-6 rounded-2xl font-medium shadow-sm hover:shadow-md hover:bg-slate-50 dark:hover:bg-slate-900 transition-all group"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continue with Google
          <ArrowRight className="w-4 h-4 ml-auto text-slate-300 dark:text-slate-600 group-hover:text-slate-900 dark:group-hover:text-slate-100 transition-colors" />
        </button>

        <p className="text-[13px] text-slate-400 dark:text-slate-500 mt-8 max-w-[260px] leading-relaxed">
          Your journals are private and securely stored. By continuing, you agree to our Privacy Policy.
        </p>
      </div>
    </div>
  );
}
