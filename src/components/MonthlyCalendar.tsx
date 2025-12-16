import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Habit, HabitCompletion } from '../lib/supabase';
import { getMonthDates, formatDate } from '../lib/utils';

interface MonthlyCalendarProps {
  habits: Habit[];
  completions: HabitCompletion[];
  currentDate: Date;
  onDateChange: (date: Date) => void;
}

export function MonthlyCalendar({ habits, completions, currentDate, onDateChange }: MonthlyCalendarProps) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthDates = getMonthDates(year, month);
  const today = formatDate(new Date());

  const getCompletionCount = (date: string) => {
    return completions.filter(c => c.completed_date === date).length;
  };

  const goToPreviousMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() - 1);
    onDateChange(newDate);
  };

  const goToNextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + 1);
    onDateChange(newDate);
  };

  const goToToday = () => {
    onDateChange(new Date());
  };

  const isCurrentMonthView = () => {
    const today = new Date();
    return currentDate.getMonth() === today.getMonth() && currentDate.getFullYear() === today.getFullYear();
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-4 sm:p-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-4 sm:mb-6 relative">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900">Monthly View</h2>
        <div className="flex items-center justify-between sm:justify-center gap-2">
          <button
            onClick={goToPreviousMonth}
            className="p-2 sm:p-2.5 hover:bg-gray-100 active:bg-gray-200 rounded-xl transition-all active:scale-90 touch-manipulation"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
          </button>
          <span className="text-xs sm:text-sm font-semibold text-gray-700 min-w-[140px] sm:min-w-40 text-center px-2">
            {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </span>
          <button
            onClick={goToNextMonth}
            className="p-2 sm:p-2.5 hover:bg-gray-100 active:bg-gray-200 rounded-xl transition-all active:scale-90 touch-manipulation"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
          </button>
        </div>
        {!isCurrentMonthView() && (
          <button
            onClick={goToToday}
            className="text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 active:scale-95 transition-all font-medium shadow-sm touch-manipulation sm:absolute sm:right-4 sm:top-0"
          >
            Today
          </button>
        )}
      </div>

      <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center py-1.5 sm:py-2">
            <span className="text-xs sm:text-sm font-bold text-gray-600">{day}</span>
          </div>
        ))}

        {monthDates.map((date, i) => {
          const dateStr = formatDate(date);
          const isToday = dateStr === today;
          const isCurrentMonth = date.getMonth() === month;
          const completionCount = getCompletionCount(dateStr);
          const totalHabits = habits.length;
          const completionRate = totalHabits > 0 ? completionCount / totalHabits : 0;

          return (
            <div
              key={i}
              className={`aspect-square rounded-xl sm:rounded-2xl border-2 p-1 sm:p-2 flex flex-col items-center justify-center relative transition-all active:scale-95 touch-manipulation ${
                isToday
                  ? 'border-indigo-500 bg-gradient-to-br from-indigo-50 to-purple-50 shadow-md'
                  : isCurrentMonth
                  ? 'border-gray-200 bg-white hover:bg-gray-50'
                  : 'border-gray-100 bg-gray-50/50'
              }`}
            >
              <span
                className={`text-xs sm:text-sm font-bold ${
                  isToday
                    ? 'text-indigo-600'
                    : isCurrentMonth
                    ? 'text-gray-900'
                    : 'text-gray-400'
                }`}
              >
                {date.getDate()}
              </span>

              {completionCount > 0 && (
                <div className="mt-0.5 sm:mt-1 flex gap-0.5 sm:gap-1 flex-wrap justify-center max-w-full">
                  {Array.from({ length: Math.min(completionCount, 5) }, (_, i) => (
                    <div
                      key={i}
                      className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full"
                      style={{
                        backgroundColor:
                          completionRate >= 0.8
                            ? '#10B981'
                            : completionRate >= 0.5
                            ? '#F59E0B'
                            : '#6B7280',
                      }}
                    />
                  ))}
                </div>
              )}

              {completionCount >= totalHabits && totalHabits > 0 && (
                <div className="absolute -top-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white text-xs font-bold">✓</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500 shadow-sm" />
          <span className="text-gray-600 font-medium">80%+ Complete</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-amber-500 shadow-sm" />
          <span className="text-gray-600 font-medium">50-79% Complete</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gray-500 shadow-sm" />
          <span className="text-gray-600 font-medium">Below 50%</span>
        </div>
      </div>
    </div>
  );
}
