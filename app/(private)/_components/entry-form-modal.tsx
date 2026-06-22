"use client";

import {
  useActionState,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  CalendarIcon,
  ChevronDown,
  Loader2,
  Lock,
  Plus,
  Save,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ResponsiveDialog } from "@/components/responsive-dialog";
import { cn } from "@/lib/utils";
import {
  formatCalendarDate,
  parseCalendarDate,
  type CalendarDateString,
} from "@/lib/date";
import {
  type MetricEntryView,
  type MetricUnitView,
  type UnitType,
} from "@/lib/metrics/types";
import type { Matcher } from "react-day-picker";

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

type EntryFormModalProps = {
  entryDates?: CalendarDateString[];
  intent: EntryDialogIntent;
  metricId: string;
  metricName: string;
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
  today: CalendarDateString;
  trigger?: ReactNode;
  unit: MetricUnitView;
};

export function EntryFormModal({
  entryDates = [],
  intent,
  metricId,
  metricName,
  onOpenChange,
  open,
  today: todayDate,
  trigger,
  unit,
}: EntryFormModalProps) {
  const formId = useId();
  const calendarButtonId = useId();
  const today = parseCalendarDate(todayDate);

  const isEdit = intent.type === "edit-today" || intent.type === "edit-past";
  const isTodayMode =
    intent.type === "create-today" || intent.type === "edit-today";
  const isPastMode =
    intent.type === "create-past" || intent.type === "edit-past";

  const editableDates =
    intent.type === "edit-past"
      ? intent.entries.map((entry) => entry.date)
      : entryDates;
  const noEditableEntries =
    intent.type === "edit-past" && editableDates.length === 0;

  const defaultPastDate = useMemo(
    () => getDefaultPastDate(entryDates, parseCalendarDate(todayDate)),
    [entryDates, todayDate],
  );

  const [internalOpen, setInternalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [showActionState, setShowActionState] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const dialogOpen = open ?? internalOpen;

  function setDialogOpen(nextOpen: boolean) {
    if (onOpenChange) {
      onOpenChange(nextOpen);
      return;
    }
    setInternalOpen(nextOpen);
  }

  const selectedDateObj = isTodayMode
    ? today
    : (selectedDate ??
      (intent.type === "edit-past" && editableDates.length > 0
        ? parseCalendarDate(editableDates[editableDates.length - 1])
        : defaultPastDate));
  const selectedCalendarDate = formatCalendarDate(selectedDateObj);

  const editingEntry =
    intent.type === "edit-today"
      ? intent.entry
      : intent.type === "edit-past"
        ? intent.entries.find((entry) => entry.date === selectedCalendarDate)
        : undefined;

  const canSubmit = !isEdit || Boolean(editingEntry);

  const disabledDates: Matcher | Matcher[] =
    intent.type === "edit-past"
      ? (date: Date) =>
          !editableDates.some(
            (entryDate) =>
              parseCalendarDate(entryDate).toString() === date.toString(),
          )
      : [
          { after: today },
          ...entryDates.map((entryDate) => parseCalendarDate(entryDate)),
        ];

  const [state, formAction, isPending] = useActionState<
    ActionState<EntryActionField>,
    FormData
  >(
    async (
      previousState: ActionState<EntryActionField>,
      formData: FormData,
    ): Promise<ActionState<EntryActionField>> => {
      const nextState = isEdit
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
        setSelectedDate(null);
        setCalendarOpen(false);
        setShowActionState(false);
      } else {
        setShowActionState(true);
      }

      return nextState;
    },
    initialEntryActionState,
  );

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
    }
  }, [state]);

  const displayState = showActionState ? state : initialEntryActionState;
  const inputConfig = getInputConfig(unit.type);
  const dateErrors = getFieldErrors(displayState, "date");
  const hasDateErrors = hasErrors(dateErrors);
  const valueErrors = getFieldErrors(displayState, "value");
  const hasValueErrors = hasErrors(valueErrors);

  function handleOpenChange(nextOpen: boolean) {
    setDialogOpen(nextOpen);

    if (!nextOpen) {
      setSelectedDate(null);
      setCalendarOpen(false);
      setShowActionState(false);
    }
  }

  return (
    <ResponsiveDialog
      description={getDialogDescription(intent.type)}
      footer={
        <>
          <Button
            type="button"
            variant="outline"
            onClick={() => setDialogOpen(false)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form={formId}
            disabled={isPending || !canSubmit}
          >
            {isPending ? (
              <Loader2 className="animate-spin" data-icon="inline-start" />
            ) : isEdit ? (
              <Save data-icon="inline-start" />
            ) : (
              <Plus data-icon="inline-start" />
            )}
            {isPending ? "Saving..." : isEdit ? "Save changes" : "Save entry"}
          </Button>
        </>
      }
      onOpenChange={handleOpenChange}
      open={dialogOpen}
      title={metricName}
      trigger={trigger}
    >
      <form id={formId} ref={formRef} action={formAction}>
        {isEdit ? (
          <input type="hidden" name="entryId" value={editingEntry?.id ?? ""} />
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

          <Field data-invalid={hasDateErrors}>
            <FieldLabel
              htmlFor={isTodayMode ? `date-input-${formId}` : calendarButtonId}
              className="text-muted-foreground text-xs font-medium tracking-normal uppercase"
            >
              Date
            </FieldLabel>

            {isTodayMode ? (
              <div className="relative">
                <CalendarIcon
                  className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
                  aria-hidden="true"
                />
                <Input
                  id={`date-input-${formId}`}
                  type="text"
                  value={formatPickerDate(today)}
                  disabled
                  readOnly
                  aria-invalid={hasDateErrors}
                  className="pr-9 pl-9"
                />
                <Lock
                  className="text-muted-foreground pointer-events-none absolute top-1/2 right-3 size-3.5 -translate-y-1/2"
                  aria-hidden="true"
                />
              </div>
            ) : (
              <>
                <div className="border-input dark:bg-input/30 rounded-lg border bg-transparent">
                  <button
                    id={calendarButtonId}
                    type="button"
                    onClick={() => setCalendarOpen((isOpen) => !isOpen)}
                    disabled={noEditableEntries}
                    aria-expanded={calendarOpen}
                    aria-haspopup="dialog"
                    aria-label={`Fecha seleccionada: ${formatPickerDate(selectedDateObj)}. Pulsa para ${calendarOpen ? "cerrar" : "abrir"} el calendario`}
                    className={cn(
                      "flex h-8 w-full min-w-0 items-center gap-2 px-3 text-base transition-colors outline-none md:text-sm",
                      calendarOpen && "border-input border-b",
                    )}
                  >
                    <CalendarIcon
                      className="text-muted-foreground size-4 shrink-0"
                      aria-hidden="true"
                    />
                    <span className="flex-1 text-left">
                      {formatPickerDate(selectedDateObj)}
                    </span>
                    <span className="flex items-center gap-2">
                      {isPastMode && editingEntry ? (
                        <span className="text-muted-foreground truncate text-xs">
                          {editingEntry.value} {unit.symbol}
                        </span>
                      ) : null}
                      <ChevronDown
                        className={cn(
                          "text-muted-foreground size-4 shrink-0 transition-transform",
                          calendarOpen && "rotate-180",
                        )}
                        aria-hidden="true"
                      />
                    </span>
                  </button>

                  {noEditableEntries ? (
                    <p className="text-muted-foreground px-3 py-6 text-center text-sm">
                      No previous entries to edit yet.
                    </p>
                  ) : calendarOpen ? (
                    <div>
                      <Calendar
                        mode="single"
                        selected={selectedDateObj}
                        defaultMonth={selectedDateObj}
                        disabled={disabledDates}
                        captionLayout="dropdown"
                        onSelect={(date) => {
                          if (date) {
                            setSelectedDate(date);
                            setCalendarOpen(false);
                          }
                        }}
                        className="w-full bg-transparent"
                      />
                    </div>
                  ) : null}
                </div>
              </>
            )}

            {hasDateErrors ? (
              <FieldError errors={dateErrors} />
            ) : (
              <FieldDescription>
                {getDateFieldDescription(intent.type)}
              </FieldDescription>
            )}
          </Field>

          <Field data-invalid={hasValueErrors}>
            <FieldLabel
              htmlFor={`entry-value-${metricId}-${intent.type}`}
              className="text-muted-foreground text-xs font-medium tracking-normal uppercase"
            >
              {unit.name}
            </FieldLabel>
            <div className="relative">
              <Input
                key={editingEntry?.id ?? selectedCalendarDate}
                id={`entry-value-${metricId}-${intent.type}`}
                name="value"
                type="number"
                inputMode={inputConfig.inputMode}
                min={0}
                max={inputConfig.max}
                step={inputConfig.step}
                defaultValue={editingEntry?.value}
                placeholder={inputConfig.placeholder}
                aria-invalid={hasValueErrors}
                className="pr-13"
              />
              <span
                className="text-muted-foreground pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs uppercase"
                aria-hidden="true"
              >
                {unit.symbol}
              </span>
            </div>
            {hasValueErrors ? (
              <FieldError errors={valueErrors} />
            ) : (
              <FieldDescription>{inputConfig.description}</FieldDescription>
            )}
          </Field>
        </FieldGroup>
      </form>
    </ResponsiveDialog>
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

function getDialogDescription(type: EntryDialogIntent["type"]): string {
  switch (type) {
    case "create-past":
      return "Create a new entry for a previous date.";
    case "edit-past":
      return "Update a previous date's entry.";
    case "edit-today":
      return "Update today's entry.";
    case "create-today":
      return "Create a new entry for today.";
  }
}

function getDateFieldDescription(type: EntryDialogIntent["type"]): string {
  switch (type) {
    case "create-past":
      return "Tap to choose a different date.";
    case "edit-past":
      return "Tap to choose which entry to edit.";
    case "edit-today":
    case "create-today":
      return "Entries are recorded for today's date.";
  }
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
