import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Task, CategoryObject } from './types';
import Header from './components/Header';
import TaskInput from './components/TaskInput';
import TaskList from './components/TaskList';
import ProductivityDashboard from './components/ProductivityDashboard';
import DateNavigator from './components/DateNavigator';
import OverdueTasks from './components/OverdueTasks';
import * as supabaseService from './services/supabaseService';
import { formatDate } from './utils';

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [overdueTasks, setOverdueTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<CategoryObject[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [isLoading, setIsLoading] = useState(true);
  const [isMovingTasks, setIsMovingTasks] = useState(false);
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryEmoji, setNewCategoryEmoji] = useState('');
  const [categoryError, setCategoryError] = useState('');
  
  const dateString = useMemo(() => formatDate(selectedDate), [selectedDate]);

  useEffect(() => {
    const fetchAllData = async () => {
      setIsLoading(true);
      
      const [fetchedCategories, fetchedTasks, fetchedOverdueTasks] = await Promise.all([
          supabaseService.getCategories(),
          supabaseService.getTasksForDate(dateString),
          supabaseService.getIncompleteTasksBeforeDate(dateString)
      ]);

      setCategories(fetchedCategories);
      setTasks(fetchedTasks.map(t => ({...t, timerIsRunning: false})));
      setOverdueTasks(fetchedOverdueTasks.map(t => ({...t, timerIsRunning: false})));
      setIsLoading(false);
    };

    fetchAllData();
  }, [dateString]);

  const addTask = useCallback(async (text: string, category: string) => {
    if (text.trim() === '' || category.trim() === '') return;
    try {
      const newTask = await supabaseService.addTask({ text, category, date: dateString });
      if (newTask) {
        setTasks(prevTasks => [...prevTasks, {...newTask, timerIsRunning: false}]);
      }
    } catch (error) {
      console.error("Failed to add task:", error);
    }
  }, [dateString]);
  
  const addCategory = useCallback(async () => {
    if (newCategoryName.trim() === '') {
      setCategoryError('Category name cannot be empty.');
      return;
    }
    if (categories.some(c => c.name.toLowerCase() === newCategoryName.trim().toLowerCase())) {
      setCategoryError('This category name already exists.');
      return;
    }

    try {
      const newCategory = await supabaseService.addCategory(newCategoryName.trim(), newCategoryEmoji || '✨');
      if (newCategory) {
        setCategories(prev => [...prev, newCategory]);
        setIsAddCategoryModalOpen(false);
        setNewCategoryName('');
        setNewCategoryEmoji('');
        setCategoryError('');
      }
    } catch (error) {
        console.error("Failed to add category:", error);
        setCategoryError('Could not add category. Please try again.');
    }
  }, [newCategoryName, newCategoryEmoji, categories]);

  const toggleTask = useCallback(async (id: number) => {
    const taskToToggle = tasks.find(task => task.id === id);
    if (!taskToToggle) return;
    
    const isCompleted = !taskToToggle.completed;
    const completed_at = isCompleted ? dateString : null;

    try {
      const updatedTask = await supabaseService.updateTask(id, { completed: isCompleted, completed_at });
      if(updatedTask) {
         setTasks(prevTasks =>
            prevTasks.map(task =>
              task.id === id ? { ...task, completed: isCompleted, completed_at } : task
            )
          );
      }
    } catch (error) {
      console.error("Failed to toggle task:", error);
    }
  }, [tasks, dateString]);

  const deleteTask = useCallback(async (id: number) => {
    try {
        await supabaseService.deleteTask(id);
        setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
    } catch (error) {
        console.error("Failed to delete task:", error);
    }
  }, []);
  
  const handleToggleTimer = useCallback(async (taskId: number) => {
    const now = Date.now();
    let taskToUpdate: Task | undefined;
    let newTimeSpent: number | undefined;

    const newTasks = tasks.map(task => {
        if (task.timerIsRunning && task.id !== taskId) { // Stop currently running task
            const elapsed = Math.round((now - (task.startTime || now)) / 1000);
            newTimeSpent = task.timeSpent + elapsed;
            taskToUpdate = { ...task, timeSpent: newTimeSpent };
            return { ...task, timeSpent: newTimeSpent, timerIsRunning: false, startTime: undefined };
        }
        if (task.id === taskId) { // Toggle target task
            if (task.timerIsRunning) { // Stop it
                const elapsed = Math.round((now - (task.startTime || now)) / 1000);
                newTimeSpent = task.timeSpent + elapsed;
                taskToUpdate = { ...task, timeSpent: newTimeSpent };
                return { ...task, timeSpent: newTimeSpent, timerIsRunning: false, startTime: undefined };
            } else { // Start it
                return { ...task, timerIsRunning: true, startTime: now };
            }
        }
        return task;
    });

    setTasks(newTasks);

    if (taskToUpdate && newTimeSpent !== undefined) {
        try {
            await supabaseService.updateTask(taskToUpdate.id, { time_spent: newTimeSpent });
        } catch (error) {
            console.error("Failed to update time spent:", error);
            // Optionally revert UI state on failure
        }
    }
  }, [tasks]);

  const clearCompleted = useCallback(async () => {
    const completedIds = tasks.filter(task => task.completed).map(task => task.id);
    if(completedIds.length === 0) return;

    try {
        await supabaseService.deleteTasks(completedIds);
        setTasks(prevTasks => prevTasks.filter(task => !task.completed));
    } catch (error) {
        console.error("Failed to clear completed tasks:", error);
    }
  }, [tasks]);
  
  const moveOverdueTasks = useCallback(async () => {
      setIsMovingTasks(true);
      const taskIds = overdueTasks.map(t => t.id);
      try {
        const movedTasks = await supabaseService.moveTasks(taskIds, dateString);
        setTasks(prev => [...prev, ...movedTasks.map(t => ({...t, timerIsRunning: false}))]);
        setOverdueTasks([]);
      } catch (error) {
        console.error("Failed to move tasks:", error);
      } finally {
        setIsMovingTasks(false);
      }
  }, [overdueTasks, dateString]);

  const productivityData = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const pending = total - completed;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, pending, percentage };
  }, [tasks]);

  const categoryData = useMemo(() => {
    const dataMap = new Map<string, number>();
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

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <DateNavigator currentDate={selectedDate} onDateChange={setSelectedDate} />
        {overdueTasks.length > 0 && (
            <OverdueTasks count={overdueTasks.length} onMoveTasks={moveOverdueTasks} loading={isMovingTasks} />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Tasks for Today</h2>
            <TaskInput 
              onAddTask={addTask} 
              categories={categories}
              onAddNewCategory={() => setIsAddCategoryModalOpen(true)}
            />
            {isLoading ? (
                 <div className="text-center py-16"><p className="text-slate-500">Loading tasks...</p></div>
            ) : (
                <TaskList tasks={tasks} categories={categories} onToggleTask={toggleTask} onDeleteTask={deleteTask} onToggleTimer={handleToggleTimer} />
            )}
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
            />
          </div>
        </div>
      </main>

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
