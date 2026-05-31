import { asc } from "drizzle-orm";

import { db } from "@/lib/db";
import { units } from "@/lib/db/schema";

export type UnitRecord = typeof units.$inferSelect;

export async function listUnits(): Promise<UnitRecord[]> {
  return db.select().from(units).orderBy(asc(units.name));
}
