import { format, startOfDay, endOfDay, isToday, isYesterday, parseISO } from 'date-fns';

export const formatDate = (date) => {
  if (!date) return '';
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'MMM dd, yyyy');
};

export const formatTime = (date) => {
  if (!date) return '';
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'h:mm a');
};

export const formatDateTime = (date) => {
  if (!date) return '';
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'MMM dd, yyyy h:mm a');
};

export const formatDateKey = (date) => {
  if (!date) return '';
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'yyyy-MM-dd');
};

export const getRelativeDate = (date) => {
  const d = typeof date === 'string' ? parseISO(date) : date;
  
  if (isToday(d)) return 'Today';
  if (isYesterday(d)) return 'Yesterday';
  return formatDate(d);
};

export const getTodayStart = () => startOfDay(new Date());
export const getTodayEnd = () => endOfDay(new Date());

export const getTodayKey = () => formatDateKey(new Date());

const dateHelpers = {
  formatDate,
  formatTime,
  formatDateTime,
  formatDateKey,
  getRelativeDate,
  getTodayStart,
  getTodayEnd,
  getTodayKey
};

export default dateHelpers;