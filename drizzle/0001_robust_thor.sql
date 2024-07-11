ALTER TABLE "submissions" RENAME TO "submission";--> statement-breakpoint
ALTER TABLE "submission" DROP CONSTRAINT "submissions_user_uuid_user_uuid_fk";
--> statement-breakpoint
ALTER TABLE "submission" DROP CONSTRAINT "submissions_problem_uuid_problem_uuid_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "submission" ADD CONSTRAINT "submission_user_uuid_user_uuid_fk" FOREIGN KEY ("user_uuid") REFERENCES "public"."user"("uuid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "submission" ADD CONSTRAINT "submission_problem_uuid_problem_uuid_fk" FOREIGN KEY ("problem_uuid") REFERENCES "public"."problem"("uuid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
