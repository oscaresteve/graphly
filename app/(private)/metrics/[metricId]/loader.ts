import "server-only";

import { auth } from "@clerk/nextjs/server";

import { getMetricWithEntriesForUser } from "@/lib/db/metrics.repository";
import { type UserMetricWithEntriesResponse } from "@/lib/db/types";
import { type CalendarDateString } from "@/lib/date";

export async function loadMetricPageData(
  metricId: string,
): Promise<{ metric: UserMetricWithEntriesResponse | null }> {
  const { userId } = await auth.protect();
  const metric = await getMetricWithEntriesForUser(metricId, userId);

  return {
    metric: metric
      ? {
          ...metric,
          createdAt: metric.createdAt.toISOString(),
          entries: metric.entries.map((entry) => ({
            id: entry.id,
            value: Number(entry.value),
            date: entry.date as CalendarDateString,
          })),
        }
      : null,
  };
}
