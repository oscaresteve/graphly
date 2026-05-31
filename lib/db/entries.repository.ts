import { and, asc, eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { entries, metrics } from "@/lib/db/schema";

type EntryRecord = typeof entries.$inferSelect;

export type MetricEntryRecord = Pick<
  EntryRecord,
  "id" | "metricId" | "value" | "date" | "createdAt"
>;

type CreateEntryValues = {
  date: string;
  value: number;
};

export async function listEntriesForMetricForUser(
  metricId: string,
  userId: string,
): Promise<MetricEntryRecord[]> {
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

export async function createEntryForMetricForUser(
  metricId: string,
  userId: string,
  input: CreateEntryValues,
): Promise<EntryRecord | null> {
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
