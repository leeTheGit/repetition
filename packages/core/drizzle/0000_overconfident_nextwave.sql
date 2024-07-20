CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
--> statement-breakpoint


DO $$ BEGIN
 CREATE TYPE "public"."email_type" AS ENUM('html', 'markdown', 'text');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."email_layout_type" AS ENUM('layout', 'content');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "accounts" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_uuid" uuid NOT NULL,
	"account_type" text NOT NULL,
	"oauth_id" text,
	CONSTRAINT "accounts_user_uuid_unique" UNIQUE("user_uuid"),
	CONSTRAINT "accounts_oauth_id_unique" UNIQUE("oauth_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "asset_log" (
	"uuid" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"organisation_uuid" uuid NOT NULL,
	"media_uuid" uuid,
	"resource" text NOT NULL,
	"resource_attribute" text,
	"resource_uuid" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "auth_token" (
	"id" serial NOT NULL,
	"organisation_uuid" uuid NOT NULL,
	"type" text NOT NULL,
	"identifier" text NOT NULL,
	"name" text DEFAULT 'default' NOT NULL,
	"description" text,
	"token" text DEFAULT uuid_generate_v4() NOT NULL,
	"one_time" boolean DEFAULT false NOT NULL,
	"status" boolean DEFAULT true NOT NULL,
	"expires_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "auth_token_type_identifier_token_pk" PRIMARY KEY("type","identifier","token"),
	CONSTRAINT "auth_token_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "category" (
	"id" serial NOT NULL,
	"uuid" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"course_id" uuid,
	"name" text NOT NULL,
	"slug" varchar(256) NOT NULL,
	"description" text,
	"is_seeded" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "collection" (
	"id" serial NOT NULL,
	"uuid" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"organisation_uuid" uuid NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	"status" boolean DEFAULT true NOT NULL,
	"is_seeded" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "countries" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" varchar(3) NOT NULL,
	"name" varchar(100) NOT NULL,
	"currency_code" varchar(3) NOT NULL,
	"iso_numeric" varchar(3) NOT NULL,
	"iso_alpha3" varchar(3) NOT NULL,
	"is_tax_applicable" boolean DEFAULT false NOT NULL,
	"tax_percent" integer DEFAULT 0 NOT NULL,
	"tax_title" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "course" (
	"id" serial NOT NULL,
	"uuid" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"organisation_uuid" uuid NOT NULL,
	"user_id" uuid,
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
CREATE TABLE IF NOT EXISTS "email_log" (
	"id" serial PRIMARY KEY NOT NULL,
	"organisation_uuid" uuid NOT NULL,
	"to_address" text NOT NULL,
	"to_name" text,
	"from_address" text NOT NULL,
	"from_name" text,
	"subject" text,
	"content" text,
	"content_type" "email_type" DEFAULT 'html' NOT NULL,
	"isSent" boolean DEFAULT false NOT NULL,
	"is_seeded" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "email_template" (
	"id" serial NOT NULL,
	"uuid" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"organisation_uuid" uuid NOT NULL,
	"email_id" uuid,
	"layout_id" uuid,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"subject" text,
	"content" text,
	"content_type" "email_type" DEFAULT 'html' NOT NULL,
	"type" "email_layout_type" DEFAULT 'content' NOT NULL,
	"status" boolean DEFAULT true NOT NULL,
	"is_seeded" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "emails" (
	"id" serial NOT NULL,
	"uuid" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"schema" jsonb
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "media" (
	"id" serial NOT NULL,
	"uuid" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"organisation_uuid" uuid NOT NULL,
	"title" varchar(255),
	"caption" text,
	"alt_text" text,
	"copyright" text,
	"source" text,
	"private" boolean DEFAULT false NOT NULL,
	"description" text,
	"filename" varchar(255) NOT NULL,
	"filesize" integer NOT NULL,
	"filetype" varchar(255) NOT NULL,
	"tags" varchar(255),
	"width" integer NOT NULL,
	"height" integer NOT NULL,
	"storage_url" varchar(255) NOT NULL,
	"cdn_url" varchar(255) NOT NULL,
	"type" varchar(255) NOT NULL,
	"is_seeded" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "organisation" (
	"id" serial NOT NULL,
	"uuid" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"name" varchar(255) NOT NULL,
	"domain" varchar(255) NOT NULL,
	"database_strategy" varchar(255) DEFAULT 'shared'::character varying NOT NULL,
	"email" text,
	"reply_email" text,
	"timezone" varchar(255) DEFAULT 'UTC'::character varying NOT NULL,
	"logo" uuid,
	"logo_reverse" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	CONSTRAINT "organisation_domain_unique" UNIQUE("domain")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "permissions" (
	"id" serial NOT NULL,
	"uuid" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"organisation_id" uuid NOT NULL,
	"slug" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "plan_settings" (
	"id" serial NOT NULL,
	"uuid" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"plan_uuid" uuid NOT NULL,
	"userCount" integer DEFAULT 5,
	"storeCount" integer DEFAULT 1 NOT NULL,
	"productCount" integer DEFAULT 20,
	"assetCount" integer DEFAULT 100,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "plans" (
	"id" serial NOT NULL,
	"uuid" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text,
	"price" integer NOT NULL,
	"currency_code" varchar(3) NOT NULL,
	"plan_interval" varchar(10) DEFAULT 'month' NOT NULL,
	"trial_period_days" integer DEFAULT 0 NOT NULL,
	"status" boolean DEFAULT true NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "problem" (
	"id" serial NOT NULL,
	"uuid" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"category_uuid" uuid,
	"course_id" uuid NOT NULL,
	"topic_id" uuid,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	"starter_code" text,
	"answer_code" text,
	"difficulty" integer NOT NULL,
	"link" text,
	"status" varchar(50) DEFAULT 'draft' NOT NULL,
	"is_deleted" boolean DEFAULT false,
	"image_uuid" uuid,
	"is_seeded" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "problem_collection" (
	"uuid" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"organisation_uuid" uuid NOT NULL,
	"collection_uuid" uuid NOT NULL,
	"problem_uuid" uuid NOT NULL,
	"order" integer NOT NULL,
	"status" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "roles" (
	"id" serial NOT NULL,
	"uuid" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"organisation_id" uuid NOT NULL,
	"slug" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "roles_permissions" (
	"role_uuid" uuid NOT NULL,
	"permission_uuid" uuid NOT NULL,
	CONSTRAINT "roles_permissions_pkey" PRIMARY KEY("role_uuid","permission_uuid")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "session" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "submission" (
	"id" serial NOT NULL,
	"uuid" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"user_uuid" uuid NOT NULL,
	"problem_uuid" uuid NOT NULL,
	"solution" text,
	"note" text,
	"grade" integer NOT NULL,
	"submitted_at" timestamp,
	"next_review_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
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
CREATE TABLE IF NOT EXISTS "useage" (
	"id" serial NOT NULL,
	"uuid" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"plan_uuid" uuid NOT NULL,
	"organisation_uuid" uuid NOT NULL,
	"asset_count" integer DEFAULT 0,
	"asset_storage_size" integer DEFAULT 0,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_problem" (
	"uuid" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"organisation_uuid" uuid NOT NULL,
	"user_uuid" uuid NOT NULL,
	"problem_uuid" uuid NOT NULL,
	"grade" integer,
	"note" text,
	"solution" text,
	"next_review_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" serial NOT NULL,
	"uuid" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"organisation_uuid" uuid,
	"firstname" varchar(100),
	"lastname" varchar(100),
	"username" varchar(50) NOT NULL,
	"email" text NOT NULL,
	"emailVerified" timestamp,
	"image" text,
	"profile_image_id" uuid,
	"hashed_password" varchar(255),
	"is_two_factor_enabled" boolean DEFAULT false,
	"status" varchar(50) DEFAULT 'active' NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"data" jsonb,
	"remember_token" varchar(100),
	"last_loggedin" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users_permissions" (
	"user_uuid" uuid NOT NULL,
	"permission_uuid" uuid NOT NULL,
	CONSTRAINT "users_permissions_pkey" PRIMARY KEY("user_uuid","permission_uuid")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users_roles" (
	"user_uuid" uuid NOT NULL,
	"role_uuid" uuid NOT NULL,
	CONSTRAINT "users_roles_pkey" PRIMARY KEY("user_uuid","role_uuid")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_uuid_user_uuid_fk" FOREIGN KEY ("user_uuid") REFERENCES "public"."user"("uuid") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "asset_log" ADD CONSTRAINT "asset_log_organisation_uuid_organisation_uuid_fk" FOREIGN KEY ("organisation_uuid") REFERENCES "public"."organisation"("uuid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "asset_log" ADD CONSTRAINT "asset_log_media_uuid_media_uuid_fk" FOREIGN KEY ("media_uuid") REFERENCES "public"."media"("uuid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "auth_token" ADD CONSTRAINT "auth_token_organisation_uuid_organisation_uuid_fk" FOREIGN KEY ("organisation_uuid") REFERENCES "public"."organisation"("uuid") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "category" ADD CONSTRAINT "category_course_id_course_uuid_fk" FOREIGN KEY ("course_id") REFERENCES "public"."course"("uuid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "collection" ADD CONSTRAINT "collection_organisation_uuid_organisation_uuid_fk" FOREIGN KEY ("organisation_uuid") REFERENCES "public"."organisation"("uuid") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "course" ADD CONSTRAINT "course_organisation_uuid_organisation_uuid_fk" FOREIGN KEY ("organisation_uuid") REFERENCES "public"."organisation"("uuid") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "course" ADD CONSTRAINT "course_user_id_user_uuid_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("uuid") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "course" ADD CONSTRAINT "course_image_uuid_media_uuid_fk" FOREIGN KEY ("image_uuid") REFERENCES "public"."media"("uuid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "email_log" ADD CONSTRAINT "email_log_organisation_uuid_organisation_uuid_fk" FOREIGN KEY ("organisation_uuid") REFERENCES "public"."organisation"("uuid") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "email_template" ADD CONSTRAINT "email_template_organisation_uuid_organisation_uuid_fk" FOREIGN KEY ("organisation_uuid") REFERENCES "public"."organisation"("uuid") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "email_template" ADD CONSTRAINT "email_template_email_id_emails_uuid_fk" FOREIGN KEY ("email_id") REFERENCES "public"."emails"("uuid") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "email_template" ADD CONSTRAINT "email_template_layout_id_email_template_uuid_fk" FOREIGN KEY ("layout_id") REFERENCES "public"."email_template"("uuid") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "media" ADD CONSTRAINT "media_organisation_uuid_organisation_uuid_fk" FOREIGN KEY ("organisation_uuid") REFERENCES "public"."organisation"("uuid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "organisation" ADD CONSTRAINT "organisation_logo_media_uuid_fk" FOREIGN KEY ("logo") REFERENCES "public"."media"("uuid") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "organisation" ADD CONSTRAINT "organisation_logo_reverse_media_uuid_fk" FOREIGN KEY ("logo_reverse") REFERENCES "public"."media"("uuid") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "permissions" ADD CONSTRAINT "permissions_organisation_id_organisation_uuid_fk" FOREIGN KEY ("organisation_id") REFERENCES "public"."organisation"("uuid") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "plan_settings" ADD CONSTRAINT "plan_settings_plan_uuid_plans_uuid_fk" FOREIGN KEY ("plan_uuid") REFERENCES "public"."plans"("uuid") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "problem" ADD CONSTRAINT "problem_category_uuid_category_uuid_fk" FOREIGN KEY ("category_uuid") REFERENCES "public"."category"("uuid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "problem" ADD CONSTRAINT "problem_course_id_course_uuid_fk" FOREIGN KEY ("course_id") REFERENCES "public"."course"("uuid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "problem" ADD CONSTRAINT "problem_topic_id_topic_uuid_fk" FOREIGN KEY ("topic_id") REFERENCES "public"."topic"("uuid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "problem" ADD CONSTRAINT "problem_image_uuid_media_uuid_fk" FOREIGN KEY ("image_uuid") REFERENCES "public"."media"("uuid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "problem_collection" ADD CONSTRAINT "problem_collection_organisation_uuid_organisation_uuid_fk" FOREIGN KEY ("organisation_uuid") REFERENCES "public"."organisation"("uuid") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "problem_collection" ADD CONSTRAINT "problem_collection_collection_uuid_collection_uuid_fk" FOREIGN KEY ("collection_uuid") REFERENCES "public"."collection"("uuid") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "problem_collection" ADD CONSTRAINT "problem_collection_problem_uuid_problem_uuid_fk" FOREIGN KEY ("problem_uuid") REFERENCES "public"."problem"("uuid") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "roles" ADD CONSTRAINT "roles_organisation_id_organisation_uuid_fk" FOREIGN KEY ("organisation_id") REFERENCES "public"."organisation"("uuid") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "roles_permissions" ADD CONSTRAINT "roles_permissions_role_uuid_roles_uuid_fk" FOREIGN KEY ("role_uuid") REFERENCES "public"."roles"("uuid") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "roles_permissions" ADD CONSTRAINT "roles_permissions_permission_uuid_permissions_uuid_fk" FOREIGN KEY ("permission_uuid") REFERENCES "public"."permissions"("uuid") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_uuid_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("uuid") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
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
--> statement-breakpoint
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
DO $$ BEGIN
 ALTER TABLE "useage" ADD CONSTRAINT "useage_plan_uuid_plans_uuid_fk" FOREIGN KEY ("plan_uuid") REFERENCES "public"."plans"("uuid") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "useage" ADD CONSTRAINT "useage_organisation_uuid_organisation_uuid_fk" FOREIGN KEY ("organisation_uuid") REFERENCES "public"."organisation"("uuid") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_problem" ADD CONSTRAINT "user_problem_organisation_uuid_organisation_uuid_fk" FOREIGN KEY ("organisation_uuid") REFERENCES "public"."organisation"("uuid") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_problem" ADD CONSTRAINT "user_problem_user_uuid_user_uuid_fk" FOREIGN KEY ("user_uuid") REFERENCES "public"."user"("uuid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_problem" ADD CONSTRAINT "user_problem_problem_uuid_problem_uuid_fk" FOREIGN KEY ("problem_uuid") REFERENCES "public"."problem"("uuid") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user" ADD CONSTRAINT "user_organisation_uuid_organisation_uuid_fk" FOREIGN KEY ("organisation_uuid") REFERENCES "public"."organisation"("uuid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user" ADD CONSTRAINT "user_profile_image_id_media_uuid_fk" FOREIGN KEY ("profile_image_id") REFERENCES "public"."media"("uuid") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users_permissions" ADD CONSTRAINT "users_permissions_user_uuid_user_uuid_fk" FOREIGN KEY ("user_uuid") REFERENCES "public"."user"("uuid") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users_permissions" ADD CONSTRAINT "users_permissions_permission_uuid_permissions_uuid_fk" FOREIGN KEY ("permission_uuid") REFERENCES "public"."permissions"("uuid") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users_roles" ADD CONSTRAINT "users_roles_user_uuid_user_uuid_fk" FOREIGN KEY ("user_uuid") REFERENCES "public"."user"("uuid") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users_roles" ADD CONSTRAINT "users_roles_role_uuid_roles_uuid_fk" FOREIGN KEY ("role_uuid") REFERENCES "public"."roles"("uuid") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "useraccount_idx" ON "accounts" USING btree ("user_uuid","account_type");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "fk_asset_log_organisation_idx" ON "asset_log" USING btree ("organisation_uuid");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "fk_asset_log_created_at_idx" ON "asset_log" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "fk_asset_log_media_idx" ON "asset_log" USING btree ("media_uuid");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "fk_authtoken_token_idx" ON "auth_token" USING btree ("token");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "fk_course_category_idx" ON "category" USING btree ("course_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "category_slug_idx" ON "category" USING btree ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "collection_slug_idx" ON "collection" USING btree ("slug");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "fk_collection_organisation_idx" ON "collection" USING btree ("organisation_uuid");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "course_slug_idx" ON "course" USING btree ("slug");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "fk_course_organisation_idx" ON "course" USING btree ("organisation_uuid");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "fk_course_user_idx" ON "course" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "fk_course_image_idx" ON "course" USING btree ("image_uuid");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "fk_emaillog_organisation_idx" ON "email_log" USING btree ("organisation_uuid");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "email_slug_idx" ON "email_template" USING btree ("slug");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "fk_email_organisation_idx" ON "email_template" USING btree ("organisation_uuid");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "emails_slug_idx" ON "emails" USING btree ("slug");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "fk_media_organisation_idx" ON "media" USING btree ("organisation_uuid");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "permissions_slug_idx" ON "permissions" USING btree ("slug","organisation_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "fk_permission_organisation_idx" ON "permissions" USING btree ("organisation_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "product_slug_idx" ON "problem" USING btree ("slug");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "fk_problem_category_idx" ON "problem" USING btree ("category_uuid");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "fk_problem_topic_idx" ON "problem" USING btree ("topic_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "fk_problem_image_idx" ON "problem" USING btree ("image_uuid");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "fk_problem_collection_organisation_idx" ON "problem_collection" USING btree ("organisation_uuid");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "fk_problem_collection_collection_idx" ON "problem_collection" USING btree ("collection_uuid");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "fk_problemc_ollection_problem_idx" ON "problem_collection" USING btree ("problem_uuid");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "roles_slug_idx" ON "roles" USING btree ("slug","organisation_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "fk_roles_organisation_idx" ON "roles" USING btree ("organisation_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "fk_user_schedule_idx" ON "submission" USING btree ("user_uuid");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "fk_problem_schedule_idx" ON "submission" USING btree ("problem_uuid");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "fk_submitted_schedule_idx" ON "submission" USING btree ("submitted_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "fk_course_topic_idx" ON "topic" USING btree ("course_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "topic_slug_idx" ON "topic" USING btree ("slug");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "fk_topic_image_idx" ON "topic" USING btree ("image_uuid");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "fk_problemcollection_organisation_idx" ON "user_problem" USING btree ("organisation_uuid");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "fk_user_problem_idx" ON "user_problem" USING btree ("user_uuid");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "fk_problem_idx" ON "user_problem" USING btree ("problem_uuid");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "email_idx" ON "user" USING btree ("email");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "fk_users_organisation_idx" ON "user" USING btree ("organisation_uuid");