CREATE TYPE "public"."editorial_action" AS ENUM('autopublish_candidate', 'review_required', 'manual_only');--> statement-breakpoint
CREATE TYPE "public"."editorial_category" AS ENUM('ia', 'ciencia', 'tecnologia', 'espacio', 'salud', 'laboratorio', 'opinion');--> statement-breakpoint
CREATE TYPE "public"."draft_state" AS ENUM('imported', 'draft', 'needs_review', 'approved', 'published', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."draft_type" AS ENUM('radar', 'analysis', 'opinion');--> statement-breakpoint
CREATE TYPE "public"."poll_frequency" AS ENUM('15m', '1h', '6h', '12h', '24h');--> statement-breakpoint
CREATE TYPE "public"."editorial_language" AS ENUM('es', 'en');--> statement-breakpoint
CREATE TYPE "public"."editorial_priority" AS ENUM('baja', 'media', 'alta', 'urgente');--> statement-breakpoint
CREATE TYPE "public"."reliability_level" AS ENUM('alta', 'media', 'experimental');--> statement-breakpoint
CREATE TYPE "public"."editorial_risk" AS ENUM('bajo', 'medio', 'alto');--> statement-breakpoint
CREATE TYPE "public"."source_type" AS ENUM('rss', 'api', 'paper_feed', 'press', 'mock');--> statement-breakpoint
CREATE TABLE "draft_articles" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"signal_id" varchar(128) NOT NULL,
	"source_id" varchar(128) NOT NULL,
	"titulo" text NOT NULL,
	"slug" varchar(255) NOT NULL,
	"entradilla" text NOT NULL,
	"cuerpo" text[] NOT NULL,
	"categoria" "editorial_category" NOT NULL,
	"etiquetas" text[] DEFAULT '{}' NOT NULL,
	"fuentes_consultadas" jsonb NOT NULL,
	"estado" "draft_state" NOT NULL,
	"autor" varchar(255) NOT NULL,
	"tipo" "draft_type" NOT NULL,
	"fecha_creacion" timestamp with time zone NOT NULL,
	"fecha_publicacion_original" timestamp with time zone NOT NULL,
	"fecha_captura" timestamp with time zone NOT NULL,
	"tiempo_lectura" varchar(32) NOT NULL,
	"seo" jsonb NOT NULL,
	"fuente" jsonb NOT NULL,
	"riesgo_editorial" "editorial_risk" NOT NULL,
	"prioridad_publicacion" "editorial_priority" NOT NULL,
	"accion_sugerida" "editorial_action" NOT NULL,
	"published_article_id" varchar(128),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "imported_signals" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"source_id" varchar(128) NOT NULL,
	"titulo_original" text NOT NULL,
	"url_original" text NOT NULL,
	"guid_original" varchar(255),
	"fecha_publicacion" timestamp with time zone NOT NULL,
	"resumen_original" text NOT NULL,
	"palabras_clave" text[] DEFAULT '{}' NOT NULL,
	"categoria_sugerida" "editorial_category" NOT NULL,
	"relevancia" integer NOT NULL,
	"riesgo_editorial" "editorial_risk" NOT NULL,
	"prioridad_publicacion" "editorial_priority" NOT NULL,
	"accion_sugerida" "editorial_action" NOT NULL,
	"formato_sugerido" "draft_type" NOT NULL,
	"fecha_ingesta" timestamp with time zone NOT NULL,
	"hash_unico" varchar(128) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "publication_reviews" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"draft_id" varchar(128) NOT NULL,
	"reviewer_name" varchar(255) NOT NULL,
	"decision" "draft_state" NOT NULL,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sources" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"nombre" varchar(255) NOT NULL,
	"url" text NOT NULL,
	"tipo" "source_type" NOT NULL,
	"categoria_principal" "editorial_category" NOT NULL,
	"idioma" "editorial_language" NOT NULL,
	"nivel_fiabilidad" "reliability_level" NOT NULL,
	"frecuencia_consulta" "poll_frequency" NOT NULL,
	"permite_autopublicacion" boolean DEFAULT false NOT NULL,
	"requiere_revision" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "draft_articles" ADD CONSTRAINT "draft_articles_signal_id_imported_signals_id_fk" FOREIGN KEY ("signal_id") REFERENCES "public"."imported_signals"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "draft_articles" ADD CONSTRAINT "draft_articles_source_id_sources_id_fk" FOREIGN KEY ("source_id") REFERENCES "public"."sources"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "imported_signals" ADD CONSTRAINT "imported_signals_source_id_sources_id_fk" FOREIGN KEY ("source_id") REFERENCES "public"."sources"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "publication_reviews" ADD CONSTRAINT "publication_reviews_draft_id_draft_articles_id_fk" FOREIGN KEY ("draft_id") REFERENCES "public"."draft_articles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "draft_articles_slug_unique_idx" ON "draft_articles" USING btree ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX "draft_articles_signal_unique_idx" ON "draft_articles" USING btree ("signal_id");--> statement-breakpoint
CREATE INDEX "draft_articles_state_idx" ON "draft_articles" USING btree ("estado","created_at");--> statement-breakpoint
CREATE INDEX "imported_signals_source_date_idx" ON "imported_signals" USING btree ("source_id","fecha_publicacion");--> statement-breakpoint
CREATE UNIQUE INDEX "imported_signals_url_unique_idx" ON "imported_signals" USING btree ("url_original");--> statement-breakpoint
CREATE UNIQUE INDEX "imported_signals_guid_unique_idx" ON "imported_signals" USING btree ("guid_original");--> statement-breakpoint
CREATE UNIQUE INDEX "imported_signals_hash_unique_idx" ON "imported_signals" USING btree ("hash_unico");--> statement-breakpoint
CREATE INDEX "publication_reviews_draft_idx" ON "publication_reviews" USING btree ("draft_id","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "sources_url_unique_idx" ON "sources" USING btree ("url");