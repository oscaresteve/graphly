"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createMetricByUserId, getMetricsByUserId } from "@/lib/db/queries";
import { type UserMetricResponse } from "@/lib/db/types";

import {
  type CreateUserMetricActionState,
  validateCreateUserMetricFormData,
} from "./validation";

export async function getUserMetrics(): Promise<UserMetricResponse[]> {
  const { userId } = await auth.protect();
  const userMetrics = await getMetricsByUserId(userId);

  return userMetrics.map((metric) => ({
    ...metric,
    createdAt: metric.createdAt.toISOString(),
  }));
}

export async function createUserMetric(
  _previousState: CreateUserMetricActionState,
  formData: FormData,
): Promise<CreateUserMetricActionState> {
  const { userId } = await auth.protect();
  const validation = validateCreateUserMetricFormData(formData);

  if (!validation.success) {
    return {
      success: false,
      fieldErrors: validation.fieldErrors,
      formError: null,
    };
  }

  await createMetricByUserId(userId, validation.data);

  revalidatePath("/metrics");
  redirect("/metrics");
}
