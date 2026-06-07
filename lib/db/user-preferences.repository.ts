import "server-only";

import { eq } from "drizzle-orm";
import { cache } from "react";

import { db } from "@/lib/db";
import { userPreferences } from "@/lib/db/schema";
import { defaultTimeZone } from "@/lib/date";

export const findUserTimeZone = cache(async function findUserTimeZone(
  userId: string,
): Promise<string | null> {
  const [preferences] = await db
    .select({ timeZone: userPreferences.timeZone })
    .from(userPreferences)
    .where(eq(userPreferences.userId, userId))
    .limit(1);

  return preferences?.timeZone ?? null;
});

export async function getUserTimeZone(userId: string): Promise<string> {
  return (await findUserTimeZone(userId)) ?? defaultTimeZone;
}

export async function initializeUserTimeZone(
  userId: string,
  timeZone: string,
): Promise<void> {
  await db
    .insert(userPreferences)
    .values({ userId, timeZone })
    .onConflictDoNothing({ target: userPreferences.userId });
}

export async function updateUserTimeZone(
  userId: string,
  timeZone: string,
): Promise<void> {
  await db
    .insert(userPreferences)
    .values({ userId, timeZone })
    .onConflictDoUpdate({
      target: userPreferences.userId,
      set: {
        timeZone,
        updatedAt: new Date(),
      },
    });
}
