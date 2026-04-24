import { format, parseISO } from "date-fns";

export type CalendarDateString = string & {
  readonly __calendarDateString: unique symbol;
};

const calendarDateFormat = "yyyy-MM-dd";

export function getTodayCalendarDate(): CalendarDateString {
  return formatCalendarDate(new Date());
}

export function formatCalendarDate(date: Date): CalendarDateString {
  return format(date, calendarDateFormat) as CalendarDateString;
}

export function parseCalendarDate(value: CalendarDateString): Date {
  return parseISO(value);
}
