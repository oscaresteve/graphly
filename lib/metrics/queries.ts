import "server-only";

import {
  listEntriesForMetricForUser,
  type MetricEntryRecord,
} from "@/lib/db/entries.repository";
import {
  findMetricForUser,
  listMetricsWithTodayEntryForUser,
  listMetricsForUser,
  type MetricWithUnitRecord,
} from "@/lib/db/metrics.repository";
import { listUnits } from "@/lib/db/units.repository";
import { toCalendarDateString } from "@/lib/date";
import {
  type MetricEntryView,
  type MetricView,
  type DailyMetricView,
  type UnitOption,
} from "@/lib/metrics/types";

export async function listMetricViewsForUser(
  userId: string,
): Promise<MetricView[]> {
  const metricRecords = await listMetricsForUser(userId);

  return Promise.all(
    metricRecords.map(async (metric) =>
      toMetricView(
        metric,
        await listEntriesForMetricForUser(metric.id, userId),
      ),
    ),
  );
}

export async function findMetricViewForUser(
  metricId: string,
  userId: string,
): Promise<MetricView | null> {
  const metric = await findMetricForUser(metricId, userId);

  if (!metric) {
    return null;
  }

  return toMetricView(
    metric,
    await listEntriesForMetricForUser(metric.id, userId),
  );
}

export async function listUnitOptions(): Promise<UnitOption[]> {
  const units = await listUnits();

  return units.map(({ id, name, symbol }) => ({
    id,
    name,
    symbol,
  }));
}

export async function listDailyMetricViewsForUser(
  userId: string,
  today: string,
): Promise<DailyMetricView[]> {
  const metrics = await listMetricsWithTodayEntryForUser(userId, today);

  return metrics.map((metric) => ({
    id: metric.id,
    name: metric.name,
    description: metric.description,
    unit: metric.unit,
    todayEntry: metric.todayEntry
      ? {
          id: metric.todayEntry.id,
          date: toCalendarDateString(metric.todayEntry.date),
          value: Number(metric.todayEntry.value),
        }
      : null,
  }));
}

function toMetricView(
  metric: MetricWithUnitRecord,
  entries: MetricEntryRecord[],
): MetricView {
  return {
    ...metric,
    createdAt: metric.createdAt.toISOString(),
    entries: entries.map(toMetricEntryView),
  };
}

function toMetricEntryView(entry: MetricEntryRecord): MetricEntryView {
  return {
    id: entry.id,
    value: Number(entry.value),
    date: toCalendarDateString(entry.date),
  };
}
