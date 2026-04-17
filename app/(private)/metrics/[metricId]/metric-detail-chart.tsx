"use client";

import { eachDayOfInterval, subMonths } from "date-fns";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  formatCalendarDate,
  formatLongCalendarDate,
  formatShortCalendarDate,
  type CalendarDateString,
} from "@/lib/date";

type MetricDetailChartProps = {
  entries: {
    date: CalendarDateString;
    value: number;
  }[];
  unitSymbol: string;
  unitName: string;
};

export function MetricDetailChart({
  entries,
  unitSymbol,
  unitName,
}: MetricDetailChartProps) {
  const chartData = getLastMonthChartData(entries, unitSymbol);

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
      <LineChart accessibilityLayer data={chartData}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis
          axisLine={false}
          dataKey="date"
          interval={Math.max(0, Math.floor(chartData.length / 6) - 1)}
          tickFormatter={(value) =>
            formatShortCalendarDate(String(value) as CalendarDateString)
          }
          tickLine={false}
          tickMargin={12}
        />
        <YAxis
          axisLine={false}
          tickFormatter={formatCompactValue}
          tickLine={false}
          tickMargin={8}
          width={40}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              indicator="line"
              labelFormatter={(value) => {
                return formatLongCalendarDate(
                  String(value) as CalendarDateString,
                );
              }}
            />
          }
        />
        <Line
          activeDot={{ r: 5 }}
          connectNulls={true}
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

function getLastMonthChartData(
  entries: MetricDetailChartProps["entries"],
  unitSymbol: string,
) {
  const today = new Date();
  const start = subMonths(today, 1);
  const valueMap = new Map(entries.map((entry) => [entry.date, entry.value]));

  return eachDayOfInterval({ start, end: today }).map((day) => {
    const date = formatCalendarDate(day);

    return {
      date,
      unitSymbol,
      value: valueMap.get(date) ?? null,
    };
  });
}

function formatCompactValue(value: number) {
  return new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}
