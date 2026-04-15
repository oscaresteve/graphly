import { z } from "zod";

const createUserMetricSchema = z.object({
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

export function parseCreateUserMetricFormData(
  formData: FormData,
): CreateUserMetricInput {
  const result = createUserMetricSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    unitId: formData.get("unitId"),
  });

  if (!result.success) {
    throw new Error(result.error.issues[0]?.message ?? "Invalid metric data");
  }

  return result.data;
}
