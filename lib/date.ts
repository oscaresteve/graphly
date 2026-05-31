import { format, parseISO } from "date-fns";

export type CalendarDateString = string & {
  readonly __calendarDateString: unique symbol;
};

const calendarDateFormat = "yyyy-MM-dd";
const calendarDatePattern = /^\d{4}-\d{2}-\d{2}$/;

export function getTodayCalendarDate(): CalendarDateString {
  return formatCalendarDate(new Date());
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
