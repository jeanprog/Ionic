import { format } from 'date-fns';

export function formatDateToYYYYMMDD(inputDate: string): string {
  const dateParts = inputDate.split('/');
  const year = parseInt(dateParts[2], 10);
  const month = parseInt(dateParts[1], 10);
  const day = parseInt(dateParts[0], 10);
  const formattedDate = new Date(year, month - 1, day);
  return formattedDate.toLocaleDateString('en-CA'); // Adjust the locale as needed
}

export function formatDate(data: string) {
  const date = new Date(data);
  return format(date, 'dd/MM/yyyy');
}
