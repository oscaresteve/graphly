import {
  formatCalendarDate,
  getTodayCalendarDate,
  parseCalendarDate,
  type CalendarDateString,
} from "@/lib/date";

export function formatMetricValue(value: number) {
  return new Intl.NumberFormat("en", {
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatCompactMetricValue(value: number) {
  return new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatRelativeCalendarDate(value: CalendarDateString) {
  const todayDate = getTodayCalendarDate();
  const yesterdayDate = formatCalendarDate(
    new Date(new Date().setDate(new Date().getDate() - 1)),
  );

  if (value === todayDate) {
    return "Today";
  }

  if (value === yesterdayDate) {
    return "Yesterday";
  }

  return formatLongCalendarDate(value);
}

export function formatShortCalendarDate(value: CalendarDateString) {
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
  }).format(parseCalendarDate(value));
}

export function formatLongCalendarDate(value: CalendarDateString) {
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(parseCalendarDate(value));
}
