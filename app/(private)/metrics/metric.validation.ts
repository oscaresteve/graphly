import { z } from "zod";

export const createMetricSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Name must be at least 3 characters")
    .max(100, "Name must be 100 characters or fewer"),
  description: z
    .string()
    .trim()
    .max(500, "Description must be 500 characters or fewer")
    .optional(),
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

type CreateMetricValidationResult =
  | {
      success: true;
      data: Omit<z.infer<typeof createMetricSchema>, "description"> & {
        description: string | null;
      };
    }
  | {
      success: false;
      fieldErrors: CreateMetricActionState["fieldErrors"];
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
    data: {
      ...parsed.data,
      description: parsed.data.description || null,
    },
  };
}

const deleteMetricSchema = z.object({
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
