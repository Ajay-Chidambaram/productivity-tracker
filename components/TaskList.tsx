import React from 'react';
import { Task, CategoryObject } from '../types';
import TaskItem from './TaskItem';

interface TaskListProps {
  tasks: Task[];
  categories: CategoryObject[];
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onToggleTimer: (id: string) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, categories, onToggleTask, onDeleteTask, onToggleTimer }) => {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-16 px-4 bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
        <h3 className="font-semibold text-slate-700 text-lg">Your task list is empty!</h3>
        <p className="text-sm text-slate-500 mt-1">Add a new task above to get started.</p>
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          categories={categories}
          onToggleTask={onToggleTask}
          onDeleteTask={onDeleteTask}
          onToggleTimer={onToggleTimer}
        />
      ))}
    </ul>
  );
};

export default TaskList;