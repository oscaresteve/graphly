import { MetricForm } from "@/components/metric-form";
import { loadEditMetricPageData } from "./loader";

type EditMetricPageProps = {
  params: Promise<{ metricId: string }>;
};

export default async function EditMetricPage({ params }: EditMetricPageProps) {
  const { metricId } = await params;

  const { unitOptions, metric } = await loadEditMetricPageData({ metricId });

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold">Edit Metric</h1>
        <p className="text-muted-foreground text-sm">
          Update the details of your metric.
        </p>
      </div>
      <MetricForm units={unitOptions} metric={metric} mode="edit" />
    </div>
  );
}
