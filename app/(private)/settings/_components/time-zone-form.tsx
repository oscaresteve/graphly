"use client";

import { useActionState, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

import {
  type TimeZoneActionState,
  updateTimeZoneAction,
} from "../_lib/actions";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { InputGroupAddon } from "@/components/ui/input-group";
import { GlobeIcon } from "lucide-react";
import { TimeZoneOption } from "../_lib/types";

const initialState: TimeZoneActionState = {
  success: false,
  error: null,
};

type TimeZoneFormProps = {
  userTimeZone: TimeZoneOption;
  timeZones: TimeZoneOption[];
};

export function TimeZoneForm({ userTimeZone, timeZones }: TimeZoneFormProps) {
  const [state, formAction, isPending] = useActionState(
    updateTimeZoneAction,
    initialState,
  );
  const [selectedTimeZone, setSelectedTimeZone] =
    useState<TimeZoneOption | null>(userTimeZone);

  useEffect(() => {
    setSelectedTimeZone(userTimeZone);
  }, [userTimeZone]);

  return (
    <form action={formAction}>
      <FieldGroup>
        <Field data-invalid={state.error ? true : undefined}>
          <FieldLabel>Time zone</FieldLabel>
          <Combobox
            items={timeZones}
            name="timeZone"
            value={selectedTimeZone}
            onValueChange={setSelectedTimeZone}
            isItemEqualToValue={(item, value) => item.value === value.value}
          >
            <ComboboxInput
              placeholder="Select a time zone"
              showClear
              aria-invalid={!!state.error}
            >
              <InputGroupAddon>
                <GlobeIcon />
              </InputGroupAddon>
            </ComboboxInput>
            <ComboboxContent>
              <ComboboxEmpty>No time zones found.</ComboboxEmpty>
              <ComboboxList>
                {(tz) => (
                  <ComboboxItem key={tz.value} value={tz}>
                    {tz.label}
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
          {state.error ? (
            <FieldError>{state.error}</FieldError>
          ) : (
            <FieldDescription>
              Graphly uses this to determine today and prevent future entries.
            </FieldDescription>
          )}
        </Field>
        <Field orientation="horizontal" className="justify-end">
          {state.success ? (
            <p className="text-muted-foreground mr-auto text-sm">
              Time zone saved.
            </p>
          ) : null}
          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving..." : "Save changes"}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
