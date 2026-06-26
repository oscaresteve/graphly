import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Plus } from "lucide-react";

import Link from "next/link";

export default function MetricsEmptyState() {
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
