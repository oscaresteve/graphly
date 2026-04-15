import { Button } from "@/components/ui/button";
import { getUnits } from "@/lib/db/queries";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { NewMetricForm } from "./new-metric-form";

export default async function NewMetricPage() {
  const units = await getUnits();
  const unitOptions = units.map((unit) => ({
    id: unit.id,
    name: unit.name,
    symbol: unit.symbol,
  }));

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Button asChild variant="ghost" className="w-fit">
          <Link href="/metrics">
            <ArrowLeft data-icon="inline-start" />
            Metrics
          </Link>
        </Button>

        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold">New Metric</h1>
          <p className="text-muted-foreground text-sm">
            Define what you want to track and how each value should be read.
          </p>
        </div>
      </div>

      <NewMetricForm units={unitOptions} />
    </div>
  );
}
