import { describe, expect, it } from "vitest";

import { getTodayCalendarDate, isValidTimeZone } from "./date";

describe("getTodayCalendarDate", () => {
  it("uses the requested time zone near midnight", () => {
    const instant = new Date("2026-06-07T00:30:00.000Z");

    expect(getTodayCalendarDate("Europe/Madrid", instant)).toBe("2026-06-07");
    expect(getTodayCalendarDate("America/Los_Angeles", instant)).toBe(
      "2026-06-06",
    );
  });
});

describe("isValidTimeZone", () => {
  it("accepts IANA time zones and rejects invalid values", () => {
    expect(isValidTimeZone("Europe/Madrid")).toBe(true);
    expect(isValidTimeZone("Not/A_Time_Zone")).toBe(false);
  });
});
