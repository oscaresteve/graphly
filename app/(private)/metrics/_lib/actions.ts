"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createEntryForMetricForUser } from "@/lib/db/entries.repository";
import { isUniqueConstraintError } from "@/lib/db/errors";
import {
  createMetricForUser,
  deleteMetricForUser,
  updateMetricForUser,
} from "@/lib/db/metrics.repository";
import { getTodayCalendarDate } from "@/lib/date";

import {
  type CreateEntryActionState,
  validateCreateEntryFormData,
} from "./entry.validation";
import {
  type CreateMetricActionState,
  type UpdateMetricActionState,
  validateCreateMetricFormData,
  validateDeleteMetricFormData,
  validateUpdateMetricFormData,
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

export async function updateMetricAction(
  _previousState: UpdateMetricActionState,
  formData: FormData,
): Promise<UpdateMetricActionState> {
  const { userId } = await auth.protect();
  const validation = validateUpdateMetricFormData(formData);

  if (!validation.success) {
    return {
      success: false,
      fieldErrors: validation.fieldErrors,
      formError: null,
    };
  }

  await updateMetricForUser(validation.data.metricId, userId, validation.data);

  revalidatePath(`/metrics/${validation.data.metricId}`);
  redirect(`/metrics/${validation.data.metricId}`);
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
    const entry = await createEntryForMetricForUser(
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

