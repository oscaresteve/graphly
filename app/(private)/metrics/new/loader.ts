import "server-only";

import { listUnitOptions } from "@/lib/metrics/queries";
import { type UnitOption } from "@/lib/metrics/types";

export async function loadNewMetricPageData(): Promise<{
  unitOptions: UnitOption[];
}> {
  return {
    unitOptions: await listUnitOptions(),
  };
}
