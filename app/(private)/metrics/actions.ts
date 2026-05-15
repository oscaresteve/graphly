"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createEntryByMetricIdForUser } from "@/lib/db/entries.repository";
import {
  createMetricForUser,
  deleteMetricForUser,
} from "@/lib/db/metrics.repository";
import { getTodayCalendarDate } from "@/lib/date";

import {
  type CreateEntryActionState,
  validateCreateEntryFormData,
} from "./entry.validation";
import {
  type CreateMetricActionState,
  validateCreateMetricFormData,
  validateDeleteMetricFormData,
} from "./metric.validation";

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

  try {
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
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return {
        success: false,
        fieldErrors: {},
        formError:
          validation.data.date === getTodayCalendarDate()
            ? "There is already an entry for today"
            : "There is already an entry for this date",
      };
    }

    throw error;
  }

  revalidatePath("/metrics");
  revalidatePath(`/metrics/${validation.data.metricId}`);

  return {
    success: true,
    fieldErrors: {},
    formError: null,
  };
}

function isUniqueConstraintError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "23505"
  );
}
