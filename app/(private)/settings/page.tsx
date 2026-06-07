import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { TimeZoneForm } from "./_components/time-zone-form";
import { loadSettingsPageData } from "./loader";

export default async function SettingsPage() {
  const { timeZone, timeZones } = await loadSettingsPageData();

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
          <TimeZoneForm timeZone={timeZone} timeZones={timeZones} />
        </CardContent>
      </Card>
    </div>
  );
}
