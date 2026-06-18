import { MetricForm } from "../../../_components/metric-form";
import { loadEditMetricPageData } from "./loader";

type EditMetricPageProps = {
  params: Promise<{ metricId: string }>;
};

export default async function EditMetricPage({ params }: EditMetricPageProps) {
  const { metricId } = await params;

  const { unitOptions, metric } = await loadEditMetricPageData({ metricId });

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4">
      <MetricForm units={unitOptions} metric={metric} mode="update" />
    </div>
  );
}
