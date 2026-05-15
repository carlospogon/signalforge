CREATE TABLE "published_articles" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"draft_id" varchar(128) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"titulo" text NOT NULL,
	"excerpt" text NOT NULL,
	"deck" text,
	"cuerpo" text[] NOT NULL,
	"categoria" "editorial_category" NOT NULL,
	"autor" varchar(255) NOT NULL,
	"tiempo_lectura" varchar(32) NOT NULL,
	"accent" varchar(255) NOT NULL,
	"tag" varchar(64) NOT NULL,
	"published_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "published_articles" ADD CONSTRAINT "published_articles_draft_id_draft_articles_id_fk" FOREIGN KEY ("draft_id") REFERENCES "public"."draft_articles"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "published_articles_slug_unique_idx" ON "published_articles" USING btree ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX "published_articles_draft_unique_idx" ON "published_articles" USING btree ("draft_id");--> statement-breakpoint
CREATE INDEX "published_articles_category_date_idx" ON "published_articles" USING btree ("categoria","published_at");