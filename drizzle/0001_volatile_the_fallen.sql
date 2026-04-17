ALTER TABLE "units" ALTER COLUMN "type" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."unit_type";--> statement-breakpoint
CREATE TYPE "public"."unit_type" AS ENUM('integer', 'decimal');--> statement-breakpoint
ALTER TABLE "units" ALTER COLUMN "type" SET DATA TYPE "public"."unit_type" USING (
	CASE
		WHEN "type" IN ('count', 'integer') THEN 'integer'
		ELSE 'decimal'
	END
)::"public"."unit_type";
