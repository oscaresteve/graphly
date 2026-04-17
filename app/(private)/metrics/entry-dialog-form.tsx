"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { type Unit } from "@/lib/db/types";
import { getTodayCalendarDate } from "@/lib/date";
import { Plus } from "lucide-react";
import { useActionState } from "react";

import { createEntryAction } from "./actions";
import {
  initialCreateEntryActionState,
  type CreateEntryActionState,
} from "./validation";

type EntryDialogFormProps = {
  metricId: string;
  metricName: string;
  unit: {
    name: string;
    type: Unit["type"];
  };
};

export function EntryDialogForm({
  metricId,
  metricName,
  unit,
}: EntryDialogFormProps) {
  const [state, formAction, isPending] = useActionState(
    createEntryAction,
    initialCreateEntryActionState,
  );
  const todayDate = getTodayCalendarDate();
  const inputConfig = getInputConfig(unit.type);
  const valueErrors = getFieldErrors(state, "value");
  const hasValueErrors = valueErrors.length > 0;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button type="button">
          <Plus data-icon="inline-start" />
          Log today
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{metricName}</DialogTitle>
        </DialogHeader>

        <form action={formAction} className="flex flex-col gap-4">
          <input type="hidden" name="metricId" value={metricId} />
          <input type="hidden" name="date" value={todayDate} />

          <FieldGroup>
            {state.formError ? (
              <FieldError>{state.formError}</FieldError>
            ) : null}

            <Field data-invalid={hasValueErrors ? true : undefined}>
              <FieldLabel
                htmlFor={`entry-value-${metricId}`}
                className="text-muted-foreground text-xs font-medium tracking-normal uppercase"
              >
                {unit.name}
              </FieldLabel>
              <Input
                id={`entry-value-${metricId}`}
                name="value"
                type="number"
                inputMode={inputConfig.inputMode}
                min={0}
                max={inputConfig.max}
                step={inputConfig.step}
                placeholder={`123${unit.type === "decimal" ? ".456" : ""}`}
                aria-invalid={hasValueErrors ? true : undefined}
              />
              {hasValueErrors ? (
                <FieldError errors={valueErrors} />
              ) : (
                <FieldDescription>{inputConfig.description}</FieldDescription>
              )}
            </Field>
          </FieldGroup>

          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              <Plus data-icon="inline-start" />
              {isPending ? "Saving..." : "Save entry"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function getFieldErrors(
  state: CreateEntryActionState,
  field: keyof CreateEntryActionState["fieldErrors"],
) {
  return state.fieldErrors[field]?.map((message) => ({ message })) ?? [];
}

function getInputConfig(type: Unit["type"]): {
  description: string;
  inputMode: "decimal" | "numeric";
  max: number;
  step: string;
} {
  if (type === "integer") {
    return {
      description: "Use a whole number.",
      inputMode: "numeric",
      max: 999999999,
      step: "1",
    };
  }

  return {
    description: "Decimals are allowed.",
    inputMode: "decimal",
    max: 999999999.999,
    step: "0.001",
  };
}
