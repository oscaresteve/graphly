import "server-only";

import { auth } from "@clerk/nextjs/server";

import { getUserTimeZone } from "@/lib/db/user-preferences.repository";
import { getTodayCalendarDate } from "@/lib/date";
import { listDailyMetricViewsForUser } from "@/lib/metrics/queries";

export async function loadDashboardPageData() {
  const { userId } = await auth.protect();
  const timeZone = await getUserTimeZone(userId);
  const today = getTodayCalendarDate(timeZone);

  return {
    metrics: await listDailyMetricViewsForUser(userId, today),
    timeZone,
    today,
  };
}
