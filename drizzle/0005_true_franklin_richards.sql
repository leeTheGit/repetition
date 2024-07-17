ALTER TABLE "problem" ADD COLUMN "tags" text;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "tags_search_index" ON "problem" USING gin ("tags");