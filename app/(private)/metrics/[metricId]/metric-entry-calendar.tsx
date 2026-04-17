"use client";

import { Calendar } from "@/components/ui/calendar";

import { type CalendarDateString } from "@/lib/date";

type MetricEntryCalendarProps = {
  entries: {
    date: CalendarDateString;
  }[];
};

export function MetricEntryCalendar({ entries }: MetricEntryCalendarProps) {
  const loggedDates = entries.map((entry) => toLocalDate(entry.date));

  return <Calendar mode="single" numberOfMonths={1} disabled={loggedDates} />;
}

function toLocalDate(value: CalendarDateString) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}
