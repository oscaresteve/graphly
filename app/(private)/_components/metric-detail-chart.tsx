"use client";

import { useMemo, useState } from "react";
import { type DateRange } from "react-day-picker";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import { AppSubbar } from "@/components/app-subbar";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
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

import {
  type ChartDateRange,
  type ChartRange,
  formatCustomRangeLabel,
  getChartDomain,
  getChartTicks,
  isValidCustomRange,
  resolveChartDateRange,
} from "./metric-detail-chart.utils";

type MetricDetailChartProps = {
  entries: MetricEntryView[];
  unitSymbol: string;
  unitName: string;
  today: CalendarDateString;
};

const chartRanges = [
  { value: "all-time", label: "All time" },
  { value: "last-year", label: "Last year" },
  { value: "last-month", label: "Last month" },
  { value: "last-week", label: "Last week" },
] as const;

type PresetChartRange = (typeof chartRanges)[number]["value"];

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
  const [customRange, setCustomRange] = useState<ChartDateRange | null>(null);
  const [draftRange, setDraftRange] = useState<DateRange | undefined>();
  const [customRangeOpen, setCustomRangeOpen] = useState(false);
  const currentDateRange = resolveChartDateRange({
    customRange,
    firstEntryDate: entries[0]?.date,
    range,
    todayDate: today,
  });
  const draftChartRange = toChartDateRange(draftRange);
  const canApplyCustomRange = isValidCustomRange(draftChartRange, today);

  function handleCustomRangeOpenChange(open: boolean) {
    setCustomRangeOpen(open);

    if (open) {
      setDraftRange(toPickerDateRange(customRange ?? currentDateRange));
      return;
    }

    setDraftRange(customRange ? toPickerDateRange(customRange) : undefined);
  }

  function applyCustomRange() {
    if (!draftChartRange || !canApplyCustomRange) {
      return;
    }

    setCustomRange(draftChartRange);
    setRange("custom");
    setCustomRangeOpen(false);
  }

  return (
    <div className="flex flex-col gap-3">
      <AppSubbar
        right={
          <Popover
            open={customRangeOpen}
            onOpenChange={handleCustomRangeOpenChange}
          >
            <ToggleGroup
              aria-label="Chart range"
              onValueChange={(value) => {
                if (value && value !== "custom") {
                  setRange(value as PresetChartRange);
                  handleCustomRangeOpenChange(false);
                }
              }}
              size="sm"
              variant="outline"
              type="single"
              value={range}
            >
              {chartRanges.map((chartRange) => (
                <ToggleGroupItem
                  key={chartRange.value}
                  value={chartRange.value}
                >
                  {chartRange.label}
                </ToggleGroupItem>
              ))}
              <PopoverTrigger asChild>
                <ToggleGroupItem value="custom">
                  {range === "custom" && customRange
                    ? formatCustomRangeLabel(customRange, today)
                    : "Custom"}
                </ToggleGroupItem>
              </PopoverTrigger>
            </ToggleGroup>
            <PopoverContent align="end" className="w-auto p-2.5">
              <PopoverHeader>
                <PopoverTitle>Custom range</PopoverTitle>
                <PopoverDescription>
                  Choose the dates to display in the chart.
                </PopoverDescription>
              </PopoverHeader>
              <Calendar
                mode="range"
                numberOfMonths={2}
                defaultMonth={draftRange?.from}
                disabled={{ after: parseCalendarDate(today) }}
                selected={draftRange}
                onSelect={setDraftRange}
                showOutsideDays={false}
              />
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => handleCustomRangeOpenChange(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  disabled={!canApplyCustomRange}
                  onClick={applyCustomRange}
                >
                  Apply
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        }
      />

      <MetricRangeChart
        customRange={customRange}
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
  customRange,
  entries,
  range,
  unitSymbol,
  unitName,
  today,
}: MetricDetailChartProps & {
  customRange: ChartDateRange | null;
  range: ChartRange;
}) {
  const { data, visibleEntryCount, xDomain, xTicks } = useMemo(
    () => getChartData(entries, unitSymbol, range, customRange, today),
    [entries, unitSymbol, range, customRange, today],
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
            value === parseCalendarDate(today).getTime()
              ? "Today"
              : formatShortCalendarDate(formatCalendarDate(new Date(value)))
          }
          tickLine={true}
          tickMargin={6}
          type="number"
        />
        <YAxis
          axisLine={false}
          tickFormatter={formatCompactMetricValue}
          tickLine={false}
          tickMargin={6}
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
          activeDot={{
            r: 4,
            strokeWidth: 2,
            stroke: "var(--color-value)",
            fill: "var(--color-background)",
          }}
          dataKey="value"
          dot={
            visibleEntryCount === 1
              ? {
                  r: 3,
                  strokeWidth: 2,
                  stroke: "var(--color-value)",
                  fill: "var(--color-background)",
                }
              : false
          }
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
  customRange: ChartDateRange | null,
  todayDateString: CalendarDateString,
) {
  const dateRange = resolveChartDateRange({
    customRange,
    firstEntryDate: entries[0]?.date,
    range,
    todayDate: todayDateString,
  });

  const data = entries.map(
    (entry): ChartDatum => ({
      date: entry.date,
      timestamp: parseCalendarDate(entry.date).getTime(),
      unitSymbol,
      value: entry.value,
    }),
  );

  const visibleEntryCount = entries.filter(
    (entry) =>
      entry.date >= dateRange.startDate && entry.date <= dateRange.endDate,
  ).length;

  return {
    data,
    visibleEntryCount,
    xDomain: getChartDomain(dateRange),
    xTicks: getChartTicks(dateRange, range),
  };
}

function toChartDateRange(range: DateRange | undefined): ChartDateRange | null {
  if (!range?.from) {
    return null;
  }

  return {
    startDate: formatCalendarDate(range.from),
    endDate: formatCalendarDate(range.to ?? range.from),
  };
}

function toPickerDateRange(range: ChartDateRange): DateRange {
  return {
    from: parseCalendarDate(range.startDate),
    to: parseCalendarDate(range.endDate),
  };
}
