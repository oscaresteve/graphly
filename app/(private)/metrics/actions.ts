"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createMetricByUserId, getMetricsByUserId } from "@/lib/db/queries";
import { type UserMetricResponse } from "@/lib/db/types";

import { parseCreateUserMetricFormData } from "./validation";

export async function getUserMetrics(): Promise<UserMetricResponse[]> {
  const { userId } = await auth.protect();
  const userMetrics = await getMetricsByUserId(userId);

  return userMetrics.map((metric) => ({
    ...metric,
    createdAt: metric.createdAt.toISOString(),
  }));
}

export async function createUserMetric(formData: FormData): Promise<void> {
  const { userId } = await auth.protect();
  const metricInput = parseCreateUserMetricFormData(formData);

  await createMetricByUserId(userId, metricInput);

  revalidatePath("/metrics");
  redirect("/metrics");
}
