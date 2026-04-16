"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  createMetricForUser,
  deleteMetricForUser,
} from "@/lib/db/metrics.queries";

import {
  type CreateMetricActionState,
  validateCreateMetricFormData,
  validateDeleteMetricFormData,
} from "./validation";

export async function createMetricAction(
  _previousState: CreateMetricActionState,
  formData: FormData,
): Promise<CreateMetricActionState> {
  const { userId } = await auth.protect();
  const validation = validateCreateMetricFormData(formData);

  if (!validation.success) {
    return {
      success: false,
      fieldErrors: validation.fieldErrors,
      formError: null,
    };
  }

  await createMetricForUser(userId, validation.data);

  revalidatePath("/metrics");
  redirect("/metrics");
}

export async function deleteMetricAction(formData: FormData) {
  const { userId } = await auth.protect();
  const validation = validateDeleteMetricFormData(formData);

  if (!validation.success) {
    return;
  }

  await deleteMetricForUser(validation.data.metricId, userId);

  revalidatePath("/metrics");
}
