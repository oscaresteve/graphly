"use client";

import { subMonths, subWeeks, subYears } from "date-fns";
import { useMemo, useState } from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import { AppSubbar } from "@/components/app-subbar";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  type CalendarDateString,
  formatCalendarDate,
  parseCalendarDate,
  toCalendarDateString,
} from "@/lib/date";
import {
  formatCompactMetricValue,
  formatLongCalendarDate,
  formatShortCalendarDate,
} from "@/lib/metrics/format";
import { type MetricEntryView } from "@/lib/metrics/types";

type MetricDetailChartProps = {
  entries: MetricEntryView[];
  unitSymbol: string;
  unitName: string;
};

const chartRanges = [
  { value: "last-year", label: "Last year" },
  { value: "last-month", label: "Last month" },
  { value: "last-week", label: "Last week" },
] as const;

type ChartRange = (typeof chartRanges)[number]["value"];

type ChartDatum = {
  date: CalendarDateString;
  timestamp: number;
  unitSymbol: string;
  value: number;
};

export function MetricDetailChart({
  entries,
  unitSymbol,
  unitName,
}: MetricDetailChartProps) {
  const [range, setRange] = useState<ChartRange>("last-month");

  return (
    <div className="flex flex-col gap-3">
      <AppSubbar
        right={
          <ToggleGroup
            aria-label="Chart range"
            onValueChange={(value) => {
              if (value) {
                setRange(value as ChartRange);
              }
            }}
            size="sm"
            variant="outline"
            type="single"
            value={range}
          >
            {chartRanges.map((chartRange) => (
              <ToggleGroupItem key={chartRange.value} value={chartRange.value}>
                {chartRange.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        }
      />

      <MetricRangeChart
        entries={entries}
        range={range}
        unitName={unitName}
        unitSymbol={unitSymbol}
      />
    </div>
  );
}

function MetricRangeChart({
  entries,
  range,
  unitSymbol,
  unitName,
}: MetricDetailChartProps & {
  range: ChartRange;
}) {
  const { data, xDomain } = useMemo(
    () => getChartData(entries, unitSymbol, range),
    [entries, unitSymbol, range],
  );

  return (
    <ChartContainer
      className="aspect-auto h-80 w-full"
      config={{
        value: {
          label: unitName,
          color: "var(--chart-1)",
        },
      }}
    >
      <LineChart accessibilityLayer data={data}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis
          allowDataOverflow
          axisLine={false}
          dataKey="timestamp"
          domain={xDomain}
          scale="time"
          tickCount={6}
          tickFormatter={(value) =>
            formatShortCalendarDate(formatCalendarDate(new Date(value)))
          }
          tickLine={false}
          tickMargin={12}
          type="number"
        />
        <YAxis
          axisLine={false}
          tickFormatter={formatCompactMetricValue}
          tickLine={false}
          tickMargin={8}
          width={40}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              indicator="line"
              labelFormatter={(_value, payload) => {
                const date = payload[0]?.payload?.date;

                if (typeof date === "string") {
                  return formatLongCalendarDate(toCalendarDateString(date));
                }

                const timestamp = payload[0]?.payload?.timestamp;

                if (typeof timestamp === "number") {
                  return formatLongCalendarDate(
                    formatCalendarDate(new Date(timestamp)),
                  );
                }

                return null;
              }}
            />
          }
        />
        <Line
          activeDot={{ r: 5 }}
          dataKey="value"
          dot={false}
          isAnimationActive={false}
          stroke="var(--color-value)"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={3}
          type="monotone"
        />
      </LineChart>
    </ChartContainer>
  );
}

function getChartData(
  entries: MetricDetailChartProps["entries"],
  unitSymbol: string,
  range: ChartRange,
) {
  const today = new Date();
  const visibleStartDate = formatCalendarDate(getRangeStart(today, range));
  const visibleEndDate = formatCalendarDate(today);
  const visibleStart = parseCalendarDate(visibleStartDate);
  const visibleEnd = parseCalendarDate(visibleEndDate);

  return {
    data: entries.map(
      (entry): ChartDatum => ({
        date: entry.date,
        timestamp: parseCalendarDate(entry.date).getTime(),
        unitSymbol,
        value: entry.value,
      }),
    ),
    xDomain: [visibleStart.getTime(), visibleEnd.getTime()] as const,
  };
}

function getRangeStart(date: Date, range: ChartRange) {
  if (range === "last-week") {
    return subWeeks(date, 1);
  }

  if (range === "last-year") {
    return subYears(date, 1);
  }

  return subMonths(date, 1);
}
