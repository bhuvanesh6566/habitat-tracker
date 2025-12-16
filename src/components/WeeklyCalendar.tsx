import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Habit, HabitCompletion } from '../lib/supabase';
import { getWeekDates, formatDate } from '../lib/utils';

interface WeeklyCalendarProps {
  habits: Habit[];
  completions: HabitCompletion[];
  currentDate: Date;
  onDateChange: (date: Date) => void;
}

export function WeeklyCalendar({ habits, completions, currentDate, onDateChange }: WeeklyCalendarProps) {
  const weekDates = getWeekDates(new Date(currentDate));
  const today = formatDate(new Date());

  const isCompleted = (habitId: string, date: string) => {
    return completions.some(c => c.habit_id === habitId && c.completed_date === date);
  };

  const goToPreviousWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 7);
    onDateChange(newDate);
  };

  const goToNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 7);
    onDateChange(newDate);
  };

  const goToToday = () => {
    onDateChange(new Date());
  };

  const isCurrentWeek = () => {
    const today = new Date();
    const currentWeek = getWeekDates(today);
    return weekDates[0].getTime() === currentWeek[0].getTime();
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-4 sm:p-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-4 sm:mb-6 relative">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900">Weekly View</h2>
        <div className="flex items-center justify-between sm:justify-center gap-2">
          <button
            onClick={goToPreviousWeek}
            className="p-2 sm:p-2.5 hover:bg-gray-100 active:bg-gray-200 rounded-xl transition-all active:scale-90 touch-manipulation"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
          </button>
          <span className="text-xs sm:text-sm font-semibold text-gray-700 min-w-[140px] sm:min-w-32 text-center px-2">
            {weekDates[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} -{' '}
            {weekDates[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
          <button
            onClick={goToNextWeek}
            className="p-2 sm:p-2.5 hover:bg-gray-100 active:bg-gray-200 rounded-xl transition-all active:scale-90 touch-manipulation"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
          </button>
        </div>
        {!isCurrentWeek() && (
          <button
            onClick={goToToday}
            className="text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 active:scale-95 transition-all font-medium shadow-sm touch-manipulation sm:absolute sm:right-4 sm:top-0"
          >
            Today
          </button>
        )}
      </div>

      <div className="overflow-x-auto scrollbar-hide touch-pan-x -mx-4 sm:-mx-6 px-4 sm:px-6">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr>
              <th className="text-left py-3 px-2 sm:px-3 text-xs sm:text-sm font-bold text-gray-600 sticky left-0 bg-white/95 backdrop-blur-sm z-10">
                Habit
              </th>
              {weekDates.map((date, i) => {
                const dateStr = formatDate(date);
                const isToday = dateStr === today;
                return (
                  <th key={i} className="py-3 px-1.5 sm:px-2 text-center min-w-[60px] sm:min-w-[70px]">
                    <div className={`text-xs font-bold ${isToday ? 'text-indigo-600' : 'text-gray-600'}`}>
                      {date.toLocaleDateString('en-US', { weekday: 'short' })}
                    </div>
                    <div className={`text-sm sm:text-base font-bold mt-1 ${isToday ? 'text-indigo-600' : 'text-gray-900'}`}>
                      {date.getDate()}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {habits.map(habit => (
              <tr key={habit.id} className="border-t border-gray-100">
                <td className="py-3 px-2 sm:px-3 sticky left-0 bg-white/95 backdrop-blur-sm z-10">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full flex-shrink-0 shadow-sm"
                      style={{ backgroundColor: habit.color }}
                    />
                    <span className="text-xs sm:text-sm font-semibold text-gray-900 truncate max-w-[120px] sm:max-w-none">
                      {habit.name}
                    </span>
                  </div>
                </td>
                {weekDates.map((date, i) => {
                  const dateStr = formatDate(date);
                  const completed = isCompleted(habit.id, dateStr);
                  const isToday = dateStr === today;
                  return (
                    <td key={i} className="py-3 px-1.5 sm:px-2 text-center">
                      <div className="flex justify-center">
                        {completed ? (
                          <div
                            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shadow-md active:scale-90 transition-transform touch-manipulation"
                            style={{ backgroundColor: habit.color }}
                          >
                            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-white rounded-full" />
                          </div>
                        ) : (
                          <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl ${isToday ? 'bg-indigo-100 border-2 border-indigo-300' : 'bg-gray-100'} active:scale-90 transition-transform touch-manipulation`} />
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
