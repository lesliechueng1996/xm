import { format } from 'date-fns';

export const formatDate = (date: Date | number) => {
  if (typeof date === 'number') {
    date = new Date(date);
  }

  return format(date, 'yyyy-MM-dd HH:mm:ss');
};
