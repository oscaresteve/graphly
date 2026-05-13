import "server-only";

import { getUnits } from "@/lib/db/units.repository";

export async function loadNewMetricPageData() {
  const units = await getUnits();

  return {
    unitOptions: units.map(({ id, name, symbol }) => ({
      id,
      name,
      symbol,
    })),
  };
}
