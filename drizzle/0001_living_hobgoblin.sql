CREATE TYPE "public"."type" AS ENUM('media', 'food');--> statement-breakpoint
ALTER TABLE "jnHooperMenu_menu" ADD COLUMN "position" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "jnHooperMenu_menu" ADD COLUMN "type" "type";--> statement-breakpoint
UPDATE "jnHooperMenu_menu" SET "type" = 'media' WHERE "type" IS NULL;
ALTER TABLE "jnHooperMenu_menu" ALTER COLUMN "type"  SET NOT NULL;--> statement-breakpoint
ALTER TABLE "jnHooperMenu_menu" ADD CONSTRAINT "jnHooperMenu_menu_household_id_position_unique" UNIQUE("household_id","position");
