import { notFound } from "next/navigation";

import { MetricDetailChart } from "../../_components/metric-detail-chart";
import { loadMetricPageData } from "./loader";
import MetricSubbar from "../../_components/metric-subbar";

type MetricPageProps = {
  params: Promise<{
    metricId: string;
  }>;
};

export default async function MetricPage({ params }: MetricPageProps) {
  const { metricId } = await params;
  const { metric, today } = await loadMetricPageData(metricId);

  if (!metric) {
    notFound();
  }

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-4">
      <MetricSubbar metric={metric} today={today} />

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
        unitName={metric.unit.name}
        today={today}
      />
    </div>
  );
}
