"use client";

import { useMemo, useState } from "react";
import { type DateRange } from "react-day-picker";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { Focus, Maximize2 } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { es } from "react-day-picker/locale";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
} from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
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
  type ChartScale,
  formatCustomRangeLabel,
  getChartYDomain,
  getMetricChartData,
  isValidCustomRange,
  resolveChartDateRange,
} from "./metric-detail-chart.utils";
import { useIsMobile } from "@/hooks/use-mobile";

type MetricDetailChartProps = {
  entries: MetricEntryView[];
  unitSymbol: string;
  unitName: string;
  today: CalendarDateString;
};

const RANGE_VALUES = [
  "all-time",
  "last-year",
  "last-month",
  "last-week",
] as const;

const SCALE_VALUES = [
  { value: "auto", icon: Maximize2 },
  { value: "focus", icon: Focus },
] as const;

type RangeOptionValue = (typeof RANGE_VALUES)[number];
type ScaleOptionValue = (typeof SCALE_VALUES)[number]["value"];

export function MetricDetailChart({
  entries,
  unitSymbol,
  unitName,
  today,
}: MetricDetailChartProps) {
  const t = useTranslations("metric-detail-chart");
  const locale = useLocale();

  const rangeOptions = useMemo(
    () =>
      RANGE_VALUES.map((value) => ({
        value,
        label: t(rangeLabelKey(value)),
      })),
    [t],
  );

  const scaleOptions = useMemo(
    () =>
      SCALE_VALUES.map(({ value, icon }) => ({
        value,
        icon,
        label: t(scaleLabelKey(value)),
      })),
    [t],
  );

  const [range, setRange] = useState<ChartRange>("last-month");
  const [customRange, setCustomRange] = useState<ChartDateRange | null>(null);
  const [pickerRange, setPickerRange] = useState<DateRange | undefined>();
  const [isRangePickerOpen, setIsRangePickerOpen] = useState(false);
  const currentDateRange = resolveChartDateRange({
    customRange,
    firstEntryDate: entries[0]?.date,
    range,
    todayDate: today,
  });
  const pendingCustomRange = toChartDateRange(pickerRange);
  const canApplyCustomRange = isValidCustomRange(pendingCustomRange, today);

  const isMobile = useIsMobile();

  function handleRangePickerOpenChange(open: boolean) {
    setIsRangePickerOpen(open);

    if (open) {
      setPickerRange(toPickerDateRange(customRange ?? currentDateRange));
      return;
    }

    setPickerRange(customRange ? toPickerDateRange(customRange) : undefined);
  }

  function applyCustomRange() {
    if (!pendingCustomRange || !canApplyCustomRange) {
      return;
    }

    setCustomRange(pendingCustomRange);
    setRange("custom");
    setIsRangePickerOpen(false);
  }

  return (
    <div className="flex flex-1 flex-col gap-2">
      <div className="no-scrollbar w-full overflow-x-auto">
        <Popover
          open={isRangePickerOpen}
          onOpenChange={handleRangePickerOpenChange}
        >
          <ToggleGroup
            aria-label={t("chartRangeAriaLabel")}
            className="ml-auto min-w-max flex-nowrap"
            onValueChange={(value) => {
              if (value && value !== "custom") {
                setRange(value as RangeOptionValue);
                handleRangePickerOpenChange(false);
              }
            }}
            size="sm"
            variant="outline"
            type="single"
            value={range}
          >
            {rangeOptions.map((option) => (
              <ToggleGroupItem key={option.value} value={option.value}>
                {option.label}
              </ToggleGroupItem>
            ))}
            <PopoverAnchor asChild>
              <ToggleGroupItem
                value="custom"
                onClick={() => handleRangePickerOpenChange(!isRangePickerOpen)}
              >
                {range === "custom" && customRange
                  ? formatCustomRangeLabel(customRange, today, locale)
                  : t("custom")}
              </ToggleGroupItem>
            </PopoverAnchor>
          </ToggleGroup>
          <PopoverContent align="end" className="w-auto">
            <PopoverHeader>
              <PopoverTitle>{t("customRangeTitle")}</PopoverTitle>
              <PopoverDescription>
                {t("customRangeDescription")}
              </PopoverDescription>
            </PopoverHeader>
            <Calendar
              mode="range"
              numberOfMonths={isMobile ? 1 : 2}
              defaultMonth={pickerRange?.from}
              disabled={{ after: parseCalendarDate(today) }}
              selected={pickerRange}
              onSelect={setPickerRange}
              showOutsideDays={false}
              className="w-full"
              locale={locale === "es" ? es : undefined}
            />
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => handleRangePickerOpenChange(false)}
              >
                {t("cancel")}
              </Button>
              <Button
                type="button"
                disabled={!canApplyCustomRange}
                onClick={applyCustomRange}
              >
                {t("apply")}
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <MetricChart
        customRange={customRange}
        entries={entries}
        range={range}
        scaleOptions={scaleOptions}
        unitName={unitName}
        unitSymbol={unitSymbol}
        today={today}
      />
    </div>
  );
}

function MetricChart({
  customRange,
  entries,
  range,
  scaleOptions,
  unitSymbol,
  unitName,
  today,
}: MetricDetailChartProps & {
  customRange: ChartDateRange | null;
  range: ChartRange;
  scaleOptions: {
    value: ScaleOptionValue;
    icon: typeof Focus;
    label: string;
  }[];
}) {
  const t = useTranslations("metric-detail-chart");
  const locale = useLocale();

  const { data, visibleChartData, xDomain, xTicks } = useMemo(
    () => getMetricChartData(entries, unitSymbol, range, customRange, today),
    [entries, unitSymbol, range, customRange, today],
  );
  const focusYDomainLimits = getChartYDomain(data);
  const [focusYDomain, setFocusYDomain] = useState<[number, number] | null>(
    null,
  );
  const [scale, setScale] = useState<ChartScale>("auto");
  const focusYDomainValue =
    focusYDomain &&
    focusYDomainLimits &&
    focusYDomain[0] >= focusYDomainLimits[0] &&
    focusYDomain[1] <= focusYDomainLimits[1]
      ? focusYDomain
      : focusYDomainLimits;

  const yDomain =
    scale === "focus" && focusYDomainValue
      ? focusYDomainValue
      : (["auto", "auto"] as const);

  return (
    <div className="flex gap-2">
      <ChartContainer
        className="aspect-auto h-120 flex-1"
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
                ? t("today")
                : formatShortCalendarDate(
                    formatCalendarDate(new Date(value)),
                    locale,
                  )
            }
            tickLine={true}
            tickMargin={10}
            type="number"
          />
          <YAxis
            axisLine={false}
            domain={yDomain}
            allowDataOverflow
            tickFormatter={(value) => formatCompactMetricValue(value, locale)}
            tickLine={false}
            tickMargin={10}
            width={55}
            tickCount={10}
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                indicator="line"
                labelFormatter={(_value, payload) => {
                  const date = payload[0]?.payload?.date;

                  if (typeof date === "string") {
                    return formatLongCalendarDate(
                      toCalendarDateString(date),
                      locale,
                    );
                  }

                  const timestamp = payload[0]?.payload?.timestamp;

                  if (typeof timestamp === "number") {
                    return formatLongCalendarDate(
                      formatCalendarDate(new Date(timestamp)),
                      locale,
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
              visibleChartData.length === 1
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

      <ChartScaleControls
        domain={focusYDomainLimits}
        focusedDomain={focusYDomainValue}
        onFocusedDomainChange={setFocusYDomain}
        onScaleChange={setScale}
        scale={scale}
        scaleOptions={scaleOptions}
        t={t}
      />
    </div>
  );
}

function ChartScaleControls({
  domain,
  focusedDomain,
  onFocusedDomainChange,
  onScaleChange,
  scale,
  scaleOptions,
  t,
}: {
  domain: [number, number] | null;
  focusedDomain: [number, number] | null;
  onFocusedDomainChange: (domain: [number, number]) => void;
  onScaleChange: (scale: ChartScale) => void;
  scale: ChartScale;
  scaleOptions: {
    value: ScaleOptionValue;
    icon: typeof Focus;
    label: string;
  }[];
  t: ReturnType<typeof useTranslations<"metric-detail-chart">>;
}) {
  return (
    <div className="flex flex-col items-center gap-3 py-2">
      <ToggleGroup
        aria-label={t("chartScaleAriaLabel")}
        onValueChange={(value) => {
          if (value) {
            onScaleChange(value as ScaleOptionValue);
          }
        }}
        orientation="vertical"
        size="sm"
        type="single"
        value={scale}
        variant="outline"
      >
        {scaleOptions.map(({ icon: Icon, label, value }) => (
          <ToggleGroupItem
            aria-label={label}
            key={value}
            value={value}
            disabled={value === "focus" && !domain}
          >
            <Icon />
          </ToggleGroupItem>
        ))}
      </ToggleGroup>

      <Collapsible open={scale === "focus"} className="h-full">
        <CollapsibleContent className="h-full">
          {domain ? (
            <Slider
              aria-label={t("yAxisFocusRangeAriaLabel")}
              max={domain[1]}
              min={domain[0]}
              onValueChange={(value) =>
                onFocusedDomainChange(value as [number, number])
              }
              orientation="vertical"
              step={0.001}
              value={focusedDomain ?? domain}
            />
          ) : null}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}

function rangeLabelKey(
  value: RangeOptionValue,
): "allTime" | "lastYear" | "lastMonth" | "lastWeek" {
  switch (value) {
    case "all-time":
      return "allTime";
    case "last-year":
      return "lastYear";
    case "last-month":
      return "lastMonth";
    case "last-week":
      return "lastWeek";
  }
}

function scaleLabelKey(value: ScaleOptionValue): "auto" | "focus" {
  return value;
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
