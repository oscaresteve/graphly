export type CalendarDateString = string & {
  readonly __calendarDateString: unique symbol;
};

export function getTodayCalendarDate(): CalendarDateString {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}` as CalendarDateString;
}
