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
import { Plus } from "lucide-react";
import Link from "next/link";

import { loadMetricsPageData } from "./loader";
import { MetricCard } from "./_components/metric-card";

export default async function Dashboard() {
  const { metrics, today } = await loadMetricsPageData();

  if (metrics.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Plus />
          </EmptyMedia>
          <EmptyTitle>Create your first metric</EmptyTitle>
          <EmptyDescription>
            Add a metric to start building your daily tracking routine.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button asChild>
            <Link href="/metrics/new">New Metric</Link>
          </Button>
        </EmptyContent>
      </Empty>
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
            today={today}
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
