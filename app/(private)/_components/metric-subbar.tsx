"use client";

import { AppSubbar } from "@/components/app-subbar";
import { ArrowLeft, Plus, Pencil, CalendarIcon } from "lucide-react";

import { EntryDialogForm } from "./entry-dialog-form";
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
  const entryDates = metric.entries.map((entry) => entry.date);
  const todayEntry = metric.entries.find((entry) => entry.date === today);

  return (
    <AppSubbar
      left={
        <Button asChild variant="ghost" size="sm">
          <Link href="/">
            <ArrowLeft data-icon="inline-start" />
            Back
          </Link>
        </Button>
      }
      right={
        <>
          {!todayEntry ? (
            <EntryDialogForm
              intent={{ type: "create-today" }}
              metricId={metric.id}
              metricName={metric.name}
              today={today}
              trigger={
                <Button type="button">
                  <Plus data-icon="inline-start" />
                  Log today
                </Button>
              }
              unit={metric.unit}
            />
          ) : (
            <EntryDialogForm
              intent={{ type: "edit-today", entry: todayEntry }}
              metricId={metric.id}
              metricName={metric.name}
              today={today}
              trigger={
                <Button type="button">
                  <Pencil data-icon="inline-start" />
                  Edit today
                </Button>
              }
              unit={metric.unit}
            />
          )}
          <EntryDialogForm
            entryDates={entryDates}
            intent={{ type: "create-past" }}
            metricId={metric.id}
            metricName={metric.name}
            today={today}
            trigger={
              <Button type="button" variant="secondary">
                <CalendarIcon data-icon="inline-start" />
                Log past entry
              </Button>
            }
            unit={metric.unit}
          />
          <MetricActionsDropdown metricId={metric.id} />
        </>
      }
    />
  );
}
