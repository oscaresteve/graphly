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
        <DropdownMenuItem
          variant="destructive"
          onSelect={(e) => {
            e.preventDefault();
            const form = document.createElement("form");
            form.method = "post";
            const input = document.createElement("input");
            input.type = "hidden";
            input.name = "metricId";
            input.value = metricId;
            form.appendChild(input);
            document.body.appendChild(form);
            deleteMetricAction(new FormData(form));
            document.body.removeChild(form);
          }}
        >
          <Trash />
          Delete
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Pin />
          Pin
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
