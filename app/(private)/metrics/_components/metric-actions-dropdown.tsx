"use client";

import { useState } from "react";
import { CalendarIcon, Edit, Ellipsis, Pin, Trash } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { type CalendarDateString } from "@/lib/date";
import { type UnitType } from "@/lib/metrics/types";

import { deleteMetricAction } from "../_lib/actions";
import { EntryDialogForm } from "./entry-dialog-form";

type MetricActionsDropdownProps = {
  entryDates: CalendarDateString[];
  metricId: string;
  metricName: string;
  showLogDateItem?: boolean;
  unit: {
    name: string;
    type: UnitType;
  };
};

export function MetricActionsDropdown({
  entryDates,
  metricId,
  metricName,
  showLogDateItem = true,
  unit,
}: MetricActionsDropdownProps) {
  const [dateDialogOpen, setDateDialogOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon-sm">
            <Ellipsis />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="min-w-max">
          <DropdownMenuItem asChild>
            <Link href={`/metrics/${metricId}/edit`}>
              <Edit />
              Edit
            </Link>
          </DropdownMenuItem>
          {showLogDateItem ? (
            <DropdownMenuItem onSelect={() => setDateDialogOpen(true)}>
              <CalendarIcon />
              Log another date
            </DropdownMenuItem>
          ) : null}
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
      <EntryDialogForm
        entryDates={entryDates}
        metricId={metricId}
        metricName={metricName}
        mode="custom-date"
        open={dateDialogOpen}
        onOpenChange={setDateDialogOpen}
        unit={unit}
      />
    </>
  );
}
