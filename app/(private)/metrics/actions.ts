"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createMetricByUserId } from "@/lib/db/queries";

import {
  type CreateMetricActionState,
  validateCreateMetricFormData,
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

  await createMetricByUserId(userId, validation.data);

  revalidatePath("/metrics");
  redirect("/metrics");
}
