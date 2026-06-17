"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import {
  formatMetricValue,
  formatRelativeCalendarDate,
} from "@/lib/metrics/format";
import { type MetricEntryView, type MetricUnitView } from "@/lib/metrics/types";
import { ArrowRight, Pencil, Plus } from "lucide-react";
import Link from "next/link";
import { Line, LineChart, XAxis } from "recharts";

import { Separator } from "@/components/ui/separator";
import { CalendarDateString, parseCalendarDate } from "@/lib/date";
import { useMemo } from "react";
import { EntryDialogForm } from "./entry-dialog-form";

type MetricCardProps = {
  id: string;
  entries: MetricEntryView[];
  title: string;
  today: CalendarDateString;
  unit: Pick<MetricUnitView, "name" | "symbol" | "type">;
};

type ChartDatum = {
  date: CalendarDateString;
  timestamp: number;
  unitSymbol: string;
  value: number;
};

export function MetricCard({
  id,
  entries,
  title,
  today,
  unit,
}: MetricCardProps) {
  const lastEntry = entries[entries.length - 1];
  const todayEntry = entries.find((entry) => entry.date === today);

  const { data, xDomain } = useMemo(() => {
    return getChartData(entries, unit.symbol);
  }, [entries, unit.symbol]);

  return (
    <Card className="flex-row gap-0 py-0">
      <div className="flex w-2/5 flex-col justify-between p-4">
        <div className="flex flex-col gap-2">
          <h2 className="text-foreground truncate font-medium">{title}</h2>
        </div>
        <div className="flex items-center justify-between gap-2">
          <p className="text-muted-foreground truncate text-sm">
            {lastEntry
              ? formatRelativeCalendarDate(lastEntry.date, today)
              : "No data available"}
          </p>
          <p className="text-foreground text-xl font-medium">
            {lastEntry ? formatMetricValue(lastEntry.value) : "N/A"}{" "}
            <span className="text-muted-foreground text-xs">{unit.symbol}</span>
          </p>
        </div>
      </div>
      <Separator orientation="vertical" />
      <div className="flex w-3/5 flex-col gap-2 py-4">
        <div className="flex justify-between gap-2 px-4">
          <p className="text-muted-foreground truncate text-[0.625rem] font-medium tracking-normal uppercase">
            {unit.name}
          </p>
          <div className="flex items-center gap-1">
            {todayEntry ? (
              <EntryDialogForm
                intent={{ type: "edit-today", entry: todayEntry }}
                metricId={id}
                metricName={title}
                today={today}
                trigger={
                  <Button type="button" variant="secondary" size="sm">
                    <Pencil data-icon="inline-start" />
                    Edit today
                  </Button>
                }
                unit={unit}
              />
            ) : (
              <EntryDialogForm
                intent={{ type: "create-today" }}
                metricId={id}
                metricName={title}
                today={today}
                trigger={
                  <Button type="button" size="sm">
                    <Plus data-icon="inline-start" />
                    Log today
                  </Button>
                }
                unit={unit}
              />
            )}
            <Button asChild variant="ghost" size="sm" aria-label="View details">
              <Link href={`/metrics/${id}`}>
                Details
                <ArrowRight data-icon="inline-end" />
              </Link>
            </Button>
          </div>
        </div>

        <ChartContainer
          aria-hidden="true"
          className="pointer-events-none h-12 w-full"
          config={{
            value: {
              label: "Value",
              color: "var(--chart-1)",
            },
          }}
        >
          <LineChart
            data={data}
            margin={{ left: 0, right: 0, top: 0, bottom: 0 }}
          >
            <XAxis
              dataKey="timestamp"
              scale="time"
              type="number"
              hide
              domain={xDomain}
            />
            <Line
              dataKey="value"
              dot={false}
              isAnimationActive={false}
              stroke="var(--color-value)"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              type="monotone"
            />
          </LineChart>
        </ChartContainer>
      </div>
    </Card>
  );
}

function getChartData(entries: MetricEntryView[], unitSymbol: string) {
  const data = entries.map(
    (entry): ChartDatum => ({
      date: entry.date,
      timestamp: parseCalendarDate(entry.date).getTime(),
      unitSymbol,
      value: entry.value,
    }),
  );
  const xDomain = [data[0]?.timestamp, data[data.length - 1]?.timestamp];
  return { data, xDomain };
}
