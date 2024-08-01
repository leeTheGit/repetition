DROP INDEX IF EXISTS "course_slug_idx";--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "course_slug_idx" ON "course" USING btree ("slug","user_id");