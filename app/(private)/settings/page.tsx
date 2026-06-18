import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { TimeZoneForm } from "./_components/time-zone-form";
import { loadSettingsPageData } from "./loader";
import { ColorSchemeToggle } from "@/components/color-scheme-toggle";
import { ThemeToggle } from "@/components/theme-toggle";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";

export default async function SettingsPage() {
  const { userTimeZone, timeZones } = await loadSettingsPageData();

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-muted-foreground text-sm">
          Configure how Graphly handles your daily data.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Daily tracking</CardTitle>
          <CardDescription>
            Your time zone defines when a new tracking day begins.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TimeZoneForm userTimeZone={userTimeZone} timeZones={timeZones} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Appearence</CardTitle>
          <CardDescription>
            Customize the app with predefined themes and dark mode.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Field>
              <FieldLabel>Color scheme</FieldLabel>
              <ColorSchemeToggle />
            </Field>
            <Field>
              <FieldLabel>Theme</FieldLabel>
              <ThemeToggle />
            </Field>
          </FieldGroup>
          <FieldGroup></FieldGroup>
        </CardContent>
      </Card>
    </div>
  );
}
