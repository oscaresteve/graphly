"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

import { initializeTimeZoneAction } from "@/app/(private)/settings/_lib/actions";

type TimeZoneInitializerProps = {
  initialized: boolean;
};

export function TimeZoneInitializer({ initialized }: TimeZoneInitializerProps) {
  const attemptedRef = useRef(false);
  const router = useRouter();

  useEffect(() => {
    if (initialized || attemptedRef.current) {
      return;
    }

    attemptedRef.current = true;
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    void initializeTimeZoneAction(timeZone).then((success) => {
      if (success) {
        router.refresh();
      }
    });
  }, [initialized, router]);

  return null;
}
