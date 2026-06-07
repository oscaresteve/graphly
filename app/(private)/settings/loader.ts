import "server-only";

import { auth } from "@clerk/nextjs/server";

import { getUserTimeZone } from "@/lib/db/user-preferences.repository";

export async function loadSettingsPageData() {
  const { userId } = await auth.protect();

  return {
    timeZone: await getUserTimeZone(userId),
    timeZones: [
      "UTC",
      ...Intl.supportedValuesOf("timeZone").filter(
        (timeZone) => timeZone !== "UTC",
      ),
    ],
  };
}
