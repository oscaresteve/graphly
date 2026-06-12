import "server-only";

import { auth } from "@clerk/nextjs/server";
import {
  findUserTimeZone,
  getUserTimeZone,
} from "@/lib/db/user-preferences.repository";
import { getTodayCalendarDate, type CalendarDateString } from "@/lib/date";
import { listMetricViewsForUser } from "@/lib/metrics/queries";
import { MetricNavigationItem, type MetricView } from "@/lib/metrics/types";
import { listMetricNavigationItemsForUser } from "@/lib/db/metrics.repository";

export async function loadLayoutData(): Promise<{
  metricNavigationItems: MetricNavigationItem[];
  timeZone: string | null;
}> {
  const { userId } = await auth.protect();
  const timeZone = await findUserTimeZone(userId);
  
  return {
    metricNavigationItems: await listMetricNavigationItemsForUser(userId),
    timeZone,
  };
}

export async function loadDashboardPageData(): Promise<{
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
