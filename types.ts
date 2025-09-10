export type Category = string;

export interface CategoryVisuals {
  base: string;
  text: string;
  border: string;
  fill: string;
}

export interface CategoryObject {
  id: number;
  name: Category;
  emoji: string;
  visuals: CategoryVisuals;
}

export const DEFAULT_CATEGORIES: Omit<CategoryObject, 'id'>[] = [
  { name: 'Work', emoji: '💼', visuals: { base: 'bg-sky-100', text: 'text-sky-800', border: 'border-sky-200', fill: '#0ea5e9' } },
  { name: 'Personal', emoji: '🏡', visuals: { base: 'bg-emerald-100', text: 'text-emerald-800', border: 'border-emerald-200', fill: '#10b981' } },
  { name: 'Learning', emoji: '📚', visuals: { base: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-200', fill: '#8b5cf6' } },
  { name: 'Health', emoji: '❤️‍🩹', visuals: { base: 'bg-rose-100', text: 'text-rose-800', border: 'border-rose-200', fill: '#f43f5e' } },
  { name: 'Social', emoji: '🎉', visuals: { base: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-200', fill: '#f59e0b' } },
];

export const CUSTOM_CATEGORY_PALETTE: CategoryVisuals[] = [
    { base: 'bg-teal-100', text: 'text-teal-800', border: 'border-teal-200', fill: '#14b8a6' },
    { base: 'bg-pink-100', text: 'text-pink-800', border: 'border-pink-200', fill: '#ec4899' },
    { base: 'bg-indigo-100', text: 'text-indigo-800', border: 'border-indigo-200', fill: '#6366f1' },
    { base: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-200', fill: '#6b7280' },
];


export interface Task {
  id: number;
  text: string;
  completed: boolean;
  category: Category;
  timeSpent: number; // in seconds
  date: string; // YYYY-MM-DD
  completed_at: string | null; // YYYY-MM-DD
  // Client-side only properties
  startTime?: number; // timestamp when timer started
  timerIsRunning?: boolean;
}

export interface ProductivityData {
  total: number;
  completed: number;
  pending: number;
  percentage: number;
}

export interface CategoryData {
  name: Category;
  time: number; // in minutes
}
