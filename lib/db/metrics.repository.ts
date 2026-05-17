import { and, desc, eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { getEntriesByMetricIdForUser } from "@/lib/db/entries.repository";
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

type UpdateMetricValues = {
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

export async function getMetricForUser(
  metricId: string,
  userId: string,
): Promise<UserMetric | null> {
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

export async function getMetricWithEntriesForUser(
  metricId: string,
  userId: string,
): Promise<UserMetricWithEntries | null> {
  const metric = await getMetricForUser(metricId, userId);

  if (!metric) {
    return null;
  }

  return {
    ...metric,
    entries: await getEntriesByMetricIdForUser(metric.id, userId),
  };
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

export async function updateMetricForUser(
  metricId: string,
  userId: string,
  input: UpdateMetricValues,
): Promise<Metric> {
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
): Promise<Metric | null> {
  const [metric] = await db
    .delete(metrics)
    .where(and(eq(metrics.id, metricId), eq(metrics.userId, userId)))
    .returning();

  return metric ?? null;
}
