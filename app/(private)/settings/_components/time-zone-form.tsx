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
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";

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

  useEffect(() => {
    if (state.success) {
      toast.success("Time zone saved");
    }
  }, [state]);

  return (
    <form action={formAction}>
      <Card>
        <CardHeader>
          <CardTitle>Time zone</CardTitle>
          <CardDescription>
            Graphly uses this to determine today and prevent future entries.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Field data-invalid={state.error ? true : undefined}>
              <Combobox
                items={timeZones}
                name="timeZone"
                value={selectedTimeZone}
                onValueChange={setSelectedTimeZone}
                itemToStringLabel={(tz) => tz.label}
                itemToStringValue={(tz) => tz.value}
                isItemEqualToValue={(item, value) =>
                  item.value === value?.value
                }
              >
                <ComboboxInput
                  id="timeZone"
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
            </Field>
          </FieldGroup>
        </CardContent>
        <CardFooter className="justify-between gap-4">
          {state.error ? (
            <FieldError>{state.error}</FieldError>
          ) : state.success ? (
            <FieldDescription>Time zone saved.</FieldDescription>
          ) : (
            <FieldDescription>
              Search by city or country to find your time zone.
            </FieldDescription>
          )}
          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving..." : "Save"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
