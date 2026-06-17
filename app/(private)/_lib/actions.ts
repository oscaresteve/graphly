"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  createEntryForMetricForUser,
  findEntryForUser,
  updateEntryForMetricForUser,
} from "@/lib/db/entries.repository";
import { isUniqueConstraintError } from "@/lib/db/errors";
import {
  createMetricForUser,
  deleteMetricForUser,
  findMetricForUser,
  updateMetricForUser,
} from "@/lib/db/metrics.repository";
import { getUserTimeZone } from "@/lib/db/user-preferences.repository";
import { getTodayCalendarDate } from "@/lib/date";

import {
  type CreateEntryActionState,
  type UpdateEntryActionState,
  validateCreateEntryFormData,
  validateUpdateEntryFormData,
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

  revalidatePath("/");
  redirect("/");
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

  revalidatePath("/");
  redirect("/");
}

export async function createEntryAction(
  _previousState: CreateEntryActionState,
  formData: FormData,
): Promise<CreateEntryActionState> {
  const { userId } = await auth.protect();
  const timeZone = await getUserTimeZone(userId);
  const today = getTodayCalendarDate(timeZone);
  const validation = validateCreateEntryFormData(formData, today);

  if (!validation.success) {
    return {
      success: false,
      fieldErrors: validation.fieldErrors,
      formError: null,
    };
  }

  const metric = await findMetricForUser(validation.data.metricId, userId);

  if (!metric) {
    return {
      success: false,
      fieldErrors: {},
      formError: "Metric not found",
    };
  }

  if (
    metric.unit.type === "integer" &&
    !Number.isInteger(validation.data.value)
  ) {
    return {
      success: false,
      fieldErrors: {
        value: ["Value must be a whole number"],
      },
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
          validation.data.date === today
            ? "There is already an entry for today"
            : "There is already an entry for this date",
      };
    }

    throw error;
  }

  revalidatePath("/");
  revalidatePath("/metrics");
  revalidatePath(`/metrics/${validation.data.metricId}`);

  return {
    success: true,
    fieldErrors: {},
    formError: null,
  };
}

export async function updateEntryAction(
  _previousState: UpdateEntryActionState,
  formData: FormData,
): Promise<UpdateEntryActionState> {
  const { userId } = await auth.protect();
  const validation = validateUpdateEntryFormData(formData);

  if (!validation.success) {
    return {
      success: false,
      fieldErrors: validation.fieldErrors,
      formError: null,
    };
  }

  const entry = await findEntryForUser(validation.data.entryId, userId);

  if (!entry) {
    return {
      success: false,
      fieldErrors: {},
      formError: "Entry not found",
    };
  }

  if (
    entry.unitType === "integer" &&
    !Number.isInteger(validation.data.value)
  ) {
    return {
      success: false,
      fieldErrors: {
        value: ["Value must be a whole number"],
      },
      formError: null,
    };
  }

  const updatedEntry = await updateEntryForMetricForUser(
    validation.data.entryId,
    userId,
    validation.data.value,
  );

  if (!updatedEntry) {
    return {
      success: false,
      fieldErrors: {},
      formError: "Entry not found",
    };
  }

  revalidatePath("/");
  revalidatePath("/metrics");
  revalidatePath(`/metrics/${entry.metricId}`);

  return {
    success: true,
    fieldErrors: {},
    formError: null,
  };
}
