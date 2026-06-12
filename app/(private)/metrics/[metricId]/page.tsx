import { AppSubbar } from "@/components/app-subbar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CalendarIcon, Pencil, Plus } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { EntryDialogForm } from "../../_components/entry-dialog-form";
import { MetricActionsDropdown } from "../../_components/metric-actions-dropdown";
import { MetricDetailChart } from "../../_components/metric-detail-chart";
import { loadMetricPageData } from "./loader";

type MetricPageProps = {
  params: Promise<{
    metricId: string;
  }>;
};

export default async function MetricPage({ params }: MetricPageProps) {
  const { metricId } = await params;
  const { metric, today } = await loadMetricPageData(metricId);

  if (!metric) {
    notFound();
  }

  const entryDates = metric.entries.map((entry) => entry.date);
  const todayEntry = metric.entries.find((entry) => entry.date === today);

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-4">
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
        today={today}
      />
    </div>
  );
}
