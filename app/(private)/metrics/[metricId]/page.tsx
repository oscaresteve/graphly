import { AppSubbar } from "@/components/app-subbar";
import { Button } from "@/components/ui/button";
import { getTodayCalendarDate } from "@/lib/date";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { MetricActionsDropdown } from "../metric-actions-dropdown";
import { TodayEntryDialogForm } from "../today-entry-dialog-form";
import { MetricEntryCalendar } from "./metric-entry-calendar";
import { MetricDetailChart } from "./metric-detail-chart";
import { loadMetricPageData } from "./loader";

type MetricPageProps = {
  params: Promise<{
    metricId: string;
  }>;
};

export default async function MetricPage({ params }: MetricPageProps) {
  const { metricId } = await params;
  const { metric } = await loadMetricPageData(metricId);

  if (!metric) {
    notFound();
  }

  const entryDates = metric.entries.map((entry) => entry.date);
  const hasTodayEntry = entryDates.includes(getTodayCalendarDate());

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-4">
      <AppSubbar
        left={
          <Button asChild variant="ghost" size="sm">
            <Link href="/metrics">
              <ArrowLeft data-icon="inline-start" />
              Back
            </Link>
          </Button>
        }
        right={
          <>
            <TodayEntryDialogForm
              disabled={hasTodayEntry}
              metricId={metric.id}
              metricName={metric.name}
              unit={metric.unit}
            />
            <MetricActionsDropdown
              entryDates={entryDates}
              metricId={metric.id}
              metricName={metric.name}
              unit={metric.unit}
            />
          </>
        }
      />

      <div className="flex flex-col">
        <p className="text-muted-foreground text-xs font-medium tracking-normal uppercase">
          {metric.unit.name}
        </p>
        <h1 className="text-2xl font-semibold">{metric.name}</h1>
        {metric.description ? (
          <p className="text-muted-foreground">{metric.description}</p>
        ) : null}
      </div>
      <MetricDetailChart
        entries={metric.entries}
        unitSymbol={metric.unit.symbol}
        unitName={metric.unit.name}
      />

      <MetricEntryCalendar entries={metric.entries} />
    </div>
  );
}
