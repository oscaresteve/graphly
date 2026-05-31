import { AppPrimaryAction } from "@/components/app-primary-action";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { LineChart, Plus } from "lucide-react";
import Link from "next/link";

import { loadMetricsPageData } from "./loader";
import { MetricCard } from "./_components/metric-card";

export default async function MetricsPage() {
  const { metrics } = await loadMetricsPageData();

  if (metrics.length === 0) {
    return (
      <>
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <LineChart />
            </EmptyMedia>
            <EmptyTitle>{"You don't have any metrics yet"}</EmptyTitle>
            <EmptyDescription>
              Create your first metric to start tracking daily data.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button asChild>
              <Link href="/metrics/new">
                <Plus data-icon="inline-start" />
                New Metric
              </Link>
            </Button>
          </EmptyContent>
        </Empty>
      </>
    );
  }

  return (
    <>
      <div className="mx-auto flex max-w-2xl flex-col gap-4 pb-20">
        {metrics.map((metric) => (
          <MetricCard
            id={metric.id}
            entries={metric.entries}
            key={metric.id}
            title={metric.name}
            unit={metric.unit}
          />
        ))}
      </div>
      <AppPrimaryAction>
        <Button asChild className="h-11">
          <Link href="/metrics/new" aria-label="New Metric">
            <Plus data-icon="inline-start" />
            New Metric
          </Link>
        </Button>
      </AppPrimaryAction>
    </>
  );
}
