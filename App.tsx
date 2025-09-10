import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Task, ProductivityData, Category, CategoryData, CategoryObject, DEFAULT_CATEGORIES, CUSTOM_CATEGORY_PALETTE } from './types';
import Header from './components/Header';
import TaskInput from './components/TaskInput';
import TaskList from './components/TaskList';
import ProductivityDashboard from './components/ProductivityDashboard';
import { getInspiration, summarizeDay } from './services/geminiService';

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const savedTasks = localStorage.getItem('tasks');
      return savedTasks ? JSON.parse(savedTasks) : [];
    } catch (error) {
      console.error("Failed to parse tasks from localStorage", error);
      return [];
    }
  });

  const [categories, setCategories] = useState<CategoryObject[]>(() => {
    try {
      const savedCategories = localStorage.getItem('categories');
      return savedCategories ? JSON.parse(savedCategories) : DEFAULT_CATEGORIES;
    } catch (error) {
      console.error("Failed to parse categories from localStorage", error);
      return DEFAULT_CATEGORIES;
    }
  });

  const [loadingInspiration, setLoadingInspiration] = useState(false);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [inspiration, setInspiration] = useState('');
  const [summary, setSummary] = useState('');
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryEmoji, setNewCategoryEmoji] = useState('');
  const [categoryError, setCategoryError] = useState('');

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('categories', JSON.stringify(categories));
  }, [categories]);

  const addTask = useCallback((text: string, category: Category) => {
    if (text.trim() === '' || category.trim() === '') return;
    const newTask: Task = {
      id: crypto.randomUUID(),
      text,
      completed: false,
      category,
      timeSpent: 0,
      timerIsRunning: false,
    };
    setTasks(prevTasks => [...prevTasks, newTask]);
  }, []);

  const addCategory = useCallback(() => {
    if (newCategoryName.trim() === '') {
      setCategoryError('Category name cannot be empty.');
      return;
    }
    if (categories.some(c => c.name.toLowerCase() === newCategoryName.trim().toLowerCase())) {
      setCategoryError('This category name already exists.');
      return;
    }

    const defaultCategoryNames = DEFAULT_CATEGORIES.map(dc => dc.name);
    const customCategories = categories.filter(c => !defaultCategoryNames.includes(c.name));
    const nextVisual = CUSTOM_CATEGORY_PALETTE[customCategories.length % CUSTOM_CATEGORY_PALETTE.length];
    
    const newCategory: CategoryObject = {
      name: newCategoryName.trim(),
      emoji: newCategoryEmoji || '✨',
      visuals: nextVisual,
    };

    setCategories(prev => [...prev, newCategory]);
    setIsAddCategoryModalOpen(false);
    setNewCategoryName('');
    setNewCategoryEmoji('');
    setCategoryError('');
  }, [newCategoryName, newCategoryEmoji, categories]);

  const toggleTask = useCallback((id: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
  }, []);
  
  const handleToggleTimer = useCallback((taskId: string) => {
    const now = Date.now();
    setTasks(currentTasks => {
        const newTasks = [...currentTasks];
        const currentRunningTaskIndex = newTasks.findIndex(t => t.timerIsRunning);
        const targetTaskIndex = newTasks.findIndex(t => t.id === taskId);

        if (targetTaskIndex === -1) return newTasks;

        // Stop the currently running task if there is one
        if (currentRunningTaskIndex !== -1) {
            const runningTask = newTasks[currentRunningTaskIndex];
            const elapsed = Math.round((now - (runningTask.startTime || now)) / 1000);
            newTasks[currentRunningTaskIndex] = {
                ...runningTask,
                timeSpent: runningTask.timeSpent + elapsed,
                timerIsRunning: false,
                startTime: undefined,
            };
        }

        // If the target task was not the one running, start it.
        if (currentRunningTaskIndex !== targetTaskIndex) {
            newTasks[targetTaskIndex] = {
                ...newTasks[targetTaskIndex],
                timerIsRunning: true,
                startTime: now,
            };
        }
        
        return newTasks;
    });
  }, []);

  const clearCompleted = useCallback(() => {
    setTasks(prevTasks => prevTasks.filter(task => !task.completed));
  }, []);

  const productivityData: ProductivityData = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const pending = total - completed;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, pending, percentage };
  }, [tasks]);

  const categoryData: CategoryData[] = useMemo(() => {
    const dataMap = new Map<Category, number>();
    categories.forEach(cat => dataMap.set(cat.name, 0));

    tasks.forEach(task => {
        const timeInMinutes = task.timeSpent / 60;
        dataMap.set(task.category, (dataMap.get(task.category) || 0) + timeInMinutes);
    });

    return Array.from(dataMap.entries()).map(([name, time]) => ({
        name,
        time: parseFloat(time.toFixed(2)),
    })).filter(d => d.time > 0);
  }, [tasks, categories]);
  
  const handleGetInspiration = async () => {
    setLoadingInspiration(true);
    setInspiration('');
    try {
      const quote = await getInspiration();
      setInspiration(quote);
    } catch (error) {
      console.error("Failed to get inspiration:", error);
      setInspiration("Could not fetch an inspiring quote. Try again later.");
    } finally {
      setLoadingInspiration(false);
    }
  };

  const handleSummarizeDay = async () => {
    const completedOrTrackedTasks = tasks.filter(t => t.completed || t.timeSpent > 0);
    if (completedOrTrackedTasks.length === 0) {
      setSummary("You haven't completed or tracked any tasks yet. Finish or track a task to get a summary!");
      setIsSummaryModalOpen(true);
      return;
    }
    
    setLoadingSummary(true);
    setIsSummaryModalOpen(true);
    setSummary('');
    try {
      const result = await summarizeDay(tasks);
      setSummary(result);
    } catch (error) {
      console.error("Failed to get summary:", error);
      setSummary("Could not generate a summary of your day. Please try again.");
    } finally {
      setLoadingSummary(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Header 
        onGetInspiration={handleGetInspiration} 
        loading={loadingInspiration} 
        inspiration={inspiration}
      />
      <main className="container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">My Tasks</h2>
            <TaskInput 
              onAddTask={addTask} 
              categories={categories}
              onAddNewCategory={() => setIsAddCategoryModalOpen(true)}
            />
            <TaskList tasks={tasks} categories={categories} onToggleTask={toggleTask} onDeleteTask={deleteTask} onToggleTimer={handleToggleTimer} />
             {tasks.some(t => t.completed) && (
              <div className="mt-4 text-right">
                <button
                  onClick={clearCompleted}
                  className="text-sm font-medium text-slate-500 hover:text-red-600 transition-colors"
                >
                  Clear Completed Tasks
                </button>
              </div>
            )}
          </div>
          <div className="lg:col-span-1">
            <ProductivityDashboard 
              data={productivityData}
              categoryData={categoryData}
              categories={categories}
              onSummarize={handleSummarizeDay}
              loading={loadingSummary}
            />
          </div>
        </div>
      </main>

      {/* Summary Modal */}
      {isSummaryModalOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setIsSummaryModalOpen(false)}
        >
          <div 
            className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="text-2xl font-bold text-slate-800 mb-4">Your Daily Summary</h3>
            {loadingSummary ? (
              <div className="flex items-center justify-center h-24">
                 <svg className="animate-spin h-8 w-8 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            ) : (
              <p className="text-slate-600 whitespace-pre-wrap">{summary}</p>
            )}
            <button
              onClick={() => setIsSummaryModalOpen(false)}
              className="mt-6 w-full bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Add Category Modal */}
      {isAddCategoryModalOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setIsAddCategoryModalOpen(false)}
        >
          <div 
            className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="text-2xl font-bold text-slate-800 mb-4">Add New Category</h3>
            <div className="space-y-4">
               <div>
                  <label htmlFor="category-name" className="block text-sm font-medium text-slate-700 mb-1">Category Name</label>
                  <input
                    type="text"
                    id="category-name"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="e.g., Fitness"
                    className="w-full bg-slate-100 border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
               </div>
               <div>
                  <label htmlFor="category-emoji" className="block text-sm font-medium text-slate-700 mb-1">Emoji (optional)</label>
                  <input
                    type="text"
                    id="category-emoji"
                    value={newCategoryEmoji}
                    onChange={(e) => setNewCategoryEmoji(e.target.value)}
                    placeholder="e.g., 💪"
                    maxLength={2}
                    className="w-full bg-slate-100 border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
               </div>
               {categoryError && <p className="text-sm text-red-600">{categoryError}</p>}
            </div>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setIsAddCategoryModalOpen(false)}
                className="w-full bg-slate-200 text-slate-800 font-semibold py-2 px-4 rounded-lg hover:bg-slate-300 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400"
              >
                Cancel
              </button>
              <button
                onClick={addCategory}
                className="w-full bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Add Category
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;