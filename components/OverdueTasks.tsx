import React from 'react';

interface OverdueTasksProps {
  count: number;
  onMoveTasks: () => void;
  loading: boolean;
}

const ArrowRightIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
        <path fillRule="evenodd" d="M12.207 2.207a.75.75 0 011.06 0l4.25 4.25a.75.75 0 010 1.06l-4.25 4.25a.75.75 0 01-1.06-1.06L14.94 10 12.207 7.293a.75.75 0 010-1.06z" clipRule="evenodd" />
        <path fillRule="evenodd" d="M2 10a.75.75 0 01.75-.75h12.44l-2.72-2.72a.75.75 0 111.06-1.06l4.25 4.25a.75.75 0 010 1.06l-4.25 4.25a.75.75 0 11-1.06-1.06l2.72-2.72H2.75A.75.75 0 012 10z" clipRule="evenodd" />
    </svg>
);


const OverdueTasks: React.FC<OverdueTasksProps> = ({ count, onMoveTasks, loading }) => {
  return (
    <div className="mb-6 bg-amber-50 border-l-4 border-amber-400 text-amber-900 p-4 rounded-r-lg flex flex-col sm:flex-row justify-between items-center gap-3">
      <div className="text-center sm:text-left">
        <p className="font-bold">You have {count} incomplete task{count > 1 ? 's' : ''} from previous days.</p>
        <p className="text-sm">Move them to today's list to keep track of them.</p>
      </div>
      <button 
        onClick={onMoveTasks}
        disabled={loading}
        className="flex items-center justify-center gap-2 w-full sm:w-auto bg-amber-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-amber-600 transition-colors disabled:bg-amber-300 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
      >
        {loading ? (
            'Moving...'
        ) : (
            <>
                Move {count} task{count > 1 ? 's' : ''} to Today
                <ArrowRightIcon className="w-5 h-5"/>
            </>
        )}
      </button>
    </div>
  );
};

export default OverdueTasks;
