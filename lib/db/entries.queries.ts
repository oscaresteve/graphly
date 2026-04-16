import { and, asc, eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { entries, metrics } from "@/lib/db/schema";
import { type UserMetricEntry } from "@/lib/db/types";

export async function getEntriesByMetricIdForUser(
  metricId: string,
  userId: string,
): Promise<UserMetricEntry[]> {
  return db
    .select({
      id: entries.id,
      metricId: entries.metricId,
      value: entries.value,
      date: entries.date,
      createdAt: entries.createdAt,
    })
    .from(entries)
    .innerJoin(metrics, eq(entries.metricId, metrics.id))
    .where(and(eq(metrics.id, metricId), eq(metrics.userId, userId)))
    .orderBy(asc(entries.date));
}
