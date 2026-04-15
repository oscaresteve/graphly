import { desc, eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { metrics, units } from "@/lib/db/schema";
import { type UserMetric } from "@/lib/db/types";

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
