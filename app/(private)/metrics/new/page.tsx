import { MetricForm } from "@/components/metric-form";

import { loadNewMetricPageData } from "./loader";

export default async function NewMetricPage() {
  const { unitOptions } = await loadNewMetricPageData();

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold">New Metric</h1>
        <p className="text-muted-foreground text-sm">
          Define what you want to track before adding daily values.
        </p>
      </div>
      <MetricForm units={unitOptions} />
    </div>
  );
}
