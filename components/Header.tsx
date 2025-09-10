
import React from 'react';

interface HeaderProps {
    onGetInspiration: () => void;
    loading: boolean;
    inspiration: string;
}

const SparklesIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
        <path fillRule="evenodd" d="M10.868 2.884c.321.64.321 1.393 0 2.034l-1.39 2.78a1.25 1.25 0 001.09 1.835h2.78a1.25 1.25 0 01.954 2.09l-2.78 5.56a1.25 1.25 0 01-2.09.954l-5.56-2.78a1.25 1.25 0 01-.954-2.09l2.78-5.56a1.25 1.25 0 012.09-.954l5.56 2.78a1.25 1.25 0 001.835-1.09l-2.78-1.39a1.25 1.25 0 010-2.034z" clipRule="evenodd" />
    </svg>
);


const Header: React.FC<HeaderProps> = ({ onGetInspiration, loading, inspiration }) => {
    return (
        <header className="bg-white shadow-sm border-b border-slate-200">
            <div className="container mx-auto px-4 md:px-8 py-4 flex flex-col sm:flex-row justify-between items-center">
                <div className="text-center sm:text-left mb-4 sm:mb-0">
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                        Productivity Tracker
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Organize your day, achieve your goals.
                    </p>
                </div>
                <div className="flex flex-col items-center sm:items-end w-full sm:w-auto">
                    <button
                        onClick={onGetInspiration}
                        disabled={loading}
                        className="flex items-center justify-center gap-2 bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-all disabled:bg-indigo-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Thinking...
                            </>
                        ) : (
                            <>
                                <SparklesIcon className="w-5 h-5" />
                                Get Inspired
                            </>
                        )}
                    </button>
                    {inspiration && (
                        <p className="text-xs text-slate-600 mt-2 text-center sm:text-right italic h-8 flex items-center">
                            "{inspiration}"
                        </p>
                    )}
                     {!inspiration && <div className="h-8"></div>}
                </div>
            </div>
        </header>
    );
};

export default Header;
