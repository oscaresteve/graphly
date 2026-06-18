"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import {
  formatMetricValue,
  formatRelativeCalendarDate,
} from "@/lib/metrics/format";
import { type MetricEntryView, type MetricUnitView } from "@/lib/metrics/types";
import { ChevronRight, LineChart as LineChartIcon, Plus } from "lucide-react";
import Link from "next/link";
import { Line, LineChart, XAxis } from "recharts";

import { Separator } from "@/components/ui/separator";
import { CalendarDateString, parseCalendarDate } from "@/lib/date";
import { useMemo } from "react";
import { EntryDialogForm } from "./entry-dialog-form";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const hasEnoughEntries = entries.length > 2;

  const { data, xDomain } = useMemo(() => {
    return getChartData(entries, unit.symbol);
  }, [entries, unit.symbol]);

  const isMobile = useIsMobile();

  return (
    <Card className="flex-col gap-0 py-0 md:flex-row">
      <div className="flex flex-col justify-between gap-2 p-4 md:w-2/5">
        <div className="flex flex-col">
          <h2 className="text-foreground truncate text-base font-medium">
            {title}
          </h2>
        </div>
        {lastEntry ? (
          <div className="flex items-end justify-between gap-2">
            <p className="text-muted-foreground truncate text-sm">
              {formatRelativeCalendarDate(lastEntry.date, today)}
            </p>
            <p className="text-foreground text-xl font-medium min-w-max">
              {formatMetricValue(lastEntry.value)}{" "}
              <span className="text-muted-foreground text-xs">
                {unit.symbol}
              </span>
            </p>
          </div>
        ) : (
          <div className="flex items-end justify-between gap-2 italic">
            <p className="text-muted-foreground truncate text-sm">
              No data available.
            </p>
            <p className="text-muted-foreground text-xl font-medium min-w-max">
              N/A{" "}
              <span className="text-muted-foreground text-xs">
                {unit.symbol}
              </span>
            </p>
          </div>
        )}
      </div>
      <Separator orientation={isMobile ? "horizontal" : "vertical"} />
      <div className="flex h-30 flex-col gap-1 py-4 md:w-3/5">
        <div className="flex justify-between gap-2 px-4">
          <p className="text-muted-foreground truncate text-[0.625rem] font-medium tracking-normal uppercase">
            {unit.name}
          </p>
          <div className="flex items-center gap-1">
            {!todayEntry && (
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
            <Button
              asChild
              variant="ghost"
              size="icon-sm"
              aria-label="View details"
            >
              <Link href={`/metrics/${id}`}>
                <ChevronRight />
              </Link>
            </Button>
          </div>
        </div>

        {hasEnoughEntries ? (
          <ChartContainer
            aria-hidden="true"
            className="pointer-events-none aspect-auto h-full w-full"
            config={{
              value: {
                label: "Value",
                color: "var(--chart-1)",
              },
            }}
          >
            <LineChart
              data={data}
              margin={{ left: 0, right: 0, top: 2, bottom: 2 }}
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
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-1">
            <LineChartIcon className="text-muted-foreground size-4" />
            <p className="text-muted-foreground text-xs italic">
              Not enough data.
            </p>
          </div>
        )}
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
