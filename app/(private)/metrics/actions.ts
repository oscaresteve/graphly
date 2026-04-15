"use server";

import { auth } from "@clerk/nextjs/server";

import { getMetricsByUserId } from "@/lib/db/queries";
import { type UserMetricResponse } from "@/lib/db/types";

export async function getUserMetrics(): Promise<UserMetricResponse[]> {
  const { userId } = await auth.protect();
  const userMetrics = await getMetricsByUserId(userId);

  return userMetrics.map((metric) => ({
    ...metric,
    createdAt: metric.createdAt.toISOString(),
  }));
}
