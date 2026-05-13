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

type UnitOption = {
  id: string;
  name: string;
  symbol: string;
};

type NewMetricFormProps = {
  units: UnitOption[];
};

export function NewMetricForm({ units }: NewMetricFormProps) {
  const [state, formAction, isPending] = useActionState(
    createMetricAction,
    initialCreateMetricActionState,
  );
  const defaultUnitId = units[0]?.id;
  const nameErrors = getFieldErrors(state, "name");
  const descriptionErrors = getFieldErrors(state, "description");
  const unitErrors = getFieldErrors(state, "unitId");

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <FieldGroup>
        {state.formError ? <FieldError>{state.formError}</FieldError> : null}

        <Field data-invalid={hasErrors(nameErrors) ? true : undefined}>
          <FieldLabel htmlFor="name">Name</FieldLabel>
          <Input
            id="name"
            name="name"
            placeholder="Weight, revenue, sleep"
            aria-invalid={hasErrors(nameErrors) ? true : undefined}
          />
          <FieldError errors={nameErrors} />
        </Field>

        <Field data-invalid={hasErrors(descriptionErrors) ? true : undefined}>
          <FieldLabel htmlFor="description">Description</FieldLabel>
          <Textarea
            id="description"
            name="description"
            placeholder="What this metric helps you understand"
            aria-invalid={hasErrors(descriptionErrors) ? true : undefined}
          />
          {hasErrors(descriptionErrors) ? (
            <FieldError errors={descriptionErrors} />
          ) : (
            <FieldDescription>
              Optional, but useful when the metric needs context.
            </FieldDescription>
          )}
        </Field>

        <Field
          data-disabled={units.length === 0 ? true : undefined}
          data-invalid={hasErrors(unitErrors) ? true : undefined}
        >
          <FieldLabel>Unit</FieldLabel>
          <Select
            name="unitId"
            defaultValue={defaultUnitId}
            disabled={units.length === 0}
          >
            <SelectTrigger
              className="w-full"
              aria-invalid={hasErrors(unitErrors) ? true : undefined}
            >
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
          {hasErrors(unitErrors) ? (
            <FieldError errors={unitErrors} />
          ) : (
            <FieldDescription>
              This defines how each value will be shown.
            </FieldDescription>
          )}
        </Field>
      </FieldGroup>

      <div className="flex flex-col gap-2">
        <Button
          type="submit"
          className="h-11"
          disabled={units.length === 0 || isPending}
        >
          <Plus data-icon="inline-start" />
          {isPending ? "Creating..." : "Create Metric"}
        </Button>
        <Button asChild variant="ghost">
          <Link href="/metrics">Cancel</Link>
        </Button>
      </div>
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
  return errors.length > 0;
}
