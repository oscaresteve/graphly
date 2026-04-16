import { getNewMetricPageData } from "../queries";
import { NewMetricForm } from "./new-metric-form";

export default async function NewMetricPage() {
  const { unitOptions } = await getNewMetricPageData();

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <h1 className="text-2xl font-semibold">New Metric</h1>
      <NewMetricForm units={unitOptions} />
    </div>
  );
}
