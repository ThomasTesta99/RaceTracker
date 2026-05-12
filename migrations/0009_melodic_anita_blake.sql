CREATE TABLE "league_pool" (
	"id" text PRIMARY KEY NOT NULL,
	"date" date DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "league_pool_date_idx" ON "league_pool" USING btree ("date");