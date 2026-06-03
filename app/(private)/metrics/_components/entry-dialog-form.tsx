"use client";

import {
  useActionState,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { CalendarIcon, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  formatCalendarDate,
  getTodayCalendarDate,
  parseCalendarDate,
  type CalendarDateString,
} from "@/lib/date";
import { type UnitType } from "@/lib/metrics/types";

import { createEntryAction } from "../_lib/actions";
import {
  createInitialActionState,
  type ActionState,
} from "../_lib/action-state";
import { type CreateEntryActionState } from "../_lib/entry.validation";

const initialCreateEntryActionState =
  createInitialActionState<"metricId" | "date" | "value">();

type EntryDialogFormProps = {
  entryDates?: CalendarDateString[];
  metricId: string;
  metricName: string;
  mode: "custom-date" | "today";
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
  trigger?: ReactNode;
  unit: {
    name: string;
    type: UnitType;
  };
};

export function EntryDialogForm({
  entryDates = [],
  metricId,
  metricName,
  mode,
  onOpenChange,
  open,
  trigger,
  unit,
}: EntryDialogFormProps) {
  const todayDate = getTodayCalendarDate();
  const today = parseCalendarDate(todayDate);
  const defaultCustomDate = useMemo(
    () => getDefaultCustomDate(entryDates, parseCalendarDate(todayDate)),
    [entryDates, todayDate],
  );
  const [internalOpen, setInternalOpen] = useState(false);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const isCustomDateEntry = mode === "custom-date";
  const dialogOpen = open ?? internalOpen;
  const selectedCustomDate = selectedDate ?? defaultCustomDate;

  function setDialogOpen(nextOpen: boolean) {
    if (onOpenChange) {
      onOpenChange(nextOpen);
      return;
    }

    setInternalOpen(nextOpen);
  }

  const [state, formAction, isPending] = useActionState(
    async (
      previousState: CreateEntryActionState,
      formData: FormData,
    ): Promise<CreateEntryActionState> => {
      const nextState = await createEntryAction(previousState, formData);

      if (nextState.success) {
        setDialogOpen(false);
        setDatePickerOpen(false);
        setSelectedDate(null);
        formRef.current?.reset();
      }

      return nextState;
    },
    initialCreateEntryActionState,
  );
  const inputConfig = getInputConfig(unit.type);
  const dateErrors = getFieldErrors(state, "date");
  const hasDateErrors = hasErrors(dateErrors);
  const valueErrors = getFieldErrors(state, "value");
  const hasValueErrors = hasErrors(valueErrors);
  const selectedCalendarDate = isCustomDateEntry
    ? formatCalendarDate(selectedCustomDate)
    : todayDate;
  const disabledDates = [
    { after: today },
    ...entryDates.map((entryDate) => parseCalendarDate(entryDate)),
  ];

  function handleOpenChange(nextOpen: boolean) {
    setDialogOpen(nextOpen);

    if (!nextOpen) {
      setDatePickerOpen(false);
      setSelectedDate(null);
    }
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
      {trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : null}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{metricName}</DialogTitle>
          <DialogDescription>
            {isCustomDateEntry
              ? "Create a new entry for an available date."
              : "Create a new entry for today."}
          </DialogDescription>
        </DialogHeader>

        <form ref={formRef} action={formAction} className="flex flex-col gap-4">
          <input type="hidden" name="metricId" value={metricId} />
          <input type="hidden" name="date" value={selectedCalendarDate} />

          <FieldGroup>
            {state.formError ? (
              <FieldError>{state.formError}</FieldError>
            ) : null}

            {isCustomDateEntry ? (
              <Field data-invalid={hasDateErrors}>
                <FieldLabel className="text-muted-foreground text-xs font-medium tracking-normal uppercase">
                  Date
                </FieldLabel>
                <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      aria-invalid={hasDateErrors}
                      className="justify-start"
                    >
                      <CalendarIcon data-icon="inline-start" />
                      {formatPickerDate(selectedCustomDate)}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align="start" className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={selectedCustomDate}
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
                  <FieldDescription>Choose an available date.</FieldDescription>
                )}
              </Field>
            ) : null}

            <Field data-invalid={hasValueErrors}>
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

function getFieldErrors<TField extends string>(
  state: ActionState<TField>,
  field: TField,
) {
  return state.fieldErrors[field]?.map((message) => ({ message })) ?? [];
}

function hasErrors(errors: ReturnType<typeof getFieldErrors>) {
  return errors.length > 0 ? true : undefined;
}

function formatPickerDate(value: Date) {
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(value);
}

function getDefaultCustomDate(
  entryDates: CalendarDateString[],
  today: Date,
): Date {
  const entryDateSet = new Set(entryDates);
  const date = new Date(today);

  while (entryDateSet.has(formatCalendarDate(date))) {
    date.setDate(date.getDate() - 1);
  }

  return date;
}

function getInputConfig(type: UnitType): {
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
