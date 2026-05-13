import { z } from "zod";

import { getTodayCalendarDate } from "@/lib/date";

const createTodayEntrySchema = z.object({
  metricId: z.uuid("Metric is invalid"),
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

const createPastEntrySchema = z.object({
  metricId: z.uuid("Metric is invalid"),
  date: z.iso
    .date("Date is invalid")
    .refine((date) => date < getTodayCalendarDate(), {
      message: "Date must be before today",
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

export type CreateEntryActionState = {
  success: boolean;
  fieldErrors: Partial<Record<"metricId" | "date" | "value", string[]>>;
  formError: string | null;
};

export const initialCreateEntryActionState: CreateEntryActionState = {
  success: false,
  fieldErrors: {},
  formError: null,
};

type CreateTodayEntryValidationResult =
  | {
      success: true;
      data: z.infer<typeof createTodayEntrySchema>;
    }
  | {
      success: false;
      fieldErrors: CreateEntryActionState["fieldErrors"];
    };

export function validateCreateTodayEntryFormData(
  formData: FormData,
): CreateTodayEntryValidationResult {
  const parsed = createTodayEntrySchema.safeParse({
    metricId: formData.get("metricId"),
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

type CreatePastEntryValidationResult =
  | {
      success: true;
      data: z.infer<typeof createPastEntrySchema>;
    }
  | {
      success: false;
      fieldErrors: CreateEntryActionState["fieldErrors"];
    };

export function validateCreatePastEntryFormData(
  formData: FormData,
): CreatePastEntryValidationResult {
  const parsed = createPastEntrySchema.safeParse({
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
