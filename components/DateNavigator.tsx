import React from 'react';

interface DateNavigatorProps {
  currentDate: Date;
  onDateChange: (newDate: Date) => void;
}

const ChevronLeftIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
  </svg>
);

const ChevronRightIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
  </svg>
);

const DateNavigator: React.FC<DateNavigatorProps> = ({ currentDate, onDateChange }) => {
  const changeDate = (days: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + days);
    onDateChange(newDate);
  };
  
  const goToToday = () => {
    onDateChange(new Date());
  };

  const isToday = new Date().toDateString() === currentDate.toDateString();

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(currentDate);

  return (
    <div className="mb-6 p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row justify-between items-center gap-4 transition-colors">
      <div className="text-center sm:text-left">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">{isToday ? 'Today' : formattedDate.split(',')[0]}</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">{isToday ? formattedDate : `Viewing tasks for ${formattedDate}`}</p>
      </div>
      <div className="flex items-center gap-2">
        <button
            onClick={() => changeDate(-1)}
            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            aria-label="Previous day"
        >
            <ChevronLeftIcon className="w-5 h-5 text-slate-600 dark:text-slate-300" />
        </button>
        {!isToday && (
            <button
                onClick={goToToday}
                className="px-4 py-2 text-sm font-semibold rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            >
                Today
            </button>
        )}
        <button
            onClick={() => changeDate(1)}
            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            aria-label="Next day"
        >
            <ChevronRightIcon className="w-5 h-5 text-slate-600 dark:text-slate-300" />
        </button>
      </div>
    </div>
  );
};

export default DateNavigator;
