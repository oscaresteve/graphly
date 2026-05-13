import { z } from "zod";

const createMetricSchema = z.object({
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

export type CreateMetricActionState = {
  success: boolean;
  fieldErrors: Partial<Record<"name" | "description" | "unitId", string[]>>;
  formError: string | null;
};

export const initialCreateMetricActionState: CreateMetricActionState = {
  success: false,
  fieldErrors: {},
  formError: null,
};

export function validateCreateMetricFormData(formData: FormData) {
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

const deleteMetricSchema = z.object({
  metricId: z.uuid("Metric is invalid"),
});

export function validateDeleteMetricFormData(formData: FormData) {
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
