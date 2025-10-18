import { format as formatDateFns } from 'date-fns';

export const formatDate = (date: Date | number, format: string) => {
  if (typeof date === 'number') {
    date = new Date(date);
  }
  return formatDateFns(date, format);
};
