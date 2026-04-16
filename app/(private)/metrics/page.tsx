import { AppSubbar } from "@/components/app-subbar";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { LineChart, Plus } from "lucide-react";

import { getUserMetrics } from "./queries";
import Link from "next/link";

export default async function MetricsPage() {
  const metrics = await getUserMetrics();
  const subbar = (
    <AppSubbar
      right={
        <Button asChild>
          <Link href="/metrics/new">
            <Plus data-icon="inline-start" />
            New Metric
          </Link>
        </Button>
      }
    />
  );

  if (metrics.length === 0) {
    return (
      <>
        {subbar}
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <LineChart />
            </EmptyMedia>
            <EmptyTitle>You dont have any metrics yet</EmptyTitle>
            <EmptyDescription>
              Create your first metric to start tracking daily data.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </>
    );
  }

  return (
    <>
      {subbar}
      {metrics.map((metric) => (
        <div key={metric.id}>
          <h2>{metric.name}</h2>
          <p>{metric.description}</p>
        </div>
      ))}
    </>
  );
}
