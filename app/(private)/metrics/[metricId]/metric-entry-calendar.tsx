"use client";

import { Calendar } from "@/components/ui/calendar";

import { parseCalendarDate, type CalendarDateString } from "@/lib/date";

type MetricEntryCalendarProps = {
  entries: {
    date: CalendarDateString;
  }[];
};

export function MetricEntryCalendar({ entries }: MetricEntryCalendarProps) {
  const loggedDates = entries.map((entry) => parseCalendarDate(entry.date));

  return <Calendar mode="single" numberOfMonths={1} disabled={loggedDates} />;
}
