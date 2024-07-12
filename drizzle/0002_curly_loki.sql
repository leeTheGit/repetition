CREATE TABLE IF NOT EXISTS "topic" (
	"id" serial NOT NULL,
	"uuid" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"course_id" uuid NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	"status" varchar(50) DEFAULT 'draft' NOT NULL,
	"is_deleted" boolean DEFAULT false,
	"image_uuid" uuid,
	"is_seeded" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "submission" ALTER COLUMN "grade" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "problem" ADD COLUMN "topic_id" uuid;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "topic" ADD CONSTRAINT "topic_course_id_course_uuid_fk" FOREIGN KEY ("course_id") REFERENCES "public"."course"("uuid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "topic" ADD CONSTRAINT "topic_image_uuid_media_uuid_fk" FOREIGN KEY ("image_uuid") REFERENCES "public"."media"("uuid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "topic_slug_idx" ON "topic" USING btree ("slug");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "fk_topic_image_idx" ON "topic" USING btree ("image_uuid");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "problem" ADD CONSTRAINT "problem_topic_id_topic_uuid_fk" FOREIGN KEY ("topic_id") REFERENCES "public"."topic"("uuid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "fk_problem_topic_idx" ON "problem" USING btree ("topic_id");