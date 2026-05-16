"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Save } from "lucide-react";

import { useActionState } from "react";
import Link from "next/link";
import { createMetricAction } from "../app/(private)/metrics/actions";
import {
  initialCreateMetricActionState,
  type CreateMetricActionState,
} from "../app/(private)/metrics/metric.validation";
import { UserMetric } from "@/lib/db/types";

type MetricFormProps =
  | {
      mode: "create";
      metric?: null;
      units: {
        id: string;
        name: string;
        symbol: string;
      }[];
    }
  | {
      mode: "edit";
      metric: UserMetric | null;
      units: {
        id: string;
        name: string;
        symbol: string;
      }[];
    };

export function MetricForm({ units, metric, mode }: MetricFormProps) {
  const [state, formAction, isPending] = useActionState(
    createMetricAction,
    initialCreateMetricActionState,
  );
  const isEditMode = mode === "edit";
  const cancelHref =
    isEditMode && metric ? `/metrics/${metric.id}` : "/metrics";
  const submitLabel = isEditMode ? "Save changes" : "Create Metric";
  const pendingLabel = isEditMode ? "Saving..." : "Creating...";
  const nameErrors = getFieldErrors(state, "name");
  const descriptionErrors = getFieldErrors(state, "description");
  const unitErrors = getFieldErrors(state, "unitId");
  const hasNameErrors = hasErrors(nameErrors);
  const hasDescriptionErrors = hasErrors(descriptionErrors);
  const hasUnitErrors = hasErrors(unitErrors);

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <FieldGroup>
        {state.formError ? <FieldError>{state.formError}</FieldError> : null}

        <Field data-invalid={hasNameErrors}>
          <FieldLabel htmlFor="name">Name</FieldLabel>
          <Input
            id="name"
            name="name"
            defaultValue={metric?.name ?? ""}
            placeholder="Weight, revenue, sleep"
            aria-invalid={hasNameErrors}
          />
          <FieldError errors={nameErrors} />
        </Field>

        <Field data-invalid={hasDescriptionErrors}>
          <FieldLabel htmlFor="description">Description</FieldLabel>
          <Textarea
            id="description"
            name="description"
            defaultValue={metric?.description ?? ""}
            placeholder="What this metric helps you understand"
            aria-invalid={hasDescriptionErrors}
          />
          {hasDescriptionErrors ? (
            <FieldError errors={descriptionErrors} />
          ) : (
            <FieldDescription>
              Optional, but useful when the metric needs context.
            </FieldDescription>
          )}
        </Field>

        <Field
          data-disabled={units.length === 0 ? true : undefined}
          data-invalid={hasUnitErrors}
        >
          <FieldLabel>Unit</FieldLabel>
          <Select
            name="unitId"
            defaultValue={metric?.unit.id}
            disabled={units.length === 0}
          >
            <SelectTrigger className="w-full" aria-invalid={hasUnitErrors}>
              <SelectValue placeholder="Select a unit" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {units.map((unit) => (
                  <SelectItem key={unit.id} value={unit.id}>
                    {unit.name} ({unit.symbol})
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {hasUnitErrors ? (
            <FieldError errors={unitErrors} />
          ) : (
            <FieldDescription>
              This defines how each value will be shown.
            </FieldDescription>
          )}
        </Field>

        <Field orientation="horizontal" className="justify-end">
          <Button asChild variant="outline" disabled={isPending}>
            <Link href={cancelHref}>Cancel</Link>
          </Button>
          <Button type="submit" disabled={units.length === 0 || isPending}>
            {!isEditMode ? (
              <Plus data-icon="inline-start" />
            ) : (
              <Save data-icon="inline-start" />
            )}
            {isPending ? pendingLabel : submitLabel}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}

function getFieldErrors(
  state: CreateMetricActionState,
  field: keyof CreateMetricActionState["fieldErrors"],
) {
  return state.fieldErrors[field]?.map((message) => ({ message })) ?? [];
}

function hasErrors(errors: ReturnType<typeof getFieldErrors>) {
  return errors.length > 0 ? true : undefined;
}
