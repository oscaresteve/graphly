"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createEntryByMetricIdForUser } from "@/lib/db/entries.queries";
import {
  createMetricForUser,
  deleteMetricForUser,
} from "@/lib/db/metrics.queries";

import {
  type CreateEntryActionState,
  type CreateMetricActionState,
  validateCreateEntryFormData,
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
  redirect("/metrics");
}

export async function createEntryAction(
  _previousState: CreateEntryActionState,
  formData: FormData,
): Promise<CreateEntryActionState> {
  const { userId } = await auth.protect();
  const validation = validateCreateEntryFormData(formData);

  if (!validation.success) {
    return {
      success: false,
      fieldErrors: validation.fieldErrors,
      formError: null,
    };
  }

  const entry = await createEntryByMetricIdForUser(
    validation.data.metricId,
    userId,
    {
      date: validation.data.date,
      value: validation.data.value,
    },
  );

  if (!entry) {
    return {
      success: false,
      fieldErrors: {},
      formError: "Metric not found",
    };
  }

  revalidatePath("/metrics");
  revalidatePath(`/metrics/${validation.data.metricId}`);

  return {
    success: true,
    fieldErrors: {},
    formError: null,
  };
}
