DO $$ BEGIN
 CREATE TYPE "public"."type" AS ENUM('basic', 'code', 'multi-choice', 'written-answer', 'math');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "problem" ADD COLUMN "type" "type" DEFAULT 'basic' NOT NULL;