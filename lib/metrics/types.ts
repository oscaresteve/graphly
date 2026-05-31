import { type unitTypeValues } from "@/lib/db/schema";
import { type CalendarDateString } from "@/lib/date";

export type UnitType = (typeof unitTypeValues)[number];

export type MetricUnitView = {
  id: string;
  name: string;
  symbol: string;
  type: UnitType;
};

export type MetricEntryView = {
  id: string;
  value: number;
  date: CalendarDateString;
};

export type MetricView = {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  unit: MetricUnitView;
  entries: MetricEntryView[];
};

export type UnitOption = Pick<MetricUnitView, "id" | "name" | "symbol">;
