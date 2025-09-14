import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const SunIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path d="M10 2a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 2zM10 15a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 15zM10 7a3 3 0 100 6 3 3 0 000-6zM.663 3.955A.75.75 0 011.28 2.67l1.396.547a.75.75 0 01-.288 1.456l-1.396-.547a.75.75 0 01-.617-.129zM17.04 16.045a.75.75 0 01.617.129l1.396.547a.75.75 0 00.288-1.456l-1.396-.547a.75.75 0 00-.617.129zM2.343 13.243a.75.75 0 011.06 0l.989.989a.75.75 0 01-1.06 1.06l-.989-.989a.75.75 0 010-1.06zM16.707 3.293a.75.75 0 011.06 0l.989.989a.75.75 0 01-1.06 1.06l-.989-.989a.75.75 0 010-1.06zM5.05 5.05a.75.75 0 011.06 0l.989.989a.75.75 0 11-1.06 1.06l-.989-.989a.75.75 0 010-1.06zM14.95 14.95a.75.75 0 011.06 0l.989.989a.75.75 0 11-1.06 1.06l-.989-.989a.75.75 0 010-1.06zM10 11a1 1 0 100-2 1 1 0 000 2z" />
  </svg>
);

const MoonIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M7.455 2.004a.75.75 0 01.26.77 7 7 0 009.958 7.967.75.75 0 011.067.853A8.5 8.5 0 116.647 1.921a.75.75 0 01.808.083z" clipRule="evenodd" />
  </svg>
);

const Header: React.FC = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <header className="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700 transition-colors">
            <div className="container mx-auto px-4 md:px-8 py-4 flex justify-between items-center">
                <div className="text-left">
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100">
                        Productivity Tracker
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Organize your day, achieve your goals.
                    </p>
                </div>
                <button
                    onClick={toggleTheme}
                    className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                >
                    {theme === 'light' ? (
                        <MoonIcon className="w-5 h-5" />
                    ) : (
                        <SunIcon className="w-5 h-5" />
                    )}
                </button>
            </div>
        </header>
    );
};

export default Header;
