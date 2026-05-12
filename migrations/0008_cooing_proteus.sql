DROP INDEX "league_pool_entries_date_idx";--> statement-breakpoint
DROP INDEX "league_pool_entries_date_team_idx";--> statement-breakpoint
ALTER TABLE "league_pool_entries" ADD COLUMN "league_pool_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "league_pool_entries" ADD CONSTRAINT "league_pool_entries_league_pool_id_league_pool_id_fk" FOREIGN KEY ("league_pool_id") REFERENCES "public"."league_pool"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "league_pool_entries_pool_idx" ON "league_pool_entries" USING btree ("league_pool_id");--> statement-breakpoint
CREATE INDEX "league_pool_entries_pool_team_idx" ON "league_pool_entries" USING btree ("league_pool_id","team");--> statement-breakpoint
CREATE INDEX "league_pool_entries_pool_name_idx" ON "league_pool_entries" USING btree ("league_pool_id","name");--> statement-breakpoint
ALTER TABLE "league_pool_entries" DROP COLUMN "date";