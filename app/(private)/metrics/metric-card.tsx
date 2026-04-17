"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import { type Unit } from "@/lib/db/types";
import { getTodayCalendarDate, type CalendarDateString } from "@/lib/date";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { Line, LineChart } from "recharts";

import { EntryDialogForm } from "./entry-dialog-form";

type MetricCardProps = {
  id: string;
  entries: {
    date: CalendarDateString;
    value: number;
  }[];
  title: string;
  description: string | null;
  unit: {
    symbol: string;
    type: Unit["type"];
    name: string;
  };
};

const previewChartConfig = {
  value: {
    label: "Value",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export function MetricCard({
  id,
  entries,
  title,
  description,
  unit,
}: MetricCardProps) {
  const todayDate = getTodayCalendarDate();
  const todayEntry = entries.find((entry) => entry.date === todayDate);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
        <CardAction>
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
        </CardAction>
      </CardHeader>

      <CardContent>
        {entries.length > 1 ? (
          <ChartContainer
            aria-hidden="true"
            className="pointer-events-none aspect-auto h-10"
            config={previewChartConfig}
          >
            <LineChart data={entries}>
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
          <div className="bg-muted h-10 rounded-md" />
        )}
      </CardContent>

      <CardFooter className="justify-between">
        {todayEntry ? (
          <>
            <p className="text-muted-foreground">Today</p>
            <p className="font-medium tabular-nums">
              {formatValue(todayEntry.value)}
              <span className="text-muted-foreground ml-1 font-normal">
                {unit.symbol}
              </span>
            </p>
          </>
        ) : (
          <>
            <p className="text-muted-foreground">Pending today</p>
            <EntryDialogForm metricId={id} metricName={title} unit={unit} />
          </>
        )}
      </CardFooter>
    </Card>
  );
}

function formatValue(value: number) {
  return new Intl.NumberFormat("en", {
    maximumFractionDigits: 2,
  }).format(value);
}
