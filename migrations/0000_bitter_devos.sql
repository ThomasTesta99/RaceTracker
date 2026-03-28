CREATE TYPE "public"."bet_type" AS ENUM('box', 'exact');--> statement-breakpoint
CREATE TABLE "race_days" (
	"id" text PRIMARY KEY NOT NULL,
	"date" date DEFAULT now() NOT NULL,
	"track" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "race_picks" (
	"id" text PRIMARY KEY NOT NULL,
	"race_id" text NOT NULL,
	"source_id" text NOT NULL,
	"value_1" text,
	"value_2" text,
	"value_3" text
);
--> statement-breakpoint
CREATE TABLE "races" (
	"id" text PRIMARY KEY NOT NULL,
	"race_day_id" text NOT NULL,
	"race_number" integer NOT NULL,
	"result" text,
	"bet_type" "bet_type" NOT NULL,
	"win_1" text,
	"win_2" text,
	"win_3" text
);
--> statement-breakpoint
CREATE TABLE "sources" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "race_picks" ADD CONSTRAINT "race_picks_race_id_races_id_fk" FOREIGN KEY ("race_id") REFERENCES "public"."races"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "race_picks" ADD CONSTRAINT "race_picks_source_id_sources_id_fk" FOREIGN KEY ("source_id") REFERENCES "public"."sources"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "races" ADD CONSTRAINT "races_race_day_id_race_days_id_fk" FOREIGN KEY ("race_day_id") REFERENCES "public"."race_days"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "race_days_date_idx" ON "race_days" USING btree ("date");--> statement-breakpoint
CREATE INDEX "race_days_track_idx" ON "race_days" USING btree ("track");--> statement-breakpoint
CREATE UNIQUE INDEX "race_days_date_track_unique" ON "race_days" USING btree ("date","track");--> statement-breakpoint
CREATE INDEX "race_picks_race_id_idx" ON "race_picks" USING btree ("race_id");--> statement-breakpoint
CREATE INDEX "race_picks_source_id_idx" ON "race_picks" USING btree ("source_id");--> statement-breakpoint
CREATE UNIQUE INDEX "race_picks_race_source_unique" ON "race_picks" USING btree ("race_id","source_id");--> statement-breakpoint
CREATE INDEX "races_race_day_id_idx" ON "races" USING btree ("race_day_id");--> statement-breakpoint
CREATE INDEX "races_race_number_idx" ON "races" USING btree ("race_number");--> statement-breakpoint
CREATE UNIQUE INDEX "races_race_day_number_unique" ON "races" USING btree ("race_day_id","race_number");--> statement-breakpoint
CREATE UNIQUE INDEX "sources_name_unique" ON "sources" USING btree ("name");