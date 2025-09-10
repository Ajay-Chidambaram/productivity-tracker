import React from 'react';

const Header: React.FC = () => {
    return (
        <header className="bg-white shadow-sm border-b border-slate-200">
            <div className="container mx-auto px-4 md:px-8 py-4 flex justify-between items-center">
                <div className="text-left">
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                        Productivity Tracker
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Organize your day, achieve your goals.
                    </p>
                </div>
            </div>
        </header>
    );
};

export default Header;
