import "server-only";

import {
  listEntriesForMetricForUser,
  type MetricEntryRecord,
} from "@/lib/db/entries.repository";
import {
  findMetricForUser,
  listMetricsForUser,
  type MetricWithUnitRecord,
} from "@/lib/db/metrics.repository";
import { listUnits } from "@/lib/db/units.repository";
import { toCalendarDateString } from "@/lib/date";
import {
  type MetricEntryView,
  type MetricView,
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
