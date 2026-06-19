"use client";

import {
  useActionState,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { CalendarIcon, Plus, Save } from "lucide-react";

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
  parseCalendarDate,
  type CalendarDateString,
} from "@/lib/date";
import { type MetricEntryView, type UnitType } from "@/lib/metrics/types";

import { createEntryAction, updateEntryAction } from "../_lib/actions";
import {
  createInitialActionState,
  type ActionState,
} from "../_lib/action-state";
import {
  type CreateEntryActionState,
  type UpdateEntryActionState,
} from "../_lib/entry.validation";

type EntryActionField = "date" | "entryId" | "metricId" | "value";

const initialEntryActionState = createInitialActionState<EntryActionField>();

type EntryDialogIntent =
  | {
      type: "create-past";
    }
  | {
      type: "create-today";
    }
  | {
      type: "edit-today";
      entry: Pick<MetricEntryView, "id" | "value">;
    }
  | {
      type: "edit-past";
      entries: MetricEntryView[];
    };

type EntryDialogFormProps = {
  entryDates?: CalendarDateString[];
  intent: EntryDialogIntent;
  metricId: string;
  metricName: string;
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
  today: CalendarDateString;
  trigger?: ReactNode;
  unit: {
    name: string;
    type: UnitType;
  };
};

export function EntryDialogForm({
  entryDates = [],
  intent,
  metricId,
  metricName,
  onOpenChange,
  open,
  today: todayDate,
  trigger,
  unit,
}: EntryDialogFormProps) {
  const today = parseCalendarDate(todayDate);
  const defaultPastDate = useMemo(
    () => getDefaultPastDate(entryDates, parseCalendarDate(todayDate)),
    [entryDates, todayDate],
  );
  const [internalOpen, setInternalOpen] = useState(false);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showActionState, setShowActionState] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const isPastEntry = intent.type === "create-past";
  const isEditEntry = intent.type === "edit-today";
  const isEditPastEntry = intent.type === "edit-past";
  const dialogOpen = open ?? internalOpen;
  const selectedPastDate =
    selectedDate ??
    (isEditPastEntry && entryDates.length > 0
      ? parseCalendarDate(entryDates[entryDates.length - 1])
      : defaultPastDate);

  function setDialogOpen(nextOpen: boolean) {
    if (onOpenChange) {
      onOpenChange(nextOpen);
      return;
    }

    setInternalOpen(nextOpen);
  }

  const [state, formAction, isPending] = useActionState<
    ActionState<EntryActionField>,
    FormData
  >(
    async (
      previousState: ActionState<EntryActionField>,
      formData: FormData,
    ): Promise<ActionState<EntryActionField>> => {
      const nextState =
        isEditEntry || isEditPastEntry
          ? await updateEntryAction(
              previousState as UpdateEntryActionState,
              formData,
            )
          : await createEntryAction(
              previousState as CreateEntryActionState,
              formData,
            );

      if (nextState.success) {
        setDialogOpen(false);
        setDatePickerOpen(false);
        setSelectedDate(null);
        setShowActionState(false);
        formRef.current?.reset();
      } else {
        setShowActionState(true);
      }

      return nextState;
    },
    initialEntryActionState,
  );
  const displayState = showActionState ? state : initialEntryActionState;
  const inputConfig = getInputConfig(unit.type);
  const dateErrors = getFieldErrors(displayState, "date");
  const hasDateErrors = hasErrors(dateErrors);
  const valueErrors = getFieldErrors(displayState, "value");
  const hasValueErrors = hasErrors(valueErrors);
  const selectedCalendarDate =
    isPastEntry || isEditPastEntry
      ? formatCalendarDate(selectedPastDate)
      : todayDate;
  const selectedPastEntry =
    isEditPastEntry && intent.entries.length > 0
      ? intent.entries.find((entry) => entry.date === selectedCalendarDate)
      : undefined;
  const disabledDates = isEditPastEntry
    ? (date: Date) =>
        !entryDates.some(
          (entryDate) =>
            parseCalendarDate(entryDate).toString() === date.toString(),
        )
    : [
        today,
        { after: today },
        ...entryDates.map((entryDate) => parseCalendarDate(entryDate)),
      ];

  function handleOpenChange(nextOpen: boolean) {
    setDialogOpen(nextOpen);

    if (!nextOpen) {
      setDatePickerOpen(false);
      setSelectedDate(null);
      setShowActionState(false);
    }
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
      {trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : null}
      <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>{metricName}</DialogTitle>
          <DialogDescription>
            {isPastEntry
              ? "Create a new entry for a previous date."
              : isEditPastEntry
                ? "Update a previous date's entry."
                : isEditEntry
                  ? "Update today's entry."
                  : "Create a new entry for today."}
          </DialogDescription>
        </DialogHeader>

        <form ref={formRef} action={formAction} className="flex flex-col gap-4">
          {isEditEntry ? (
            <input type="hidden" name="entryId" value={intent.entry.id} />
          ) : isEditPastEntry ? (
            <input
              type="hidden"
              name="entryId"
              value={selectedPastEntry?.id ?? ""}
            />
          ) : (
            <>
              <input type="hidden" name="metricId" value={metricId} />
              <input type="hidden" name="date" value={selectedCalendarDate} />
            </>
          )}

          <FieldGroup>
            {displayState.formError ? (
              <FieldError>{displayState.formError}</FieldError>
            ) : null}

            {isPastEntry || isEditPastEntry ? (
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
                      {formatPickerDate(selectedPastDate)}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align="start" className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={selectedPastDate}
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
            ) : null}

            <Field data-invalid={hasValueErrors}>
              <FieldLabel
                htmlFor={`entry-value-${metricId}-${intent.type}`}
                className="text-muted-foreground text-xs font-medium tracking-normal uppercase"
              >
                {unit.name}
              </FieldLabel>
              <Input
                key={isEditPastEntry ? selectedPastEntry?.id : intent.type}
                id={`entry-value-${metricId}-${intent.type}`}
                name="value"
                type="number"
                inputMode={inputConfig.inputMode}
                min={0}
                max={inputConfig.max}
                step={inputConfig.step}
                defaultValue={
                  isEditEntry
                    ? intent.entry.value
                    : isEditPastEntry
                      ? selectedPastEntry?.value
                      : undefined
                }
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
              {isEditEntry || isEditPastEntry ? (
                <Save data-icon="inline-start" />
              ) : (
                <Plus data-icon="inline-start" />
              )}
              {isPending
                ? "Saving..."
                : isEditEntry || isEditPastEntry
                  ? "Save changes"
                  : "Save entry"}
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

function getDefaultPastDate(
  entryDates: CalendarDateString[],
  today: Date,
): Date {
  const entryDateSet = new Set(entryDates);
  const date = new Date(today);

  date.setDate(date.getDate() - 1);

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
