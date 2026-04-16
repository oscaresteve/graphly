import { asc } from "drizzle-orm";

import { db } from "@/lib/db";
import { units } from "@/lib/db/schema";
import { type Unit } from "@/lib/db/types";

export async function getUnits(): Promise<Unit[]> {
  return db.select().from(units).orderBy(asc(units.name));
}
