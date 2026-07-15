import {
  formatCalendarDate,
  parseCalendarDate,
  type CalendarDateString,
} from "@/lib/date";

export function formatMetricValue(value: number, locale: string) {
  return new Intl.NumberFormat(locale, {
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatCompactMetricValue(value: number, locale: string) {
  return new Intl.NumberFormat(locale, {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatRelativeCalendarDate(
  value: CalendarDateString,
  todayDate: CalendarDateString,
  locale: string,
  labels: { today: string; yesterday: string },
) {
  const yesterday = parseCalendarDate(todayDate);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayDate = formatCalendarDate(yesterday);

  if (value === todayDate) {
    return labels.today;
  }

  if (value === yesterdayDate) {
    return labels.yesterday;
  }

  return formatLongCalendarDate(value, locale);
}

export function formatShortCalendarDate(
  value: CalendarDateString,
  locale: string,
) {
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
  }).format(parseCalendarDate(value));
}

export function formatLongCalendarDate(
  value: CalendarDateString,
  locale: string,
) {
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(parseCalendarDate(value));
}
