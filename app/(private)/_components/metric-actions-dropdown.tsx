"use client";

import { CalendarIcon, Edit, Ellipsis, Pencil, Pin, Trash } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { deleteMetricAction } from "../_lib/actions";
import { EntryFormModal } from "./entry-form-modal";
import { MetricEntryView, MetricUnitView } from "@/lib/metrics/types";
import { CalendarDateString } from "@/lib/date";
import { AppAlertDialog } from "@/components/app-alert-dialog";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useActionState, useEffect, useTransition } from "react";
import { initialDeleteMetricActionState } from "../_lib/metric.validation";

type MetricActionsDropdownProps = {
  entryDates: CalendarDateString[];
  metricId: string;
  metricName: string;
  metricUnit: MetricUnitView;
  today: CalendarDateString;
  pastEntries: MetricEntryView[];
  pastEntryDates: CalendarDateString[];
};

export function MetricActionsDropdown({
  entryDates,
  metricId,
  metricName,
  metricUnit,
  today,
  pastEntries,
  pastEntryDates,
}: MetricActionsDropdownProps) {
  const router = useRouter();

  const [state, formAction] = useActionState(
    deleteMetricAction,
    initialDeleteMetricActionState,
  );
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (state.success) {
      toast.success("Metric deleted");
      if (state.redirectTo) {
        router.push(state.redirectTo);
      }
    }
  }, [state, router]);

  function deleteMetric() {
    const formData = new FormData();
    formData.append("metricId", metricId);
    startTransition(() => {
      formAction(formData);
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon-sm">
          <Ellipsis />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-max">
        <EntryFormModal
          entryDates={entryDates}
          intent={{ type: "create-past" }}
          metricId={metricId}
          metricName={metricName}
          unit={metricUnit}
          today={today}
          trigger={
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <CalendarIcon />
              Log past entry
            </DropdownMenuItem>
          }
        />
        {pastEntries.length ? (
          <EntryFormModal
            entryDates={pastEntryDates}
            intent={{ type: "edit-past", entries: pastEntries }}
            metricId={metricId}
            metricName={metricName}
            unit={metricUnit}
            today={today}
            trigger={
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <Pencil />
                Edit past
              </DropdownMenuItem>
            }
          />
        ) : null}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={`/metrics/${metricId}/edit`}>
            <Edit />
            Edit
          </Link>
        </DropdownMenuItem>
        <AppAlertDialog
          trigger={
            <DropdownMenuItem
              variant="destructive"
              onSelect={(e) => e.preventDefault()}
            >
              <Trash />
              Delete
            </DropdownMenuItem>
          }
          title="Delete metric?"
          description="This will permanently delete this metric."
          handleAction={deleteMetric}
          isPending={isPending}
        />
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Pin />
          Pin
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
