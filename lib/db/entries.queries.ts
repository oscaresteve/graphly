import { and, asc, eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { entries, metrics } from "@/lib/db/schema";
import { type Entry, type UserMetricEntry } from "@/lib/db/types";

type CreateEntryValues = {
  date: string;
  value: number;
};

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

export async function createEntryByMetricIdForUser(
  metricId: string,
  userId: string,
  input: CreateEntryValues,
): Promise<Entry | null> {
  const [metric] = await db
    .select({ id: metrics.id })
    .from(metrics)
    .where(and(eq(metrics.id, metricId), eq(metrics.userId, userId)))
    .limit(1);

  if (!metric) {
    return null;
  }

  const [entry] = await db
    .insert(entries)
    .values({
      metricId,
      userId,
      date: input.date,
      value: input.value.toString(),
    })
    .returning();

  return entry;
}
