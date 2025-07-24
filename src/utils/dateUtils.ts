export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

export const getLast7Days = (): string[] => {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    days.push(formatDate(date));
  }
  return days;
};

export const formatDisplayDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ja-JP', {
    month: 'short',
    day: 'numeric'
  });
};

export const getDateRange = (period: 'day' | 'week' | 'month'): string[] => {
  const dates = [];
  const today = new Date();
  
  switch (period) {
    case 'day':
      // 過去24時間（時間別）
      for (let i = 23; i >= 0; i--) {
        const date = new Date(today);
        date.setHours(date.getHours() - i);
        dates.push(date.toISOString().slice(0, 13) + ':00:00');
      }
      break;
    case 'week':
      // 過去7日
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        dates.push(formatDate(date));
      }
      break;
    case 'month':
      // 過去30日
      for (let i = 29; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        dates.push(formatDate(date));
      }
      break;
  }
  
  return dates;
};

export const formatPeriodLabel = (dateString: string, period: 'day' | 'week' | 'month'): string => {
  const date = new Date(dateString);
  
  switch (period) {
    case 'day':
      return date.getHours().toString().padStart(2, '0') + ':00';
    case 'week':
      return date.toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' });
    case 'month':
      return date.toLocaleDateString('ja-JP', { month: 'numeric', day: 'numeric' });
    default:
      return dateString;
  }
};

export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const isSameDay = (date1: Date, date2: Date): boolean => {
  return formatDate(date1) === formatDate(date2);
};

export const getWeekDays = (date: Date): Date[] => {
  const start = new Date(date);
  const day = start.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  const diff = start.getDate() - day;
  start.setDate(diff);
  
  const days = [];
  for (let i = 0; i < 7; i++) {
    days.push(new Date(start));
    start.setDate(start.getDate() + 1);
  }
  return days;
};

export const getMonthDays = (date: Date): Date[] => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  
  // Get the first day of the week for the calendar grid
  const startDate = new Date(firstDay);
  const dayOfWeek = firstDay.getDay(); // 0 = Sunday, 1 = Monday, etc.
  startDate.setDate(firstDay.getDate() - dayOfWeek);
  
  const days = [];
  
  // Add days from previous month to fill the first week
  for (let d = new Date(startDate); d < firstDay; d.setDate(d.getDate() + 1)) {
    days.push(new Date(d));
  }
  
  // Add all days of the current month
  for (let d = new Date(firstDay); d <= lastDay; d.setDate(d.getDate() + 1)) {
    days.push(new Date(d));
  }
  
  // Add days from next month to fill the last week (up to 42 days total for 6 weeks)
  const remainingDays = 42 - days.length;
  const nextMonthStart = new Date(year, month + 1, 1);
  for (let i = 0; i < remainingDays; i++) {
    const nextDay = new Date(nextMonthStart);
    nextDay.setDate(nextMonthStart.getDate() + i);
    days.push(nextDay);
  }
  
  return days;
}