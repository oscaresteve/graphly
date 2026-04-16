"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import { Trash } from "lucide-react";
import { Line, LineChart } from "recharts";

import { deleteMetricAction } from "./actions";

type MetricCardProps = {
  entries: {
    date: string;
    value: number;
  }[];
  id: string;
  title: string;
  description: string | null;
};

const previewChartConfig = {
  value: {
    label: "Value",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export function MetricCard({
  entries,
  id,
  title,
  description,
}: MetricCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="truncate">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
        <CardAction>
          <form action={deleteMetricAction}>
            <input type="hidden" name="metricId" value={id} />
            <Button aria-label="Delete metric" size="icon" variant="outline">
              <Trash />
            </Button>
          </form>
        </CardAction>
      </CardHeader>
      <CardContent>
        <ChartContainer className="aspect-10/2" config={previewChartConfig}>
          <LineChart accessibilityLayer data={entries}>
            <Line
              dataKey="value"
              dot={false}
              stroke="var(--color-value)"
              strokeWidth={2}
              type="linear"
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
