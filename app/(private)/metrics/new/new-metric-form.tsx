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
import { Plus } from "lucide-react";

import { useActionState } from "react";
import Link from "next/link";
import { createMetricAction } from "../actions";
import {
  initialCreateMetricActionState,
  type CreateMetricActionState,
} from "../metric.validation";

type NewMetricFormProps = {
  units: {
    id: string;
    name: string;
    symbol: string;
  }[];
};

export function NewMetricForm({ units }: NewMetricFormProps) {
  const [state, formAction, isPending] = useActionState(
    createMetricAction,
    initialCreateMetricActionState,
  );
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
          <Select name="unitId" disabled={units.length === 0}>
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

        <Field orientation="horizontal">
          <Button type="submit" disabled={units.length === 0 || isPending}>
            <Plus data-icon="inline-start" />
            {isPending ? "Creating..." : "Create Metric"}
          </Button>
          <Button asChild variant="ghost">
            <Link href="/metrics">Cancel</Link>
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
