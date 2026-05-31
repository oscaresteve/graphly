"use client";

import { Button } from "@/components/ui/button";
import { ChartContainer } from "@/components/ui/chart";
import {
  formatMetricValue,
  formatRelativeCalendarDate,
} from "@/lib/metrics/format";
import { type MetricEntryView, type MetricUnitView } from "@/lib/metrics/types";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { Line, LineChart } from "recharts";

import { Separator } from "@/components/ui/separator";

type MetricCardProps = {
  id: string;
  entries: MetricEntryView[];
  title: string;
  unit: Pick<MetricUnitView, "name" | "symbol" | "type">;
};

export function MetricCard({ id, entries, title, unit }: MetricCardProps) {
  const lastEntry = entries[entries.length - 1];

  return (
    <div className="flex overflow-hidden rounded-lg border">
      <div className="flex w-3/5 flex-col justify-between p-4">
        <div className="flex flex-col gap-2">
          <h2 className="text-foreground truncate font-medium">{title}</h2>
        </div>
        <div className="flex items-center justify-between gap-2">
          <p className="text-muted-foreground truncate text-sm">
            {lastEntry
              ? formatRelativeCalendarDate(lastEntry.date)
              : "No data available"}
          </p>
          <p className="text-foreground text-xl font-medium">
            {lastEntry ? formatMetricValue(lastEntry.value) : "N/A"}{" "}
            <span className="text-muted-foreground text-xs">{unit.symbol}</span>
          </p>
        </div>
      </div>
      <Separator orientation="vertical" />
      <div className="flex w-2/5 flex-col gap-2 py-2">
        <div className="flex justify-between gap-2 px-2">
          <p className="text-muted-foreground truncate text-[0.625rem] font-medium tracking-normal uppercase">
            {unit.name}
          </p>
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
            data={entries}
            margin={{ left: 0, right: 0, top: 0, bottom: 0 }}
          >
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
    </div>
  );
}
