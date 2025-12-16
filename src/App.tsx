import { useEffect, useState } from 'react';
import { Plus, Calendar, LayoutGrid } from 'lucide-react';
import { supabase, Habit, HabitCompletion } from './lib/supabase';
import { getToday } from './lib/utils';
import { HabitCard } from './components/HabitCard';
import { WeeklyCalendar } from './components/WeeklyCalendar';
import { MonthlyCalendar } from './components/MonthlyCalendar';
import { AddHabitModal } from './components/AddHabitModal';

type ViewMode = 'week' | 'month';

function App() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [completions, setCompletions] = useState<HabitCompletion[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('week');
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    loadHabits();
    loadCompletions();
  }, []);

  async function loadHabits() {
    const { data, error } = await supabase
      .from('habits')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error loading habits:', error);
      return;
    }

    setHabits(data || []);
  }

  async function loadCompletions() {
    const { data, error } = await supabase
      .from('habit_completions')
      .select('*')
      .order('completed_date', { ascending: false });

    if (error) {
      console.error('Error loading completions:', error);
      return;
    }

    setCompletions(data || []);
  }

  async function addHabit(name: string, color: string) {
    const { data, error } = await supabase
      .from('habits')
      .insert({ name, color })
      .select()
      .single();

    if (error) {
      console.error('Error adding habit:', error);
      return;
    }

    if (data) {
      setHabits([...habits, data]);
    }
  }

  async function toggleHabit(habitId: string) {
    const today = getToday();
    const existing = completions.find(
      c => c.habit_id === habitId && c.completed_date === today
    );

    if (existing) {
      const { error } = await supabase
        .from('habit_completions')
        .delete()
        .eq('id', existing.id);

      if (error) {
        console.error('Error removing completion:', error);
        return;
      }

      setCompletions(completions.filter(c => c.id !== existing.id));
    } else {
      const { data, error } = await supabase
        .from('habit_completions')
        .insert({ habit_id: habitId, completed_date: today, value: 1 })
        .select()
        .single();

      if (error) {
        console.error('Error adding completion:', error);
        return;
      }

      if (data) {
        setCompletions([data, ...completions]);
      }
    }
  }

  async function deleteHabit(habitId: string) {
    const { error } = await supabase.from('habits').delete().eq('id', habitId);

    if (error) {
      console.error('Error deleting habit:', error);
      return;
    }

    setHabits(habits.filter(h => h.id !== habitId));
    setCompletions(completions.filter(c => c.habit_id !== habitId));
  }

  const getHabitCompletions = (habitId: string) => {
    return completions.filter(c => c.habit_id === habitId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
        <header className="mb-4 sm:mb-6 md:mb-8 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-0">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-1 sm:mb-2">
                Habit Tracker
              </h1>
              <p className="text-sm sm:text-base text-gray-600">Build better habits, one day at a time</p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-200/50 active:scale-95 transition-all flex items-center justify-center gap-2 font-medium text-sm sm:text-base"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="sm:inline">Add Habit</span>
            </button>
          </div>

          <div className="flex items-center gap-2 mt-4 sm:mt-6 bg-white/80 backdrop-blur-sm p-1 rounded-xl shadow-md border border-gray-200/50 w-full sm:w-fit">
            <button
              onClick={() => setViewMode('week')}
              className={`flex-1 sm:flex-none px-4 sm:px-4 py-2.5 sm:py-2 rounded-lg flex items-center justify-center gap-2 transition-all font-medium text-sm sm:text-base ${
                viewMode === 'week'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100 active:bg-gray-200'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Weekly</span>
            </button>
            <button
              onClick={() => setViewMode('month')}
              className={`flex-1 sm:flex-none px-4 sm:px-4 py-2.5 sm:py-2 rounded-lg flex items-center justify-center gap-2 transition-all font-medium text-sm sm:text-base ${
                viewMode === 'month'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100 active:bg-gray-200'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              <span>Monthly</span>
            </button>
          </div>
        </header>

        {habits.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-8 sm:p-12 text-center animate-slide-in">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <Plus className="w-8 h-8 sm:w-10 sm:h-10 text-indigo-600" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">No habits yet</h2>
              <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">
                Start building better habits by creating your first one!
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-6 sm:px-8 py-3 sm:py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-200/50 active:scale-95 transition-all font-medium text-sm sm:text-base"
              >
                Create Your First Habit
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {habits.map((habit, index) => (
                <div key={habit.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <HabitCard
                    habit={habit}
                    completions={getHabitCompletions(habit.id)}
                    onToggle={toggleHabit}
                    onDelete={deleteHabit}
                    viewMode={viewMode}
                  />
                </div>
              ))}
            </div>

            {viewMode === 'week' ? (
              <WeeklyCalendar
                habits={habits}
                completions={completions}
                currentDate={currentDate}
                onDateChange={setCurrentDate}
              />
            ) : (
              <MonthlyCalendar
                habits={habits}
                completions={completions}
                currentDate={currentDate}
                onDateChange={setCurrentDate}
              />
            )}
          </div>
        )}

        <AddHabitModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAdd={addHabit}
        />
      </div>
    </div>
  );
}

export default App;
