"use client";

import { Edit, Ellipsis, Pin, Trash } from "lucide-react";
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

type MetricActionsDropdownProps = {
  metricId: string;
};

export function MetricActionsDropdown({
  metricId,
}: MetricActionsDropdownProps) {
  return (
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
  );
}
