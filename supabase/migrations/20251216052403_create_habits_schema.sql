/*
  # Habit Tracker Schema

  1. New Tables
    - `habits`
      - `id` (uuid, primary key)
      - `name` (text) - habit name
      - `color` (text) - color for UI display
      - `icon` (text) - icon identifier
      - `goal_type` (text) - 'daily' or 'count'
      - `goal_value` (integer) - target value (1 for daily check, or custom count)
      - `created_at` (timestamptz)
    
    - `habit_completions`
      - `id` (uuid, primary key)
      - `habit_id` (uuid, foreign key to habits)
      - `completed_date` (date) - date of completion
      - `value` (integer) - number of completions (1 for check, or count)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Public access for demo purposes (single-user mode)
    
  3. Notes
    - Each habit can be completed once per day
    - Streaks are calculated based on consecutive days
    - Auto-reset happens by checking completion date
*/

CREATE TABLE IF NOT EXISTS habits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  color text DEFAULT '#3B82F6',
  icon text DEFAULT 'circle',
  goal_type text DEFAULT 'daily',
  goal_value integer DEFAULT 1,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS habit_completions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  habit_id uuid REFERENCES habits(id) ON DELETE CASCADE NOT NULL,
  completed_date date NOT NULL,
  value integer DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  UNIQUE(habit_id, completed_date)
);

ALTER TABLE habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE habit_completions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to habits"
  ON habits FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert to habits"
  ON habits FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public update to habits"
  ON habits FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete to habits"
  ON habits FOR DELETE
  TO public
  USING (true);

CREATE POLICY "Allow public read access to habit_completions"
  ON habit_completions FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert to habit_completions"
  ON habit_completions FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public update to habit_completions"
  ON habit_completions FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete to habit_completions"
  ON habit_completions FOR DELETE
  TO public
  USING (true);

CREATE INDEX IF NOT EXISTS idx_habit_completions_habit_id ON habit_completions(habit_id);
CREATE INDEX IF NOT EXISTS idx_habit_completions_date ON habit_completions(completed_date);