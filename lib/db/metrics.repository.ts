import { and, desc, eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { entries, metrics, units } from "@/lib/db/schema";

type MetricRecord = typeof metrics.$inferSelect;
type UnitRecord = typeof units.$inferSelect;

export type MetricWithUnitRecord = Pick<
  MetricRecord,
  "id" | "name" | "description" | "createdAt"
> & {
  unit: Pick<UnitRecord, "id" | "name" | "symbol" | "type">;
};

type CreateMetricValues = {
  name: string;
  description: string | null;
  unitId: string;
};

type UpdateMetricValues = {
  name: string;
  description: string | null;
  unitId: string;
};

export async function listMetricsForUser(
  userId: string,
): Promise<MetricWithUnitRecord[]> {
  return db
    .select({
      id: metrics.id,
      name: metrics.name,
      description: metrics.description,
      createdAt: metrics.createdAt,
      unit: {
        id: units.id,
        name: units.name,
        symbol: units.symbol,
        type: units.type,
      },
    })
    .from(metrics)
    .innerJoin(units, eq(metrics.unitId, units.id))
    .where(eq(metrics.userId, userId))
    .orderBy(desc(metrics.createdAt));
}

export async function findMetricForUser(
  metricId: string,
  userId: string,
): Promise<MetricWithUnitRecord | null> {
  const [metric] = await db
    .select({
      id: metrics.id,
      name: metrics.name,
      description: metrics.description,
      createdAt: metrics.createdAt,
      unit: {
        id: units.id,
        name: units.name,
        symbol: units.symbol,
        type: units.type,
      },
    })
    .from(metrics)
    .innerJoin(units, eq(metrics.unitId, units.id))
    .where(and(eq(metrics.id, metricId), eq(metrics.userId, userId)))
    .limit(1);

  return metric ?? null;
}

export async function createMetricForUser(
  userId: string,
  input: CreateMetricValues,
): Promise<MetricRecord> {
  const [metric] = await db
    .insert(metrics)
    .values({
      userId,
      name: input.name,
      description: input.description,
      unitId: input.unitId,
    })
    .returning();

  return metric;
}

export async function updateMetricForUser(
  metricId: string,
  userId: string,
  input: UpdateMetricValues,
): Promise<MetricRecord> {
  const [metric] = await db
    .update(metrics)
    .set({
      name: input.name,
      description: input.description,
      unitId: input.unitId,
    })
    .where(and(eq(metrics.id, metricId), eq(metrics.userId, userId)))
    .returning();

  return metric;
}

export async function deleteMetricForUser(
  metricId: string,
  userId: string,
): Promise<MetricRecord | null> {
  const [metric] = await db
    .delete(metrics)
    .where(and(eq(metrics.id, metricId), eq(metrics.userId, userId)))
    .returning();

  return metric ?? null;
}
