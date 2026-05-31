import "server-only";

import { auth } from "@clerk/nextjs/server";

import { listMetricViewsForUser } from "@/lib/metrics/queries";
import { type MetricView } from "@/lib/metrics/types";

export async function loadMetricsPageData(): Promise<{
  metrics: MetricView[];
}> {
  const { userId } = await auth.protect();

  return {
    metrics: await listMetricViewsForUser(userId),
  };
}
