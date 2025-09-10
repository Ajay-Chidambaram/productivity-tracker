import { createClient } from '@supabase/supabase-js';
import { Task, CategoryObject, CategoryVisuals, CUSTOM_CATEGORY_PALETTE, DEFAULT_CATEGORIES } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase environment variables (VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY) are not set. Please check your Vercel project settings. The application cannot start without them.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// --- Data Mapping ---
const fromDBTask = (dbTask: any): Task => ({
    id: dbTask.id,
    text: dbTask.text,
    completed: dbTask.completed,
    category: dbTask.category,
    timeSpent: dbTask.time_spent,
    date: dbTask.date,
    completed_at: dbTask.completed_at
});

const fromDBCategory = (dbCategory: any): CategoryObject => ({
    id: dbCategory.id,
    name: dbCategory.name,
    emoji: dbCategory.emoji,
    visuals: dbCategory.visuals as CategoryVisuals,
});

// --- Category Functions ---
export async function getCategories(): Promise<CategoryObject[]> {
    const { data, error } = await supabase.from('categories').select('*').order('id');
    if (error) {
        console.error('Error fetching categories:', error);
        return [];
    }
    return data.map(fromDBCategory);
}

export async function addCategory(name: string, emoji: string): Promise<CategoryObject | null> {
    // Determine the visuals for the new category
    const defaultCategoryNames = DEFAULT_CATEGORIES.map(dc => dc.name);
    const { data: existingCategories, error: countError } = await supabase
        .from('categories')
        .select('name', { count: 'exact' })
        .not('name', 'in', `(${defaultCategoryNames.map(n => `'${n}'`).join(',')})`);
    
    if (countError) {
        console.error('Error counting custom categories:', countError);
        return null;
    }

    const customCategoryCount = existingCategories?.length || 0;
    const visuals = CUSTOM_CATEGORY_PALETTE[customCategoryCount % CUSTOM_CATEGORY_PALETTE.length];
    
    const { data, error } = await supabase
        .from('categories')
        .insert([{ name, emoji, visuals }])
        .select()
        .single();
    
    if (error) {
        console.error('Error adding category:', error);
        return null;
    }
    return fromDBCategory(data);
}

// --- Task Functions ---
export async function getTasksForDate(date: string): Promise<Task[]> {
    const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('date', date)
        .order('created_at');
    
    if (error) {
        console.error('Error fetching tasks for date:', error);
        return [];
    }
    return data.map(fromDBTask);
}

export async function getIncompleteTasksBeforeDate(date: string): Promise<Task[]> {
    const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .lt('date', date)
        .eq('completed', false)
        .order('date');
    
    if (error) {
        console.error('Error fetching incomplete tasks:', error);
        return [];
    }
    return data.map(fromDBTask);
}

export async function addTask(task: { text: string; category: string; date: string }): Promise<Task | null> {
    const { data, error } = await supabase
        .from('tasks')
        .insert([{ ...task, time_spent: 0 }])
        .select()
        .single();
    
    if (error) {
        console.error('Error adding task:', error);
        return null;
    }
    return fromDBTask(data);
}

export async function updateTask(id: number, updates: object): Promise<Task | null> {
    const { data, error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
        
    if (error) {
        console.error('Error updating task:', error);
        return null;
    }
    return fromDBTask(data);
}

export async function deleteTask(id: number): Promise<void> {
    const { error } = await supabase.from('tasks').delete().eq('id', id);
    if (error) {
        console.error('Error deleting task:', error);
        throw error;
    }
}

export async function deleteTasks(ids: number[]): Promise<void> {
    const { error } = await supabase.from('tasks').delete().in('id', ids);
    if (error) {
        console.error('Error deleting tasks:', error);
        throw error;
    }
}

export async function moveTasks(ids: number[], newDate: string): Promise<Task[]> {
    const { data, error } = await supabase
        .from('tasks')
        .update({ date: newDate })
        .in('id', ids)
        .select();
        
    if (error) {
        console.error('Error moving tasks:', error);
        return [];
    }
    return data.map(fromDBTask);
}