import React, { useState, useEffect } from 'react';
import { Task, CategoryObject } from '../types';

interface TaskItemProps {
  task: Task;
  categories: CategoryObject[];
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onToggleTimer: (id: string) => void;
}

const TrashIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.58.22-2.365.468a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" />
  </svg>
);

const PlayIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
  </svg>
);

const PauseIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path d="M5.75 3a.75.75 0 00-.75.75v12.5c0 .414.336.75.75.75h1.5a.75.75 0 00.75-.75V3.75A.75.75 0 007.25 3h-1.5zM12.75 3a.75.75 0 00-.75.75v12.5c0 .414.336.75.75.75h1.5a.75.75 0 00.75-.75V3.75a.75.75 0 00-.75-.75h-1.5z" />
  </svg>
);

const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);
    const parts = [];
    if (hours > 0) parts.push(String(hours).padStart(2, '0'));
    parts.push(String(minutes).padStart(2, '0'));
    parts.push(String(seconds).padStart(2, '0'));
    return parts.join(':');
};

const TaskItem: React.FC<TaskItemProps> = ({ task, categories, onToggleTask, onDeleteTask, onToggleTimer }) => {
  const [displayTime, setDisplayTime] = useState(task.timeSpent);

  useEffect(() => {
    let intervalId: number | undefined;
    if (task.timerIsRunning && task.startTime) {
      const updateDisplayTime = () => {
        const elapsed = Math.round((Date.now() - (task.startTime as number)) / 1000);
        setDisplayTime(task.timeSpent + elapsed);
      }
      updateDisplayTime();
      intervalId = window.setInterval(updateDisplayTime, 1000);
    } else {
      setDisplayTime(task.timeSpent);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [task.timerIsRunning, task.startTime, task.timeSpent]);

  const category = categories.find(c => c.name === task.category);
  const visuals = category?.visuals || { base: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-200' };

  return (
    <li className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors group gap-3">
      <div className="flex items-center gap-3 flex-grow w-full sm:w-auto">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggleTask(task.id)}
          className="h-5 w-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer flex-shrink-0 mt-1 sm:mt-0"
          aria-labelledby={`task-text-${task.id}`}
        />
        <div className="flex-grow flex items-baseline flex-wrap gap-x-2 gap-y-1">
           <span id={`task-text-${task.id}`} className={`text-slate-700 ${task.completed ? 'line-through text-slate-400' : ''}`}>
             {task.text}
           </span>
           {category && (
            <div className={`text-xs font-semibold inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border ${visuals.base} ${visuals.text} ${visuals.border}`}>
              {category.emoji}
              <span>{task.category}</span>
            </div>
           )}
        </div>
      </div>
      <div className="flex items-center gap-4 w-full sm:w-auto justify-end pl-8 sm:pl-0">
        <span className="font-mono text-sm text-slate-500 w-24 text-right">{formatTime(displayTime)}</span>
        <button
          onClick={() => onToggleTimer(task.id)}
          disabled={task.completed}
          className="text-slate-500 hover:text-indigo-600 disabled:text-slate-300 disabled:cursor-not-allowed"
          aria-label={task.timerIsRunning ? `Pause timer for ${task.text}` : `Start timer for ${task.text}`}
        >
          {task.timerIsRunning ? <PauseIcon className="w-6 h-6"/> : <PlayIcon className="w-6 h-6"/>}
        </button>
        <button
          onClick={() => onDeleteTask(task.id)}
          className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label={`Delete task: ${task.text}`}
        >
          <TrashIcon className="w-5 h-5" />
        </button>
      </div>
    </li>
  );
};

export default TaskItem;
