import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, startOfWeek, endOfWeek, getWeek } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getWeeklyInfo(date: Date) {
  const start = startOfWeek(date);
  const end = endOfWeek(date);
  const weekNum = getWeek(date);

  return `Week ${String(weekNum).padStart(2, '0')} (${format(start, 'MM/dd/yy')} - ${format(end, 'MM/dd/yy')})`;
}
