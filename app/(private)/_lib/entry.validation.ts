import { z } from "zod";

import { type CalendarDateString } from "@/lib/date";

import { type ActionState, type FormValidationResult } from "./action-state";

type CreateEntryField = "metricId" | "date" | "value";
type UpdateEntryField = "entryId" | "value";

const entryValueSchema = z.preprocess(
  (value) => (typeof value === "string" ? value.trim() : value),
  z
    .string("Value is required")
    .min(1, "Value is required")
    .regex(
      /^\d{1,9}(\.\d{1,3})?$/,
      "Value must have up to 9 digits and 3 decimals",
    )
    .transform(Number),
);

export type CreateEntryActionState = ActionState<CreateEntryField>;
export type UpdateEntryActionState = ActionState<UpdateEntryField>;

type CreateEntryValidationResult = FormValidationResult<
  {
    metricId: string;
    date: string;
    value: number;
  },
  CreateEntryField
>;

export function validateCreateEntryFormData(
  formData: FormData,
  today: CalendarDateString,
): CreateEntryValidationResult {
  const createEntrySchema = z.object({
    metricId: z.uuid("Metric is invalid"),
    date: z.iso.date("Date is invalid").refine((date) => date <= today, {
      message: "Date cannot be in the future",
    }),
    value: entryValueSchema,
  });
  const parsed = createEntrySchema.safeParse({
    metricId: formData.get("metricId"),
    date: formData.get("date"),
    value: formData.get("value"),
  });

  if (!parsed.success) {
    return {
      success: false,
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  return {
    success: true,
    data: parsed.data,
  };
}

type UpdateEntryValidationResult = FormValidationResult<
  {
    entryId: string;
    value: number;
  },
  UpdateEntryField
>;

export function validateUpdateEntryFormData(
  formData: FormData,
): UpdateEntryValidationResult {
  const parsed = z
    .object({
      entryId: z.uuid("Entry is invalid"),
      value: entryValueSchema,
    })
    .safeParse({
      entryId: formData.get("entryId"),
      value: formData.get("value"),
    });

  if (!parsed.success) {
    return {
      success: false,
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  return {
    success: true,
    data: parsed.data,
  };
}
