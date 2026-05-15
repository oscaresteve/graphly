import { z } from "zod";

import { getTodayCalendarDate } from "@/lib/date";

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

type CreateEntryValidationResult =
  | {
      success: true;
      data: z.infer<typeof createEntrySchema>;
    }
  | {
      success: false;
      fieldErrors: CreateEntryActionState["fieldErrors"];
    };

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
