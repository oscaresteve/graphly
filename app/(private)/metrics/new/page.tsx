import { MetricForm } from "../../_components/metric-form";

import { loadNewMetricPageData } from "./loader";

export default async function NewMetricPage() {
  const { unitOptions } = await loadNewMetricPageData();

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4">
      <MetricForm units={unitOptions} mode="create" />
    </div>
  );
}
