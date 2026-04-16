import { and, desc, eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { getEntriesByMetricIdForUser } from "@/lib/db/entries.queries";
import { metrics, units } from "@/lib/db/schema";
import {
  type Metric,
  type UserMetric,
  type UserMetricWithEntries,
} from "@/lib/db/types";

type CreateMetricValues = {
  name: string;
  description: string | null;
  unitId: string;
};

export async function getMetricsForUser(userId: string): Promise<UserMetric[]> {
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

export async function getMetricsWithEntriesForUser(
  userId: string,
): Promise<UserMetricWithEntries[]> {
  const userMetrics = await getMetricsForUser(userId);

  return Promise.all(
    userMetrics.map(async (metric) => ({
      ...metric,
      entries: await getEntriesByMetricIdForUser(metric.id, userId),
    })),
  );
}

export async function createMetricForUser(
  userId: string,
  input: CreateMetricValues,
): Promise<Metric> {
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

export async function deleteMetricForUser(
  metricId: string,
  userId: string,
): Promise<Metric | null> {
  const [metric] = await db
    .delete(metrics)
    .where(and(eq(metrics.id, metricId), eq(metrics.userId, userId)))
    .returning();

  return metric ?? null;
}
