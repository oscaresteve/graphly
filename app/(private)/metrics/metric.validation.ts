import { z } from "zod";

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
