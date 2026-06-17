import "server-only";

import { auth } from "@clerk/nextjs/server";
import {
  findMetricViewForUser,
  listUnitOptions,
} from "@/lib/metrics/queries";
import { type MetricView, type UnitOption } from "@/lib/metrics/types";

export async function loadEditMetricPageData({
  metricId,
}: {
  metricId: string;
}): Promise<{ metric: MetricView | null; unitOptions: UnitOption[] }> {
  const { userId } = await auth.protect();

  return {
    metric: await findMetricViewForUser(metricId, userId),
    unitOptions: await listUnitOptions(),
  };
}
