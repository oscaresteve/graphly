"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

import {
  initializeUserTimeZone,
  updateUserTimeZone,
} from "@/lib/db/user-preferences.repository";
import { isValidTimeZone } from "@/lib/date";

export type TimeZoneActionState = {
  success: boolean;
  error: string | null;
};

export async function initializeTimeZoneAction(
  timeZone: string,
): Promise<boolean> {
  const { userId } = await auth.protect();

  if (!isValidTimeZone(timeZone)) {
    return false;
  }

  await initializeUserTimeZone(userId, timeZone);
  revalidatePath("/", "layout");

  return true;
}

export async function updateTimeZoneAction(
  _previousState: TimeZoneActionState,
  formData: FormData,
): Promise<TimeZoneActionState> {
  const { userId } = await auth.protect();
  const timeZone = formData.get("timeZone");

  if (typeof timeZone !== "string" || !isValidTimeZone(timeZone)) {
    return {
      success: false,
      error: "Select a valid time zone",
    };
  }

  await updateUserTimeZone(userId, timeZone);
  revalidatePath("/", "layout");

  return {
    success: true,
    error: null,
  };
}
