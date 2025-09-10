# Supabase Productivity Tracker

A daily productivity tracker to manage tasks day-by-day and visualize progress. This application uses Supabase for backend data storage, allowing your tasks to be available across devices.

## Deploying with Vercel and Supabase

Follow these instructions to deploy the application using Vercel.

### Prerequisites

- A [Vercel](https://vercel.com/) account.
- A [Supabase](https://supabase.com/) account.

### Instructions

1.  **Fork this repository:** Create a fork of this project on your GitHub account.

2.  **Create a Supabase Project:**
    *   Go to your Supabase dashboard and create a new project.
    *   Once the project is created, navigate to the **SQL Editor**.
    *   Click on **"+ New query"** and paste the entire content of the schema script below into the editor.
    *   Click **"RUN"** to create the necessary tables, policies, and default data.

3.  **Get Supabase Credentials:**
    *   In your Supabase project, go to **Project Settings > API**.
    *   Find your **Project URL** and your **Project API Keys** (you will need the `anon` `public` key).

4.  **Deploy on Vercel:**
    *   Go to your Vercel dashboard and create a new project.
    *   Import the repository you forked.
    *   Before deploying, go to the project's **Settings > Environment Variables**.
    *   Add the following two variables. **It's crucial to use these exact names, including the `VITE_` prefix**, so they can be accessed by the application in the browser.
        *   `VITE_SUPABASE_URL`: Your Supabase Project URL.
        *   `VITE_SUPABASE_ANON_KEY`: Your Supabase `anon` (public) key.
    *   Deploy the project. Vercel will automatically build and deploy your application.

5.  **Access the application:** Once deployed, Vercel will provide you with a URL to access your live application.

### Supabase SQL Schema

Use this script in the Supabase SQL Editor to set up your database.

```sql
-- Categories Table
CREATE TABLE categories (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  name TEXT NOT NULL UNIQUE,
  emoji TEXT NOT NULL,
  visuals JSONB NOT NULL
);

-- Tasks Table
CREATE TABLE tasks (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  text TEXT NOT NULL,
  completed BOOLEAN DEFAULT false NOT NULL,
  category TEXT,
  time_spent INT DEFAULT 0 NOT NULL, -- in seconds
  date DATE NOT NULL,
  completed_at DATE,
  CONSTRAINT tasks_category_fkey FOREIGN KEY (category) REFERENCES categories (name) ON UPDATE CASCADE ON DELETE SET NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Create policies for anonymous access.
-- This allows anyone to read/write data. For a production app with user accounts,
-- you would create more restrictive policies based on authenticated user IDs.
CREATE POLICY "Public access for all" ON categories FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public access for all" ON tasks FOR ALL
  USING (true)
  WITH CHECK (true);

-- Insert default categories
INSERT INTO categories (name, emoji, visuals) VALUES
('Work', '💼', '{"base": "bg-sky-100", "text": "text-sky-800", "border": "border-sky-200", "fill": "#0ea5e9"}'),
('Personal', '🏡', '{"base": "bg-emerald-100", "text": "text-emerald-800", "border": "border-emerald-200", "fill": "#10b981"}'),
('Learning', '📚', '{"base": "bg-purple-100", "text": "text-purple-800", "border": "border-purple-200", "fill": "#8b5cf6"}'),
('Health', '❤️‍🩹', '{"base": "bg-rose-100", "text": "text-rose-800", "border": "border-rose-200", "fill": "#f43f5e"}'),
('Social', '🎉', '{"base": "bg-amber-100", "text": "text-amber-800", "border": "border-amber-200", "fill": "#f59e0b"}');
```

### A Note on Data

This application uses your Supabase database to save your tasks and categories. This allows your data to persist and be accessible from any device where you open the app.