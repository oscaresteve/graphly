import "server-only";

import { auth } from "@clerk/nextjs/server";

import { findMetricViewForUser } from "@/lib/metrics/queries";
import { type MetricView } from "@/lib/metrics/types";

export async function loadMetricPageData(
  metricId: string,
): Promise<{ metric: MetricView | null }> {
  const { userId } = await auth.protect();

  return {
    metric: await findMetricViewForUser(metricId, userId),
  };
}
