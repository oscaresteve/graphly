"use client";

import { useActionState, useRef, useState } from "react";
import { type Unit } from "@/lib/db/types";
import { createTodayEntryAction } from "./actions";
import {
  initialCreateEntryActionState,
  type CreateEntryActionState,
} from "./entry.validation";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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

type TodayEntryDialogFormProps = {
  disabled: boolean;
  metricId: string;
  metricName: string;
  unit: {
    name: string;
    type: Unit["type"];
  };
};

export function TodayEntryDialogForm({
  disabled,
  metricId,
  metricName,
  unit,
}: TodayEntryDialogFormProps) {
  const [open, setOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, isPending] = useActionState(
    async (
      previousState: CreateEntryActionState,
      formData: FormData,
    ): Promise<CreateEntryActionState> => {
      const nextState = await createTodayEntryAction(previousState, formData);

      if (nextState.success) {
        setOpen(false);
        formRef.current?.reset();
      }

      return nextState;
    },
    initialCreateEntryActionState,
  );
  const inputConfig = getInputConfig(unit.type);
  const valueErrors = getFieldErrors(state, "value");
  const hasValueErrors = hasErrors(valueErrors);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" disabled={disabled}>
          <Plus data-icon="inline-start" />
          Log today
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{metricName}</DialogTitle>
          <DialogDescription>
            Create a new entry for today.
          </DialogDescription>
        </DialogHeader>

        <form ref={formRef} action={formAction} className="flex flex-col gap-4">
          <input type="hidden" name="metricId" value={metricId} />

          <FieldGroup>
            {state.formError ? (
              <FieldError>{state.formError}</FieldError>
            ) : null}

            <Field data-invalid={hasValueErrors}>
              <FieldLabel htmlFor={`entry-value-${metricId}`}>
                {metricName}
              </FieldLabel>
              <Input
                id={`entry-value-${metricId}`}
                name="value"
                type="number"
                inputMode={inputConfig.inputMode}
                min={0}
                max={inputConfig.max}
                step={inputConfig.step}
                placeholder={inputConfig.placeholder}
                aria-invalid={hasValueErrors}
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

function hasErrors(errors: ReturnType<typeof getFieldErrors>) {
  return errors.length > 0 ? true : undefined;
}

function getInputConfig(type: Unit["type"]): {
  description: string;
  placeholder: string;
  inputMode: "decimal" | "numeric";
  max: number;
  step: string;
} {
  if (type === "integer") {
    return {
      description: "Use a whole number.",
      placeholder: "123",
      inputMode: "numeric",
      max: 999999999,
      step: "1",
    };
  }

  return {
    description: "Decimals are allowed.",
    placeholder: "123.456",
    inputMode: "decimal",
    max: 999999999.999,
    step: "0.001",
  };
}
