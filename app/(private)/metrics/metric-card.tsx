"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import { Line, LineChart } from "recharts";

type MetricCardProps = {
  entries: {
    date: string;
    value: number;
  }[];
  title: string;
};

const previewChartConfig = {
  value: {
    label: "Value",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export function MetricCard({ entries, title }: MetricCardProps) {
  return (
    <Card className="rounded-lg">
      <CardHeader>
        <CardTitle className="truncate">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-muted/50 rounded-lg">
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
        </div>
      </CardContent>
    </Card>
  );
}
