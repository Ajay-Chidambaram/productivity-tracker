/**
 * Formats a Date object into a "YYYY-MM-DD" string.
 * @param date The date to format.
 * @returns The formatted date string.
 */
export const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};
