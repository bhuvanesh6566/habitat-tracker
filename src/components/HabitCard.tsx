import { Check, Flame, Trash2 } from 'lucide-react';
import { Habit, HabitCompletion } from '../lib/supabase';
import { calculateStreak, getProgress, getToday } from '../lib/utils';

interface HabitCardProps {
  habit: Habit;
  completions: HabitCompletion[];
  onToggle: (habitId: string) => void;
  onDelete: (habitId: string) => void;
  viewMode: 'week' | 'month';
}

export function HabitCard({ habit, completions, onToggle, onDelete, viewMode }: HabitCardProps) {
  const today = getToday();
  const isCompletedToday = completions.some(c => c.completed_date === today);
  const streak = calculateStreak(completions);
  const progress = getProgress(completions, habit.goal_value, viewMode);

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-md border border-gray-200/50 p-4 sm:p-6 hover:shadow-lg active:scale-[0.98] transition-all duration-200">
      <div className="flex items-start justify-between mb-4 sm:mb-5">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm"
            style={{ backgroundColor: habit.color + '20' }}
          >
            <div
              className="w-6 h-6 sm:w-7 sm:h-7 rounded-xl shadow-sm"
              style={{ backgroundColor: habit.color }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900 text-base sm:text-lg truncate">{habit.name}</h3>
            <div className="flex items-center gap-1.5 sm:gap-2 mt-1">
              <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-500 flex-shrink-0" />
              <span className="text-xs sm:text-sm font-semibold text-gray-700">
                {streak} day{streak !== 1 ? 's' : ''} streak
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0 ml-2">
          <button
            onClick={() => onToggle(habit.id)}
            className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center transition-all active:scale-90 ${
              isCompletedToday
                ? 'bg-gradient-to-br from-green-500 to-emerald-500 text-white shadow-lg shadow-green-200/50'
                : 'bg-gray-100 text-gray-400 hover:bg-gray-200 active:bg-gray-300'
            }`}
          >
            <Check className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <button
            onClick={() => onDelete(habit.id)}
            className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 active:bg-red-100 active:scale-90 transition-all"
          >
            <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>

      <div className="space-y-2 sm:space-y-2.5">
        <div className="flex items-center justify-between text-xs sm:text-sm">
          <span className="text-gray-600 font-medium">{viewMode === 'week' ? 'Weekly' : 'Monthly'} Progress</span>
          <span className="font-bold text-gray-900">{Math.round(progress)}%</span>
        </div>
        <div className="w-full h-2.5 sm:h-3 bg-gray-100 rounded-full overflow-hidden shadow-inner">
          <div
            className="h-full rounded-full transition-all duration-700 ease-out shadow-sm"
            style={{
              width: `${progress}%`,
              background: `linear-gradient(90deg, ${habit.color}, ${habit.color}dd)`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
