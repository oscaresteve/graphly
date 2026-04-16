import "server-only";

import { auth } from "@clerk/nextjs/server";

import { getMetricsByUserId, getUnits } from "@/lib/db/queries";
import { type UserMetricResponse } from "@/lib/db/types";

export async function getUserMetrics(): Promise<UserMetricResponse[]> {
  const { userId } = await auth.protect();
  const userMetrics = await getMetricsByUserId(userId);

  return userMetrics.map((metric) => ({
    ...metric,
    createdAt: metric.createdAt.toISOString(),
  }));
}

export async function getUnitOptions() {
  const units = await getUnits();

  return units.map(({ id, name, symbol }) => ({
    id,
    name,
    symbol,
  }));
}
