import { AppSubbar } from "@/components/app-subbar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowLeft, Edit, Ellipsis, Pin, Trash } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { deleteMetricAction } from "../actions";
import { getMetricPageData } from "../queries";
import { MetricDetailChart } from "./metric-detail-chart";

type MetricPageProps = {
  params: Promise<{
    metricId: string;
  }>;
};

export default async function MetricPage({ params }: MetricPageProps) {
  const { metricId } = await params;
  const { metric } = await getMetricPageData(metricId);

  if (!metric) {
    notFound();
  }

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-4">
      <AppSubbar
        left={
          <Button asChild variant="ghost" size="sm">
            <Link href="/metrics">
              <ArrowLeft data-icon="inline-start" />
              Back
            </Link>
          </Button>
        }
        right={
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon-sm">
                <Ellipsis />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <Edit />
                Edit
              </DropdownMenuItem>
              <form action={deleteMetricAction}>
                <input type="hidden" name="metricId" value={metric.id} />
                <DropdownMenuItem asChild variant="destructive">
                  <button type="submit" className="w-full">
                    <Trash />
                    Delete
                  </button>
                </DropdownMenuItem>
              </form>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Pin />
                Pin
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        }
      />

      <div className="flex flex-col">
        <p className="text-muted-foreground text-xs font-medium tracking-normal uppercase">
          {metric.unit.name}
        </p>
        <h1 className="text-2xl font-semibold">{metric.name}</h1>
        {metric.description ? (
          <p className="text-muted-foreground">{metric.description}</p>
        ) : null}
      </div>
      <MetricDetailChart
        entries={metric.entries}
        unitSymbol={metric.unit.symbol}
      />
    </div>
  );
}
