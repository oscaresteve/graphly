"use client";

import { useState } from "react";
import { CalendarIcon, Edit, Ellipsis, Pin, Trash } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { type Unit } from "@/lib/db/types";
import { type CalendarDateString } from "@/lib/date";

import { deleteMetricAction } from "./actions";
import { PastEntryDialogForm } from "./past-entry-dialog-form";

type MetricActionsDropdownProps = {
  entryDates: CalendarDateString[];
  metricId: string;
  metricName: string;
  unit: {
    name: string;
    type: Unit["type"];
  };
};

export function MetricActionsDropdown({
  entryDates,
  metricId,
  metricName,
  unit,
}: MetricActionsDropdownProps) {
  const [pastEntryOpen, setPastEntryOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon-sm">
            <Ellipsis />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="min-w-max">
          <DropdownMenuItem>
            <Edit />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setPastEntryOpen(true)}>
            <CalendarIcon />
            Log past entry
          </DropdownMenuItem>
          <form action={deleteMetricAction}>
            <input type="hidden" name="metricId" value={metricId} />
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
      <PastEntryDialogForm
        entryDates={entryDates}
        metricId={metricId}
        metricName={metricName}
        open={pastEntryOpen}
        onOpenChange={setPastEntryOpen}
        unit={unit}
      />
    </>
  );
}
