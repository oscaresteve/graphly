import "server-only";

import { auth } from "@clerk/nextjs/server";

import { getUserTimeZone } from "@/lib/db/user-preferences.repository";
import { getTodayCalendarDate, type CalendarDateString } from "@/lib/date";
import { listMetricViewsForUser } from "@/lib/metrics/queries";
import { type MetricView } from "@/lib/metrics/types";

export async function loadMetricsPageData(): Promise<{
  metrics: MetricView[];
  today: CalendarDateString;
}> {
  const { userId } = await auth.protect();
  const timeZone = await getUserTimeZone(userId);

  return {
    metrics: await listMetricViewsForUser(userId),
    today: getTodayCalendarDate(timeZone),
  };
}
