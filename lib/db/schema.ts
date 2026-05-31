import {
  pgTable,
  uuid,
  text,
  timestamp,
  pgEnum,
  numeric,
  date,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const unitTypeValues = ["integer", "decimal"] as const;

export const unitTypeEnum = pgEnum("unit_type", unitTypeValues);

export const units = pgTable("units", {
  id: uuid("id").defaultRandom().primaryKey(),

  name: text("name").notNull(),
  symbol: text("symbol").notNull(),

  type: unitTypeEnum("type").notNull(),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const metrics = pgTable("metrics", {
  id: uuid("id").defaultRandom().primaryKey(),

  userId: text("user_id").notNull(),

  name: text("name").notNull(),
  description: text("description"),

  unitId: uuid("unit_id")
    .notNull()
    .references(() => units.id, { onDelete: "restrict" }),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const entries = pgTable(
  "entries",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    metricId: uuid("metric_id")
      .notNull()
      .references(() => metrics.id, { onDelete: "cascade" }),

    userId: text("user_id").notNull(),

    value: numeric("value", { precision: 12, scale: 3 }).notNull(),

    date: date("date").notNull(),

    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    uniqueMetricPerDay: uniqueIndex("unique_metric_per_day").on(
      table.metricId,
      table.date,
    ),
  }),
);
