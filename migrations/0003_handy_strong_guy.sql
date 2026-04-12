ALTER TABLE "race_picks" DROP CONSTRAINT "race_picks_source_id_sources_id_fk";
--> statement-breakpoint
ALTER TABLE "race_picks" ADD CONSTRAINT "race_picks_source_id_sources_id_fk" FOREIGN KEY ("source_id") REFERENCES "public"."sources"("id") ON DELETE cascade ON UPDATE no action;