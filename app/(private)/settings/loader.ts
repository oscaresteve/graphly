import "server-only";

import { auth } from "@clerk/nextjs/server";

import { getUserTimeZone } from "@/lib/db/user-preferences.repository";
import { TimeZoneOption } from "./_lib/types";

export async function loadSettingsPageData(): Promise<{
  userTimeZone: TimeZoneOption;
  timeZones: TimeZoneOption[];
}> {
  const { userId } = await auth.protect();

  const rawUserTimeZone = await getUserTimeZone(userId);

  const rawTimeZones = [
    "UTC",
    ...Intl.supportedValuesOf("timeZone").filter(
      (timeZone) => timeZone !== "UTC",
    ),
  ];

  const userTimeZone = {
    value: rawUserTimeZone,
    label: rawUserTimeZone.replaceAll("_", " "),
  };

  const timeZones = rawTimeZones.map((tz) => {
    return {
      value: tz,
      label: tz.replaceAll("_", " "),
    };
  });

  return {
    userTimeZone,
    timeZones,
  };
}
