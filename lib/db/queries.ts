import { asc, desc, eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { metrics, units } from "@/lib/db/schema";
import { type Metric, type Unit, type UserMetric } from "@/lib/db/types";

type CreateMetricValues = {
  name: string;
  description: string | null;
  unitId: string;
};

export async function getMetricsByUserId(
  userId: string,
): Promise<UserMetric[]> {
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

export async function getUnits(): Promise<Unit[]> {
  return db.select().from(units).orderBy(asc(units.name));
}

export async function createMetricByUserId(
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
