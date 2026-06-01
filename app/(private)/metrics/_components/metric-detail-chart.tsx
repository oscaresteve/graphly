"use client";

import { subDays, subMonths, subYears } from "date-fns";
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
  today: CalendarDateString;
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
  today,
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
        today={today}
      />
    </div>
  );
}

function MetricRangeChart({
  entries,
  range,
  unitSymbol,
  unitName,
  today,
}: MetricDetailChartProps & {
  range: ChartRange;
}) {
  const { data, xDomain, xTicks } = useMemo(
    () => getChartData(entries, unitSymbol, range, today),
    [entries, unitSymbol, range, today],
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
          ticks={xTicks}
          tickFormatter={(value) =>
            formatShortCalendarDate(formatCalendarDate(new Date(value)))
          }
          tickLine={true}
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
  todayDateString: CalendarDateString,
) {
  const today = parseCalendarDate(todayDateString);

  const visibleStartDate = formatCalendarDate(getRangeStart(today, range));
  const visibleEndDate = todayDateString;
  const visibleStart = parseCalendarDate(visibleStartDate);
  const visibleEnd = parseCalendarDate(visibleEndDate);

  const data = entries.map(
    (entry): ChartDatum => ({
      date: entry.date,
      timestamp: parseCalendarDate(entry.date).getTime(),
      unitSymbol,
      value: entry.value,
    }),
  );

  const xDomain = [visibleStart.getTime(), visibleEnd.getTime()] as const;
  const xTicks = getXticks(visibleStartDate, visibleEndDate, range);

  return {
    data,
    xDomain,
    xTicks,
  };
}

function getRangeStart(date: Date, range: ChartRange) {
  if (range === "last-week") {
    return subDays(date, 6);
  }

  if (range === "last-year") {
    return subYears(date, 1);
  }

  return subMonths(date, 1);
}

function getXticks(
  fechaInicio: CalendarDateString,
  fechaFin: CalendarDateString,
  range: ChartRange,
) {
  const xTicks: number[] = [];

  const actual = parseCalendarDate(fechaInicio);
  const fin = parseCalendarDate(fechaFin);

  const stepDays = range === "last-week" ? 1 : range === "last-month" ? 7 : 30;

  while (actual <= fin) {
    xTicks.push(actual.getTime());
    actual.setDate(actual.getDate() + stepDays);
  }

  const finTimestamp = fin.getTime();

  if (!xTicks.includes(finTimestamp)) {
    xTicks.push(finTimestamp);
  }

  return xTicks;
}
