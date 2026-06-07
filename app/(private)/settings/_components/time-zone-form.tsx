"use client";

import { useActionState } from "react";

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

import {
  type TimeZoneActionState,
  updateTimeZoneAction,
} from "../_lib/actions";

const initialState: TimeZoneActionState = {
  success: false,
  error: null,
};

type TimeZoneFormProps = {
  timeZone: string;
  timeZones: string[];
};

export function TimeZoneForm({ timeZone, timeZones }: TimeZoneFormProps) {
  const [state, formAction, isPending] = useActionState(
    updateTimeZoneAction,
    initialState,
  );

  return (
    <form action={formAction}>
      <FieldGroup>
        <Field data-invalid={state.error ? true : undefined}>
          <FieldLabel>Time zone</FieldLabel>
          <Select name="timeZone" defaultValue={timeZone}>
            <SelectTrigger className="w-full" aria-invalid={!!state.error}>
              <SelectValue placeholder="Select a time zone" />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectGroup>
                {timeZones.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option.replaceAll("_", " ")}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
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
