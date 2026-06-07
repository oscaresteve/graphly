import { ArrowRight, Check, Pencil, Plus } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { formatMetricValue } from "@/lib/metrics/format";

import { EntryDialogForm } from "./metrics/_components/entry-dialog-form";
import { loadDashboardPageData } from "./loader";

export default async function Home() {
  const { metrics, timeZone, today } = await loadDashboardPageData();
  const completedCount = metrics.filter((metric) => metric.todayEntry).length;

  if (metrics.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Plus />
          </EmptyMedia>
          <EmptyTitle>Create your first metric</EmptyTitle>
          <EmptyDescription>
            Add a metric to start building your daily tracking routine.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button asChild>
            <Link href="/metrics/new">New Metric</Link>
          </Button>
        </EmptyContent>
      </Empty>
    );
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4">
      <div className="flex flex-col gap-1">
        <p className="text-muted-foreground text-xs font-medium tracking-normal uppercase">
          Today · {timeZone.replaceAll("_", " ")}
        </p>
        <h1 className="text-2xl font-semibold">Daily check-in</h1>
        <p className="text-muted-foreground text-sm">
          {completedCount} of {metrics.length} metrics logged today.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {metrics.map((metric) => (
          <Card key={metric.id} size="sm">
            <CardHeader>
              <CardTitle>{metric.name}</CardTitle>
              <CardDescription>
                {metric.todayEntry
                  ? `${formatMetricValue(metric.todayEntry.value)} ${metric.unit.symbol}`
                  : `Not logged · ${metric.unit.name}`}
              </CardDescription>
              <CardAction>
                {metric.todayEntry ? (
                  <EntryDialogForm
                    intent={{ type: "edit-today", entry: metric.todayEntry }}
                    metricId={metric.id}
                    metricName={metric.name}
                    today={today}
                    trigger={
                      <Button type="button" variant="secondary" size="sm">
                        <Pencil data-icon="inline-start" />
                        Edit
                      </Button>
                    }
                    unit={metric.unit}
                  />
                ) : (
                  <EntryDialogForm
                    intent={{ type: "create-today" }}
                    metricId={metric.id}
                    metricName={metric.name}
                    today={today}
                    trigger={
                      <Button type="button" size="sm">
                        <Plus data-icon="inline-start" />
                        Log
                      </Button>
                    }
                    unit={metric.unit}
                  />
                )}
              </CardAction>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <p className="text-muted-foreground flex items-center gap-1 text-xs">
                {metric.todayEntry ? (
                  <>
                    <Check className="size-3.5" />
                    Complete
                  </>
                ) : (
                  "Waiting for today's entry"
                )}
              </p>
              <Button asChild variant="ghost" size="sm">
                <Link href={`/metrics/${metric.id}`}>
                  Details
                  <ArrowRight data-icon="inline-end" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
