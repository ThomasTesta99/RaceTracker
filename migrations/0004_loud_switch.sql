CREATE TABLE "race_day_sources" (
	"race_day_id" text NOT NULL,
	"source_id" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "race_day_sources" ADD CONSTRAINT "race_day_sources_race_day_id_race_days_id_fk" FOREIGN KEY ("race_day_id") REFERENCES "public"."race_days"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "race_day_sources" ADD CONSTRAINT "race_day_sources_source_id_sources_id_fk" FOREIGN KEY ("source_id") REFERENCES "public"."sources"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "race_day_sources_unique" ON "race_day_sources" USING btree ("race_day_id","source_id");--> statement-breakpoint
CREATE INDEX "race_day_sources_race_day_id_idx" ON "race_day_sources" USING btree ("race_day_id");--> statement-breakpoint
CREATE INDEX "race_day_sources_source_id_idx" ON "race_day_sources" USING btree ("source_id");