import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getMetricPageData } from "../queries";
import { MetricDetailChart } from "./metric-detail-chart";
import { AppSubbar } from "@/components/app-subbar";

type MetricPageProps = {
  params: Promise<{
    metricId: string;
  }>;
};

export default async function MetricPage({ params }: MetricPageProps) {
  const { metricId } = await params;
  const { metric } = await getMetricPageData(metricId);

  if (!metric) {
    notFound();
  }

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-4">
      <AppSubbar
        left={
          <Button asChild variant="ghost" size="sm">
            <Link href="/metrics">
              <ArrowLeft data-icon="inline-start" />
              Back
            </Link>
          </Button>
        }
      />

      <div className="flex flex-col">
        <p className="text-muted-foreground text-xs font-medium tracking-normal uppercase">
          {metric.unit.name}
        </p>
        <h1 className="text-2xl font-semibold">{metric.name}</h1>
        {metric.description ? (
          <p className="text-muted-foreground">{metric.description}</p>
        ) : null}
      </div>
      <MetricDetailChart
        entries={metric.entries}
        unitSymbol={metric.unit.symbol}
      />
    </div>
  );
}
