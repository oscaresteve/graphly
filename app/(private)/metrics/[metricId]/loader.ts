import "server-only";

import { auth } from "@clerk/nextjs/server";

import { getUserTimeZone } from "@/lib/db/user-preferences.repository";
import { getTodayCalendarDate, type CalendarDateString } from "@/lib/date";
import { findMetricViewForUser } from "@/lib/metrics/queries";
import { type MetricView } from "@/lib/metrics/types";

export async function loadMetricPageData(
  metricId: string,
): Promise<{ metric: MetricView | null; today: CalendarDateString }> {
  const { userId } = await auth.protect();
  const timeZone = await getUserTimeZone(userId);

  return {
    metric: await findMetricViewForUser(metricId, userId),
    today: getTodayCalendarDate(timeZone),
  };
}
