import { format, parseISO } from "date-fns";

export type CalendarDateString = string & {
  readonly __calendarDateString: unique symbol;
};

export const defaultTimeZone = "UTC";

const calendarDateFormat = "yyyy-MM-dd";
const calendarDatePattern = /^\d{4}-\d{2}-\d{2}$/;

export function getTodayCalendarDate(
  timeZone: string,
  now = new Date(),
): CalendarDateString {
  const formatter = new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "2-digit",
    timeZone,
    year: "numeric",
  });
  const parts = formatter.formatToParts(now);
  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;

  if (!year || !month || !day) {
    throw new Error("Could not format calendar date");
  }

  return `${year}-${month}-${day}` as CalendarDateString;
}

export function formatCalendarDate(date: Date): CalendarDateString {
  return format(date, calendarDateFormat) as CalendarDateString;
}

export function toCalendarDateString(value: string): CalendarDateString {
  if (!calendarDatePattern.test(value)) {
    throw new Error(`Invalid calendar date string: ${value}`);
  }

  return value as CalendarDateString;
}

export function parseCalendarDate(value: CalendarDateString): Date {
  return parseISO(value);
}

export function isValidTimeZone(value: string): boolean {
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: value }).format();
    return true;
  } catch {
    return false;
  }
}
