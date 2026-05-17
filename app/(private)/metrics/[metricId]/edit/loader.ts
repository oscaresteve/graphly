import "server-only";

import { getUnits } from "@/lib/db/units.repository";
import { getMetricForUser } from "@/lib/db/metrics.repository";
import { auth } from "@clerk/nextjs/server";

export async function loadEditMetricPageData({
  metricId,
}: {
  metricId: string;
}) {
  const { userId } = await auth.protect();

  const units = await getUnits();
  const metric = await getMetricForUser(metricId, userId);

  return {
    unitOptions: units.map(({ id, name, symbol }) => ({
      id,
      name,
      symbol,
    })),
    metric,
  };
}
