import "server-only";

import { auth } from "@clerk/nextjs/server";

import { getMetricsWithEntriesForUser } from "@/lib/db/metrics.queries";
import { getUnits } from "@/lib/db/units.queries";
import { type UserMetricWithEntriesResponse } from "@/lib/db/types";
import { type CalendarDateString } from "@/lib/date";

export async function getMetricsPageData(): Promise<{
  metrics: UserMetricWithEntriesResponse[];
}> {
  const { userId } = await auth.protect();
  const userMetrics = await getMetricsWithEntriesForUser(userId);

  return {
    metrics: userMetrics.map((metric) => ({
      ...metric,
      createdAt: metric.createdAt.toISOString(),
      entries: metric.entries.map((entry) => ({
        id: entry.id,
        value: Number(entry.value),
        date: entry.date as CalendarDateString,
      })),
    })),
  };
}

export async function getNewMetricPageData() {
  const units = await getUnits();

  return {
    unitOptions: units.map(({ id, name, symbol }) => ({
      id,
      name,
      symbol,
    })),
  };
}
