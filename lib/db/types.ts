import { entries, metrics, units } from "@/lib/db/schema";

export type Unit = typeof units.$inferSelect;
export type NewUnit = typeof units.$inferInsert;

export type Metric = typeof metrics.$inferSelect;
export type NewMetric = typeof metrics.$inferInsert;

export type Entry = typeof entries.$inferSelect;
export type NewEntry = typeof entries.$inferInsert;

export type UserMetric = Pick<
  Metric,
  "id" | "name" | "description" | "createdAt"
> & {
  unit: Pick<Unit, "id" | "name" | "symbol" | "type">;
};

export type UserMetricResponse = Omit<UserMetric, "createdAt"> & {
  createdAt: string;
};
