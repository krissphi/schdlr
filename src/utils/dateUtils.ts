import { format, addDays, isToday as isDateToday, startOfWeek, endOfWeek, isWithinInterval } from 'date-fns';

/**
 * Timezone-safe date formatting helpers using date-fns
 */

/**
 * Returns a date string formatted as YYYY-MM-DD
 */
export const formatDateString = (date: Date): string => {
  return format(date, 'yyyy-MM-dd');
};

/**
 * Returns today's date formatted as YYYY-MM-DD with an optional day offset
 */
export const getTodayString = (offsetDays = 0): string => {
  return format(addDays(new Date(), offsetDays), 'yyyy-MM-dd');
};

/**
 * Adds or subtracts days from a YYYY-MM-DD date string
 */
export const addDaysToString = (dateStr: string, days: number): string => {
  try {
    const [y, m, d] = dateStr.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    return format(addDays(date, days), 'yyyy-MM-dd');
  } catch {
    return dateStr;
  }
};

/**
 * Check if a YYYY-MM-DD date string is today
 */
export const isTodayString = (dateStr: string): boolean => {
  try {
    const [y, m, d] = dateStr.split('-').map(Number);
    return isDateToday(new Date(y, m - 1, d));
  } catch {
    return dateStr === getTodayString(0);
  }
};

/**
 * Formats a YYYY-MM-DD date string for friendly UI display
 */
export const formatDisplayDate = (
  dateStr: string,
  options: Intl.DateTimeFormatOptions = { weekday: 'short', month: 'short', day: 'numeric' }
): string => {
  try {
    const [y, m, d] = dateStr.split('-').map(Number);
    return new Date(y, m - 1, d).toLocaleDateString('en-US', options);
  } catch {
    return dateStr;
  }
};

/**
 * Checks whether a YYYY-MM-DD date string falls in the current week (Mon-Sun)
 */
export const isDateInCurrentWeek = (dateStr: string): boolean => {
  try {
    const now = new Date();
    const weekStart = startOfWeek(now, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
    const [y, m, d] = dateStr.split('-').map(Number);
    const target = new Date(y, m - 1, d);
    return isWithinInterval(target, { start: weekStart, end: weekEnd });
  } catch {
    return false;
  }
};
