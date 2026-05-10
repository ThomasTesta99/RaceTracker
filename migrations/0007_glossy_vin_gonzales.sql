CREATE TABLE "league_pool_entries" (
	"id" text PRIMARY KEY NOT NULL,
	"team" text NOT NULL,
	"name" text NOT NULL,
	"date" date DEFAULT now() NOT NULL,
	"number_0_color" text,
	"number_1_color" text,
	"number_2_color" text,
	"number_3_color" text,
	"number_4_color" text,
	"number_5_color" text,
	"number_6_color" text,
	"number_7_color" text,
	"number_8_color" text,
	"number_9_color" text,
	"number_10_color" text
);
--> statement-breakpoint
CREATE INDEX "league_pool_entries_date_idx" ON "league_pool_entries" USING btree ("date");--> statement-breakpoint
CREATE INDEX "league_pool_entries_team_idx" ON "league_pool_entries" USING btree ("team");--> statement-breakpoint
CREATE INDEX "league_pool_entries_name_idx" ON "league_pool_entries" USING btree ("name");--> statement-breakpoint
CREATE INDEX "league_pool_entries_date_team_idx" ON "league_pool_entries" USING btree ("date","team");