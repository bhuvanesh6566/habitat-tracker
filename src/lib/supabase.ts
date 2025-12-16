import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Habit {
  id: string;
  name: string;
  color: string;
  icon: string;
  goal_type: 'daily' | 'count';
  goal_value: number;
  created_at: string;
}

export interface HabitCompletion {
  id: string;
  habit_id: string;
  completed_date: string;
  value: number;
  created_at: string;
}
