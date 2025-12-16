import { HabitCompletion } from './supabase';

export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function getToday(): string {
  return formatDate(new Date());
}

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

export function getWeekDates(date: Date): Date[] {
  const day = date.getDay();
  const diff = date.getDate() - day;
  const sunday = new Date(date.setDate(diff));

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(sunday);
    d.setDate(sunday.getDate() + i);
    return d;
  });
}

export function getMonthDates(year: number, month: number): Date[] {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDay = firstDay.getDay();
  const daysInMonth = lastDay.getDate();

  const dates: Date[] = [];

  for (let i = 0; i < startDay; i++) {
    const d = new Date(firstDay);
    d.setDate(d.getDate() - (startDay - i));
    dates.push(d);
  }

  for (let i = 1; i <= daysInMonth; i++) {
    dates.push(new Date(year, month, i));
  }

  const remaining = 42 - dates.length;
  for (let i = 1; i <= remaining; i++) {
    const d = new Date(lastDay);
    d.setDate(lastDay.getDate() + i);
    dates.push(d);
  }

  return dates;
}

export function calculateStreak(completions: HabitCompletion[]): number {
  if (completions.length === 0) return 0;

  const sortedDates = completions
    .map(c => c.completed_date)
    .sort()
    .reverse();

  const today = getToday();
  const yesterday = formatDate(new Date(Date.now() - 86400000));

  if (sortedDates[0] !== today && sortedDates[0] !== yesterday) {
    return 0;
  }

  let streak = 0;
  let currentDate = new Date();

  if (sortedDates[0] === yesterday) {
    currentDate = new Date(Date.now() - 86400000);
  }

  for (let i = 0; i < sortedDates.length; i++) {
    const expectedDate = formatDate(currentDate);

    if (sortedDates[i] === expectedDate) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

export function getProgress(completions: HabitCompletion[], goalValue: number, period: 'week' | 'month'): number {
  const now = new Date();
  const startDate = new Date();

  if (period === 'week') {
    const day = now.getDay();
    startDate.setDate(now.getDate() - day);
  } else {
    startDate.setDate(1);
  }

  startDate.setHours(0, 0, 0, 0);

  const periodCompletions = completions.filter(c => {
    const completionDate = new Date(c.completed_date);
    return completionDate >= startDate;
  });

  const totalDays = period === 'week' ? 7 : getDaysInMonth(now.getFullYear(), now.getMonth());
  const completedDays = periodCompletions.length;

  return Math.min((completedDays / totalDays) * 100, 100);
}
