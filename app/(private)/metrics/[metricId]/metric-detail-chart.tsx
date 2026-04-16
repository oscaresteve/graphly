"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

type MetricDetailChartProps = {
  entries: {
    date: string;
    value: number;
  }[];
  unitSymbol: string;
};

const metricChartConfig = {
  value: {
    label: "Value",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export function MetricDetailChart({
  entries,
  unitSymbol,
}: MetricDetailChartProps) {
  return (
    <ChartContainer
      className="aspect-auto h-[62svh] min-h-96 w-full rounded-lg bg-muted/30"
      config={metricChartConfig}
      initialDimension={{ width: 360, height: 520 }}
    >
      <LineChart
        accessibilityLayer
        data={entries}
        margin={{ top: 24, right: 16, bottom: 8, left: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis
          axisLine={false}
          dataKey="date"
          minTickGap={28}
          tickFormatter={formatShortDate}
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
              labelFormatter={(value) => formatLongDate(String(value))}
              formatter={(value) => (
                <span className="font-mono font-medium tabular-nums">
                  {formatValue(Number(value))}
                  <span className="text-muted-foreground ml-1 font-sans font-normal">
                    {unitSymbol}
                  </span>
                </span>
              )}
            />
          }
        />
        <Line
          activeDot={{ r: 5 }}
          dataKey="value"
          dot={entries.length <= 14}
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

function formatShortDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
  }).format(new Date(value));
}

function formatLongDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

function formatCompactValue(value: number) {
  return new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

function formatValue(value: number) {
  return new Intl.NumberFormat("en", {
    maximumFractionDigits: 2,
  }).format(value);
}
