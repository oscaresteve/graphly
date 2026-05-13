import { AppSubbar } from "@/components/app-subbar";
import { NewMetricForm } from "./new-metric-form";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { loadNewMetricPageData } from "./loader";

export default async function NewMetricPage() {
  const { unitOptions } = await loadNewMetricPageData();

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4">
      <AppSubbar
        left={
          <Button asChild variant="ghost" size="sm">
            <Link href="/metrics">
              <ArrowLeft data-icon="inline-start" />
              Back
            </Link>
          </Button>
        }
      />
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold">New Metric</h1>
        <p className="text-muted-foreground text-sm">
          Define what you want to track before adding daily values.
        </p>
      </div>
      <NewMetricForm units={unitOptions} />
    </div>
  );
}
