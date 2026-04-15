import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { LineChart, Plus } from "lucide-react";

import { getUserMetrics } from "./actions";
import Link from "next/link";

export default async function MetricsPage() {
  const metrics = await getUserMetrics();

  if (metrics.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <LineChart />
          </EmptyMedia>
          <EmptyTitle>You dont have any metrics yet</EmptyTitle>
          <EmptyDescription>
            Create your first metric to start tracking daily data.
          </EmptyDescription>
          <EmptyContent>
            <Button asChild variant="outline">
              <Link href="/metrics/new">
                <Plus />
                New Metric
              </Link>
            </Button>
          </EmptyContent>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <>
      {metrics.map((metric) => (
        <div key={metric.id}>
          <h2>{metric.name}</h2>
          <p>{metric.description}</p>
        </div>
      ))}
    </>
  );
}
