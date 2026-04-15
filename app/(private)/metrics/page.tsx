import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { LineChart } from "lucide-react";

export default function MetricsPage() {
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
          <Button variant="outline">New Metric</Button>
        </EmptyContent>
      </EmptyHeader>
    </Empty>
  );
}
