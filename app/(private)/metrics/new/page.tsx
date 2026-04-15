import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getUnits } from "@/lib/db/queries";
import { ArrowLeft, Plus } from "lucide-react";
import Link from "next/link";

import { createUserMetric } from "../actions";

export default async function NewMetricPage() {
  const units = await getUnits();
  const defaultUnitId = units[0]?.id;

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

      <form action={createUserMetric} className="flex flex-col gap-6">
        <FieldGroup>
          <FieldSet>
            <FieldLegend>Metric details</FieldLegend>

            <Field>
              <FieldLabel htmlFor="name">Name</FieldLabel>
              <Input
                id="name"
                name="name"
                placeholder="Weight, revenue, sleep hours"
              />
              <FieldDescription>
                Use a short name you will recognize in charts.
              </FieldDescription>
            </Field>

            <Field>
              <FieldLabel htmlFor="description">Description</FieldLabel>
              <Textarea
                id="description"
                name="description"
                placeholder="What this metric helps you understand"
              />
            </Field>
          </FieldSet>

          <FieldSet>
            <FieldLegend>Unit</FieldLegend>

            <Field>
              <FieldLabel>Unit</FieldLabel>
              <Select
                name="unitId"
                defaultValue={defaultUnitId}
                disabled={units.length === 0}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {units.map((unit) => (
                      <SelectItem key={unit.id} value={unit.id}>
                        {unit.name} ({unit.symbol})
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FieldDescription>
                Choose how values for this metric will be read.
              </FieldDescription>
            </Field>
          </FieldSet>
        </FieldGroup>

        <div className="flex gap-2">
          <Button type="submit" disabled={units.length === 0}>
            <Plus data-icon="inline-start" />
            Create Metric
          </Button>
          <Button asChild variant="outline">
            <Link href="/metrics">Cancel</Link>
          </Button>
        </div>
      </form>
    </div>
  );
}
