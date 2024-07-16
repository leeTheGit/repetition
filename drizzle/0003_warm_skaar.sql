ALTER TABLE "problem" ALTER COLUMN "category_uuid" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "category" ADD COLUMN "course_id" uuid NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "category" ADD CONSTRAINT "category_course_id_course_uuid_fk" FOREIGN KEY ("course_id") REFERENCES "public"."course"("uuid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "fk_course_category_idx" ON "category" USING btree ("course_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "fk_course_topic_idx" ON "topic" USING btree ("course_id");