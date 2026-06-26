"use client";

import { AppSubbar } from "@/components/app-subbar";
import { Plus, Pencil, ChevronLeft } from "lucide-react";

import { EntryFormModal } from "./entry-form-modal";
import { MetricActionsDropdown } from "./metric-actions-dropdown";
import { Button } from "@/components/ui/button";
import { CalendarDateString } from "@/lib/date";
import { MetricView } from "@/lib/metrics/types";
import Link from "next/link";

type MetricSubbarProps = {
  metric: MetricView;
  today: CalendarDateString;
};

export default function MetricSubbar({ metric, today }: MetricSubbarProps) {
  const metricId = metric.id;
  const metricName = metric.name;
  const metricUnit = metric.unit;
  const todayEntry = metric.entries.find((entry) => entry.date === today);
  const pastEntries = metric.entries.filter((entry) => entry.date !== today);
  const entryDates = metric.entries.map((entry) => entry.date);
  const pastEntryDates = pastEntries.map((entry) => entry.date);

  return (
    <AppSubbar
      left={
        <Button asChild variant="ghost" size="sm">
          <Link href="/">
            <ChevronLeft data-icon="inline-start" />
            Back
          </Link>
        </Button>
      }
      right={
        <>
          {todayEntry ? (
            <EntryFormModal
              intent={{ type: "edit-today", entry: todayEntry }}
              metricId={metricId}
              metricName={metricName}
              unit={metricUnit}
              today={today}
              trigger={
                <Button type="button" variant="outline" size="sm">
                  <Pencil data-icon="inline-start" />
                  Edit today
                </Button>
              }
            />
          ) : (
            <EntryFormModal
              intent={{ type: "create-today" }}
              metricId={metricId}
              metricName={metricName}
              unit={metricUnit}
              today={today}
              trigger={
                <Button type="button" size="sm">
                  <Plus data-icon="inline-start" />
                  Log today
                </Button>
              }
            />
          )}
          <MetricActionsDropdown
            entryDates={entryDates}
            metricId={metricId}
            metricName={metricName}
            metricUnit={metricUnit}
            today={today}
            pastEntries={pastEntries}
            pastEntryDates={pastEntryDates}
          />
        </>
      }
    />
  );
}
