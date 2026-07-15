"use client";

import { useActionState, useEffect, useState } from "react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
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
  const t = useTranslations("time-zone-form");

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
      toast.success(t("toastSaved"));
    }
  }, [state, t]);

  return (
    <form action={formAction}>
      <Card>
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
          <CardDescription>{t("description")}</CardDescription>
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
                  placeholder={t("placeholder")}
                  showClear
                  aria-invalid={!!state.error}
                >
                  <InputGroupAddon>
                    <GlobeIcon />
                  </InputGroupAddon>
                </ComboboxInput>
                <ComboboxContent>
                  <ComboboxEmpty>{t("comboboxEmpty")}</ComboboxEmpty>
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
            <FieldDescription>{t("savedDescription")}</FieldDescription>
          ) : (
            <FieldDescription>{t("helperText")}</FieldDescription>
          )}
          <Button type="submit" disabled={isPending}>
            {isPending ? t("saving") : t("save")}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
