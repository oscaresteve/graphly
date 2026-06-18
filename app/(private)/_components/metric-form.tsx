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
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { Textarea } from "@/components/ui/textarea";
import { type MetricView, type UnitOption } from "@/lib/metrics/types";
import { Plus, Save } from "lucide-react";

import { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import { createMetricAction, updateMetricAction } from "../_lib/actions";
import {
  createInitialActionState,
  type ActionState,
} from "../_lib/action-state";

type CreateMetricField = "name" | "description" | "unitId";
type UpdateMetricField = "metricId" | CreateMetricField;

const initialCreateMetricActionState =
  createInitialActionState<CreateMetricField>();
const initialUpdateMetricActionState =
  createInitialActionState<UpdateMetricField>();

type MetricFormProps =
  | {
      mode: "create";
      metric?: null;
      units: UnitOption[];
    }
  | {
      mode: "update";
      metric: MetricView | null;
      units: UnitOption[];
    };

export function MetricForm({ units, metric, mode }: MetricFormProps) {
  const isUpdateMode = mode === "update";
  const action = isUpdateMode ? updateMetricAction : createMetricAction;
  const initialState = isUpdateMode
    ? initialUpdateMetricActionState
    : initialCreateMetricActionState;

  const metricUnitOption: UnitOption | null = metric ? metric.unit : null;
  const [state, formAction, isPending] = useActionState(action, initialState);
  const [selectedUnitOption, setSelectedUnitOption] =
    useState<UnitOption | null>(metricUnitOption);

  useEffect(() => {
    setSelectedUnitOption(metricUnitOption);
  }, [metricUnitOption]);

  const cancelHref = isUpdateMode && metric ? `/metrics/${metric.id}` : "/";
  const submitLabel = isUpdateMode ? "Save changes" : "Create Metric";
  const pendingLabel = isUpdateMode ? "Saving..." : "Creating...";
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

        {isUpdateMode && (
          <input type="hidden" name="metricId" value={metric?.id} />
        )}

        <Field data-invalid={hasNameErrors}>
          <FieldLabel htmlFor="name">Name</FieldLabel>
          <Input
            id="name"
            name="name"
            defaultValue={metric?.name ?? ""}
            placeholder="Weight, revenue, sleep"
            aria-invalid={hasNameErrors}
          />
          {hasNameErrors ? (
            <FieldError errors={nameErrors} />
          ) : (
            <FieldDescription>
              Use between 3 and 100 characters.
            </FieldDescription>
          )}
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
          <FieldLabel htmlFor="unit">Unit</FieldLabel>

          <Combobox
            items={units}
            name="unitId"
            value={selectedUnitOption}
            onValueChange={setSelectedUnitOption}
            itemToStringLabel={(unit) => `${unit.name} (${unit.symbol})`}
            itemToStringValue={(unit) => unit.id}
            isItemEqualToValue={(item, value) => item.id === value?.id}
          >
            <ComboboxInput
              id="unit"
              placeholder="Select a unit"
              showClear
              aria-invalid={hasUnitErrors}
            />

            <ComboboxContent>
              <ComboboxEmpty>No units found.</ComboboxEmpty>
              <ComboboxList>
                {(unit) => (
                  <ComboboxItem key={unit.id} value={unit}>
                    {unit.name} ({unit.symbol})
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>

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
            {!isUpdateMode ? (
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

function getFieldErrors<TField extends string>(
  state: ActionState<TField>,
  field: TField,
) {
  return state.fieldErrors[field]?.map((message) => ({ message })) ?? [];
}

function hasErrors(errors: ReturnType<typeof getFieldErrors>) {
  return errors.length > 0 ? true : undefined;
}
