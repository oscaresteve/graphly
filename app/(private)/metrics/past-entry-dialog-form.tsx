"use client";

import { useActionState, useRef, useState } from "react";
import { CalendarIcon, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { type Unit } from "@/lib/db/types";
import {
  formatCalendarDate,
  getTodayCalendarDate,
  parseCalendarDate,
  type CalendarDateString,
} from "@/lib/date";

import { createPastEntryAction } from "./actions";
import {
  initialCreateEntryActionState,
  type CreateEntryActionState,
} from "./validation";

type PastEntryDialogFormProps = {
  entryDates: CalendarDateString[];
  metricId: string;
  metricName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  unit: {
    name: string;
    type: Unit["type"];
  };
};

export function PastEntryDialogForm({
  entryDates,
  metricId,
  metricName,
  onOpenChange,
  open,
  unit,
}: PastEntryDialogFormProps) {
  const todayDate = getTodayCalendarDate();
  const today = parseCalendarDate(todayDate);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(
    getDefaultPastDate(entryDates, today),
  );
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, isPending] = useActionState(
    async (
      previousState: CreateEntryActionState,
      formData: FormData,
    ): Promise<CreateEntryActionState> => {
      const nextState = await createPastEntryAction(previousState, formData);

      if (nextState.success) {
        onOpenChange(false);
        setDatePickerOpen(false);
        setSelectedDate(getDefaultPastDate(entryDates, today));
        formRef.current?.reset();
      }

      return nextState;
    },
    initialCreateEntryActionState,
  );
  const inputConfig = getInputConfig(unit.type);
  const dateErrors = getFieldErrors(state, "date");
  const hasDateErrors = dateErrors.length > 0;
  const valueErrors = getFieldErrors(state, "value");
  const hasValueErrors = valueErrors.length > 0;
  const selectedCalendarDate = formatCalendarDate(selectedDate);
  const disabledDates = [
    today,
    { after: today },
    ...entryDates.map((entryDate) => parseCalendarDate(entryDate)),
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{metricName}</DialogTitle>
        </DialogHeader>

        <form ref={formRef} action={formAction} className="flex flex-col gap-4">
          <input type="hidden" name="metricId" value={metricId} />
          <input type="hidden" name="date" value={selectedCalendarDate} />

          <FieldGroup>
            {state.formError ? (
              <FieldError>{state.formError}</FieldError>
            ) : null}

            <Field data-invalid={hasDateErrors ? true : undefined}>
              <FieldLabel className="text-muted-foreground text-xs font-medium tracking-normal uppercase">
                Date
              </FieldLabel>
              <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    aria-invalid={hasDateErrors ? true : undefined}
                    className="justify-start"
                  >
                    <CalendarIcon data-icon="inline-start" />
                    {formatPickerDate(selectedDate)}
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    disabled={disabledDates}
                    onSelect={(date) => {
                      if (date) {
                        setSelectedDate(date);
                        setDatePickerOpen(false);
                      }
                    }}
                  />
                </PopoverContent>
              </Popover>
              {hasDateErrors ? (
                <FieldError errors={dateErrors} />
              ) : (
                <FieldDescription>Choose a previous date.</FieldDescription>
              )}
            </Field>

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

function formatPickerDate(value: Date) {
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(value);
}

function getDefaultPastDate(
  entryDates: CalendarDateString[],
  today: Date,
): Date {
  const entryDateSet = new Set(entryDates);
  const date = new Date(today);

  for (let index = 0; index < 366; index += 1) {
    date.setDate(date.getDate() - 1);

    if (!entryDateSet.has(formatCalendarDate(date))) {
      return new Date(date);
    }
  }

  return date;
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
