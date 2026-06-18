import { TimeZoneForm } from "./_components/time-zone-form";
import { loadSettingsPageData } from "./loader";
import { ColorSchemeToggle } from "@/components/color-scheme-toggle";
import { ThemeToggle } from "@/components/theme-toggle";

export default async function SettingsPage() {
  const { userTimeZone, timeZones } = await loadSettingsPageData();

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4">
      <TimeZoneForm userTimeZone={userTimeZone} timeZones={timeZones} />
      <ColorSchemeToggle />
      <ThemeToggle />
    </div>
  );
}
