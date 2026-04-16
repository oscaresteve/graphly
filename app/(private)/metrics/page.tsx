import { AppSubbar } from "@/components/app-subbar";
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

import { getMetricsPageData } from "./queries";
import { MetricCard } from "./metric-card";

export default async function MetricsPage() {
  const { metrics } = await getMetricsPageData();

  if (metrics.length === 0) {
    return (
      <>
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <LineChart />
            </EmptyMedia>
            <EmptyTitle>You dont have any metrics yet</EmptyTitle>
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
      <AppSubbar
        right={
          <Button asChild>
            <Link href="/metrics/new">
              <Plus data-icon="inline-start" />
              New Metric
            </Link>
          </Button>
        }
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {metrics.map((metric) => (
          <MetricCard
            entries={metric.entries}
            id={metric.id}
            key={metric.id}
            title={metric.name}
          />
        ))}
      </div>
    </>
  );
}
