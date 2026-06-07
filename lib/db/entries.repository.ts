import { and, asc, eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { entries, metrics, units } from "@/lib/db/schema";

type EntryRecord = typeof entries.$inferSelect;

export type MetricEntryRecord = Pick<
  EntryRecord,
  "id" | "metricId" | "value" | "date" | "createdAt"
>;

type CreateEntryValues = {
  date: string;
  value: number;
};

export type EntryWithMetricUnitRecord = Pick<
  EntryRecord,
  "id" | "metricId" | "date" | "value"
> & {
  unitType: (typeof units.$inferSelect)["type"];
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

export async function findEntryForUser(
  entryId: string,
  userId: string,
): Promise<EntryWithMetricUnitRecord | null> {
  const [entry] = await db
    .select({
      id: entries.id,
      metricId: entries.metricId,
      date: entries.date,
      value: entries.value,
      unitType: units.type,
    })
    .from(entries)
    .innerJoin(metrics, eq(entries.metricId, metrics.id))
    .innerJoin(units, eq(metrics.unitId, units.id))
    .where(and(eq(entries.id, entryId), eq(metrics.userId, userId)))
    .limit(1);

  return entry ?? null;
}

export async function updateEntryForMetricForUser(
  entryId: string,
  userId: string,
  value: number,
): Promise<EntryRecord | null> {
  const [entry] = await db
    .update(entries)
    .set({ value: value.toString() })
    .where(and(eq(entries.id, entryId), eq(entries.userId, userId)))
    .returning();

  return entry ?? null;
}
