import { describe, expect, it } from "vitest";

import { toCalendarDateString } from "@/lib/date";

import {
  validateCreateEntryFormData,
  validateUpdateEntryFormData,
} from "./entry.validation";

const metricId = "5f55ec9d-1864-4bed-a3df-5f5774506943";
const entryId = "e25e6a41-3534-42e5-b188-e61e79b636ac";
const today = toCalendarDateString("2026-06-07");

describe("validateCreateEntryFormData", () => {
  it("accepts entries for today and previous dates", () => {
    const formData = new FormData();
    formData.set("metricId", metricId);
    formData.set("date", "2026-06-07");
    formData.set("value", "12.5");

    expect(validateCreateEntryFormData(formData, today)).toMatchObject({
      success: true,
      data: { value: 12.5 },
    });
  });

  it("rejects dates after today in the user's time zone", () => {
    const formData = new FormData();
    formData.set("metricId", metricId);
    formData.set("date", "2026-06-08");
    formData.set("value", "12");

    expect(validateCreateEntryFormData(formData, today)).toMatchObject({
      success: false,
      fieldErrors: { date: ["Date cannot be in the future"] },
    });
  });
});

describe("validateUpdateEntryFormData", () => {
  it("accepts an entry id and replacement value without a date", () => {
    const formData = new FormData();
    formData.set("entryId", entryId);
    formData.set("value", "8");

    expect(validateUpdateEntryFormData(formData)).toEqual({
      success: true,
      data: {
        entryId,
        value: 8,
      },
    });
  });
});
