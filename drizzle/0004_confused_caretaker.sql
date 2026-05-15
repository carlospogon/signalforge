ALTER TABLE "draft_articles" ADD COLUMN "subtitulo" text;
--> statement-breakpoint
UPDATE "draft_articles" SET "subtitulo" = "entradilla" WHERE "subtitulo" IS NULL;
--> statement-breakpoint
ALTER TABLE "draft_articles" ALTER COLUMN "subtitulo" SET NOT NULL;
