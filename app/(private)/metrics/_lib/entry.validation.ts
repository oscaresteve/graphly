import { z } from "zod";

import { getTodayCalendarDate } from "@/lib/date";

import { type ActionState, type FormValidationResult } from "./action-state";

type CreateEntryField = "metricId" | "date" | "value";

const createEntrySchema = z.object({
  metricId: z.uuid("Metric is invalid"),
  date: z.iso
    .date("Date is invalid")
    .refine((date) => date <= getTodayCalendarDate(), {
      message: "Date cannot be in the future",
    }),
  value: z.preprocess(
    (value) => (typeof value === "string" ? value.trim() : value),
    z
      .string("Value is required")
      .min(1, "Value is required")
      .regex(
        /^\d{1,9}(\.\d{1,3})?$/,
        "Value must have up to 9 digits and 3 decimals",
      )
      .transform(Number),
  ),
});

export type CreateEntryActionState = ActionState<CreateEntryField>;

type CreateEntryValidationResult = FormValidationResult<
  z.infer<typeof createEntrySchema>,
  CreateEntryField
>;

export function validateCreateEntryFormData(
  formData: FormData,
): CreateEntryValidationResult {
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
