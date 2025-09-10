import React, { useState, useEffect } from 'react';
import { Category, CategoryObject } from '../types';

interface TaskInputProps {
  onAddTask: (text: string, category: Category) => void;
  categories: CategoryObject[];
  onAddNewCategory: () => void;
}

const TaskInput: React.FC<TaskInputProps> = ({ onAddTask, categories, onAddNewCategory }) => {
  const [text, setText] = useState('');
  const [category, setCategory] = useState<Category>(categories[0]?.name || '');

  useEffect(() => {
    // If categories load after initial render, set a default
    if (!category && categories.length > 0) {
      setCategory(categories[0].name);
    }
  }, [categories, category]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddTask(text, category);
    setText('');
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === 'add-new') {
      onAddNewCategory();
    } else {
      setCategory(e.target.value as Category);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 mb-6">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="What's your next task?"
        className="flex-grow bg-slate-100 border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
        aria-label="New task description"
      />
      <select
        value={category}
        onChange={handleCategoryChange}
        className="bg-slate-100 border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
        aria-label="Task category"
      >
        {categories.map(cat => (
          <option key={cat.name} value={cat.name}>{cat.emoji} {cat.name}</option>
        ))}
        <option value="add-new" className="font-semibold text-indigo-600">＋ Add New Category...</option>
      </select>
      <button
        type="submit"
        className="bg-slate-800 text-white font-semibold py-2 px-4 rounded-lg hover:bg-slate-900 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-800 disabled:opacity-50"
        disabled={!text.trim() || !category}
      >
        Add Task
      </button>
    </form>
  );
};

export default TaskInput;
