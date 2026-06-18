import { AppPrimaryAction } from "@/components/app-primary-action";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { loadDashboardPageData } from "./loader";
import { MetricCard } from "./_components/metric-card";
import MetricsEmptyState from "./_components/metrics-empty-state";

export default async function Dashboard() {
  const { metrics, today } = await loadDashboardPageData();
  const hasMetrics = metrics.length > 0;

  if (!hasMetrics) {
    return <MetricsEmptyState />;
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
