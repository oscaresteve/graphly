import { z } from "zod";

export const createUserMetricSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(100, "Name must be 100 characters or fewer"),
  description: z
    .preprocess(
      (value) =>
        typeof value === "string" && value.trim() === "" ? undefined : value,
      z
        .string()
        .trim()
        .max(500, "Description must be 500 characters or fewer")
        .optional(),
    )
    .transform((value) => value ?? null),
  unitId: z.string().trim().uuid("Unit is invalid"),
});

export type CreateUserMetricInput = z.infer<typeof createUserMetricSchema>;
export type CreateUserMetricFieldErrors = Partial<
  Record<keyof CreateUserMetricInput, string[]>
>;

export type CreateUserMetricActionState = {
  success: boolean;
  fieldErrors: CreateUserMetricFieldErrors;
  formError: string | null;
};

export const initialCreateUserMetricActionState: CreateUserMetricActionState = {
  success: false,
  fieldErrors: {},
  formError: null,
};

type CreateUserMetricValidationResult =
  | {
      success: true;
      data: CreateUserMetricInput;
    }
  | {
      success: false;
      fieldErrors: CreateUserMetricFieldErrors;
    };

export function validateCreateUserMetricFormData(
  formData: FormData,
): CreateUserMetricValidationResult {
  const parsed = createUserMetricSchema.safeParse({
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
