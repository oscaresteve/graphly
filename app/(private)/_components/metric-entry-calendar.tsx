"use client";

import { Calendar } from "@/components/ui/calendar";

import { parseCalendarDate } from "@/lib/date";
import { type MetricEntryView } from "@/lib/metrics/types";

type MetricEntryCalendarProps = {
  entries: Pick<MetricEntryView, "date">[];
};

export function MetricEntryCalendar({ entries }: MetricEntryCalendarProps) {
  const loggedDates = entries.map((entry) => parseCalendarDate(entry.date));

  return <Calendar mode="single" numberOfMonths={1} disabled={loggedDates} />;
}
