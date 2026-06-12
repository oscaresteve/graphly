import { format, subDays, subMonths, subYears } from "date-fns";

import {
  formatCalendarDate,
  parseCalendarDate,
  type CalendarDateString,
} from "@/lib/date";

export type ChartRange =
  | "all-time"
  | "last-year"
  | "last-month"
  | "last-week"
  | "custom";

export type ChartDateRange = {
  startDate: CalendarDateString;
  endDate: CalendarDateString;
};

const halfDayMilliseconds = 43_200_000;

export function resolveChartDateRange({
  customRange,
  firstEntryDate,
  range,
  todayDate,
}: {
  customRange: ChartDateRange | null;
  firstEntryDate?: CalendarDateString;
  range: ChartRange;
  todayDate: CalendarDateString;
}): ChartDateRange {
  if (range === "custom" && customRange) {
    return customRange;
  }

  const today = parseCalendarDate(todayDate);
  const startDate =
    range === "all-time" && firstEntryDate && firstEntryDate < todayDate
      ? firstEntryDate
      : formatCalendarDate(getPresetRangeStart(today, range));

  return { startDate, endDate: todayDate };
}

export function isValidCustomRange(
  range: ChartDateRange | null,
  todayDate: CalendarDateString,
) {
  return Boolean(
    range && range.startDate <= range.endDate && range.endDate <= todayDate,
  );
}

export function getChartDomain(range: ChartDateRange) {
  const start = parseCalendarDate(range.startDate).getTime();
  const end = parseCalendarDate(range.endDate).getTime();

  if (start === end) {
    return [start - halfDayMilliseconds, end + halfDayMilliseconds] as const;
  }

  return [start, end] as const;
}

export function getChartTicks(range: ChartDateRange, chartRange: ChartRange) {
  if (range.startDate === range.endDate) {
    return [parseCalendarDate(range.startDate).getTime()];
  }

  const ticks: number[] = [];
  const current = parseCalendarDate(range.startDate);
  const end = parseCalendarDate(range.endDate);
  const stepDays = getTickStepDays(chartRange, current, end);

  while (current <= end) {
    ticks.push(current.getTime());
    current.setDate(current.getDate() + stepDays);
  }

  const endTimestamp = end.getTime();

  if (!ticks.includes(endTimestamp)) {
    ticks.push(endTimestamp);
  }

  return ticks;
}

export function formatCustomRangeLabel(
  range: ChartDateRange,
  todayDate: CalendarDateString,
) {
  const start = parseCalendarDate(range.startDate);
  const end = parseCalendarDate(range.endDate);
  const today = parseCalendarDate(todayDate);

  if (start.getFullYear() !== end.getFullYear()) {
    return `${format(start, "MMM d, yyyy")} – ${format(end, "MMM d, yyyy")}`;
  }

  if (start.getFullYear() !== today.getFullYear()) {
    return `${format(start, "MMM d")} – ${format(end, "MMM d, yyyy")}`;
  }

  return `${format(start, "MMM d")} – ${format(end, "MMM d")}`;
}

function getPresetRangeStart(date: Date, range: ChartRange) {
  if (range === "all-time" || range === "last-week") {
    return subDays(date, 6);
  }

  if (range === "last-year") {
    return subYears(date, 1);
  }

  return subMonths(date, 1);
}

function getTickStepDays(range: ChartRange, start: Date, end: Date) {
  if (range === "last-week") {
    return 1;
  }

  if (range === "last-month") {
    return 7;
  }

  if (range === "last-year") {
    return 30;
  }

  const dayCount = Math.max(
    1,
    Math.ceil((end.getTime() - start.getTime()) / 86_400_000),
  );

  return range === "custom"
    ? Math.max(1, Math.ceil(dayCount / 6))
    : Math.max(1, Math.ceil(dayCount / 30));
}
