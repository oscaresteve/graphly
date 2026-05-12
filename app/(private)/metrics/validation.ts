import { z } from "zod";
import { getTodayCalendarDate } from "@/lib/date";

export const createMetricSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(100, "Name must be 100 characters or fewer"),
  description: z
    .preprocess(
      (value) =>
        value === null || (typeof value === "string" && value.trim() === "")
          ? undefined
          : value,
      z
        .string()
        .trim()
        .max(500, "Description must be 500 characters or fewer")
        .optional(),
    )
    .transform((value) => value ?? null),
  unitId: z.uuid("Unit is invalid"),
});

export type CreateMetricInput = z.infer<typeof createMetricSchema>;

export type CreateMetricFieldErrors = Partial<
  Record<keyof CreateMetricInput, string[]>
>;

export type CreateMetricActionState = {
  success: boolean;
  fieldErrors: CreateMetricFieldErrors;
  formError: string | null;
};

export const initialCreateMetricActionState: CreateMetricActionState = {
  success: false,
  fieldErrors: {},
  formError: null,
};

type CreateMetricValidationResult =
  | {
      success: true;
      data: CreateMetricInput;
    }
  | {
      success: false;
      fieldErrors: CreateMetricFieldErrors;
    };

export function validateCreateMetricFormData(
  formData: FormData,
): CreateMetricValidationResult {
  const parsed = createMetricSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    unitId: formData.get("unitId"),
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

export const deleteMetricSchema = z.object({
  metricId: z.uuid("Metric is invalid"),
});

type DeleteMetricValidationResult =
  | {
      success: true;
      data: z.infer<typeof deleteMetricSchema>;
    }
  | {
      success: false;
    };

export function validateDeleteMetricFormData(
  formData: FormData,
): DeleteMetricValidationResult {
  const parsed = deleteMetricSchema.safeParse({
    metricId: formData.get("metricId"),
  });

  if (!parsed.success) {
    return {
      success: false,
    };
  }

  return {
    success: true,
    data: parsed.data,
  };
}

const entryMetricIdSchema = z.uuid("Metric is invalid");

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

export const createTodayEntrySchema = z.object({
  metricId: entryMetricIdSchema,
  value: entryValueSchema,
});

export const createPastEntrySchema = z.object({
  metricId: entryMetricIdSchema,
  date: z
    .iso.date("Date is invalid")
    .refine((date) => date < getTodayCalendarDate(), {
      message: "Date must be before today",
    }),
  value: entryValueSchema,
});

export type CreateTodayEntryInput = z.infer<typeof createTodayEntrySchema>;
export type CreatePastEntryInput = z.infer<typeof createPastEntrySchema>;
export type CreateEntryInput = CreateTodayEntryInput | CreatePastEntryInput;

export type CreateEntryFieldErrors = Partial<
  Record<"metricId" | "date" | "value", string[]>
>;

export type CreateEntryActionState = {
  success: boolean;
  fieldErrors: CreateEntryFieldErrors;
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
      data: CreateTodayEntryInput;
    }
  | {
      success: false;
      fieldErrors: CreateEntryFieldErrors;
    };

export function validateCreateTodayEntryFormData(
  formData: FormData,
): CreateEntryValidationResult {
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
      data: CreatePastEntryInput;
    }
  | {
      success: false;
      fieldErrors: CreateEntryFieldErrors;
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
