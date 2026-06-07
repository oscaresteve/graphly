import { describe, expect, it } from "vitest";

import { toCalendarDateString } from "@/lib/date";

import {
  formatCustomRangeLabel,
  getChartDomain,
  getChartTicks,
  isValidCustomRange,
  resolveChartDateRange,
  type ChartDateRange,
  type ChartRange,
} from "./metric-detail-chart.utils";

const today = toCalendarDateString("2026-06-07");

describe("resolveChartDateRange", () => {
  it.each([
    ["last-week", "2026-06-01"],
    ["last-month", "2026-05-07"],
    ["last-year", "2025-06-07"],
  ] satisfies [ChartRange, string][])(
    "resolves the %s preset",
    (range, expectedStart) => {
      expect(
        resolveChartDateRange({
          customRange: null,
          range,
          todayDate: today,
        }),
      ).toEqual({
        startDate: expectedStart,
        endDate: today,
      });
    },
  );

  it("uses the first entry for all time", () => {
    expect(
      resolveChartDateRange({
        customRange: null,
        firstEntryDate: toCalendarDateString("2024-01-15"),
        range: "all-time",
        todayDate: today,
      }),
    ).toEqual({
      startDate: "2024-01-15",
      endDate: today,
    });
  });

  it("uses the applied custom range even before the first entry", () => {
    const customRange = range("2023-12-20", "2024-01-03");

    expect(
      resolveChartDateRange({
        customRange,
        firstEntryDate: toCalendarDateString("2024-01-15"),
        range: "custom",
        todayDate: today,
      }),
    ).toEqual(customRange);
  });
});

describe("custom range validation", () => {
  it("rejects incomplete, reversed, and future ranges", () => {
    expect(isValidCustomRange(null, today)).toBe(false);
    expect(isValidCustomRange(range("2026-06-07", "2026-06-06"), today)).toBe(
      false,
    );
    expect(isValidCustomRange(range("2026-06-07", "2026-06-08"), today)).toBe(
      false,
    );
    expect(isValidCustomRange(range("2026-06-01", "2026-06-07"), today)).toBe(
      true,
    );
  });
});

describe("chart domain and ticks", () => {
  it("pads a single-day domain by half a day and keeps one tick", () => {
    const singleDay = range("2026-06-07", "2026-06-07");
    const timestamp = new Date("2026-06-07T00:00:00").getTime();

    expect(getChartDomain(singleDay)).toEqual([
      timestamp - 43_200_000,
      timestamp + 43_200_000,
    ]);
    expect(getChartTicks(singleDay, "custom")).toEqual([timestamp]);
  });

  it("generates adaptive custom ticks including both endpoints", () => {
    const ticks = getChartTicks(range("2026-05-01", "2026-06-07"), "custom");

    expect(ticks).toHaveLength(7);
    expect(ticks[0]).toBe(new Date("2026-05-01T00:00:00").getTime());
    expect(ticks.at(-1)).toBe(new Date("2026-06-07T00:00:00").getTime());
  });
});

describe("formatCustomRangeLabel", () => {
  it("omits the current year", () => {
    expect(
      formatCustomRangeLabel(range("2026-06-01", "2026-06-07"), today),
    ).toBe("Jun 1 – Jun 7");
  });

  it("includes years when needed", () => {
    expect(
      formatCustomRangeLabel(range("2025-06-01", "2025-06-07"), today),
    ).toBe("Jun 1 – Jun 7, 2025");
    expect(
      formatCustomRangeLabel(range("2025-12-28", "2026-01-03"), today),
    ).toBe("Dec 28, 2025 – Jan 3, 2026");
  });
});

function range(startDate: string, endDate: string): ChartDateRange {
  return {
    startDate: toCalendarDateString(startDate),
    endDate: toCalendarDateString(endDate),
  };
}
