import {
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  varchar
} from "drizzle-orm/pg-core";

export const sourceTypeEnum = pgEnum("source_type", ["rss", "api", "paper_feed", "press", "mock"]);
export const categoryEnum = pgEnum("editorial_category", [
  "ia",
  "ciencia",
  "tecnologia",
  "espacio",
  "salud",
  "biotech",
  "ciberseguridad",
  "laboratorio",
  "opinion"
]);
export const reliabilityEnum = pgEnum("reliability_level", ["alta", "media", "experimental"]);
export const frequencyEnum = pgEnum("poll_frequency", ["15m", "1h", "6h", "12h", "24h"]);
export const riskEnum = pgEnum("editorial_risk", ["bajo", "medio", "alto"]);
export const priorityEnum = pgEnum("editorial_priority", ["baja", "media", "alta", "urgente"]);
export const actionEnum = pgEnum("editorial_action", [
  "autopublish_candidate",
  "review_required",
  "manual_only"
]);
export const draftStateEnum = pgEnum("draft_state", [
  "imported",
  "draft",
  "needs_review",
  "approved",
  "published",
  "rejected"
]);
export const draftTypeEnum = pgEnum("draft_type", ["radar", "analysis", "opinion"]);
export const languageEnum = pgEnum("editorial_language", ["es", "en"]);

export const sources = pgTable(
  "sources",
  {
    id: varchar("id", { length: 128 }).primaryKey(),
    nombre: varchar("nombre", { length: 255 }).notNull(),
    url: text("url").notNull(),
    tipo: sourceTypeEnum("tipo").notNull(),
    categoriaPrincipal: categoryEnum("categoria_principal").notNull(),
    idioma: languageEnum("idioma").notNull(),
    nivelFiabilidad: reliabilityEnum("nivel_fiabilidad").notNull(),
    frecuenciaConsulta: frequencyEnum("frecuencia_consulta").notNull(),
    permiteAutopublicacion: boolean("permite_autopublicacion").notNull().default(false),
    requiereRevision: boolean("requiere_revision").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
  },
  (table) => ({
    urlUniqueIdx: uniqueIndex("sources_url_unique_idx").on(table.url)
  })
);

export const importedSignals = pgTable(
  "imported_signals",
  {
    id: varchar("id", { length: 128 }).primaryKey(),
    sourceId: varchar("source_id", { length: 128 })
      .notNull()
      .references(() => sources.id, { onDelete: "restrict" }),
    tituloOriginal: text("titulo_original").notNull(),
    urlOriginal: text("url_original").notNull(),
    guidOriginal: varchar("guid_original", { length: 255 }),
    fechaPublicacion: timestamp("fecha_publicacion", { withTimezone: true }).notNull(),
    resumenOriginal: text("resumen_original").notNull(),
    palabrasClave: text("palabras_clave").array().notNull().default([]),
    categoriaSugerida: categoryEnum("categoria_sugerida").notNull(),
    relevancia: integer("relevancia").notNull(),
    riesgoEditorial: riskEnum("riesgo_editorial").notNull(),
    prioridadPublicacion: priorityEnum("prioridad_publicacion").notNull(),
    accionSugerida: actionEnum("accion_sugerida").notNull(),
    formatoSugerido: draftTypeEnum("formato_sugerido").notNull(),
    fechaIngesta: timestamp("fecha_ingesta", { withTimezone: true }).notNull(),
    hashUnico: varchar("hash_unico", { length: 128 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
  },
  (table) => ({
    sourceDateIdx: index("imported_signals_source_date_idx").on(table.sourceId, table.fechaPublicacion),
    urlUniqueIdx: uniqueIndex("imported_signals_url_unique_idx").on(table.urlOriginal),
    guidUniqueIdx: uniqueIndex("imported_signals_guid_unique_idx").on(table.guidOriginal),
    hashUniqueIdx: uniqueIndex("imported_signals_hash_unique_idx").on(table.hashUnico)
  })
);

export const draftArticles = pgTable(
  "draft_articles",
  {
    id: varchar("id", { length: 128 }).primaryKey(),
    signalId: varchar("signal_id", { length: 128 })
      .notNull()
      .references(() => importedSignals.id, { onDelete: "cascade" }),
    sourceId: varchar("source_id", { length: 128 })
      .notNull()
      .references(() => sources.id, { onDelete: "restrict" }),
    titulo: text("titulo").notNull(),
    slug: varchar("slug", { length: 255 }).notNull(),
    subtitulo: text("subtitulo").notNull(),
    entradilla: text("entradilla").notNull(),
    cuerpo: text("cuerpo").array().notNull(),
    categoria: categoryEnum("categoria").notNull(),
    etiquetas: text("etiquetas").array().notNull().default([]),
    fuentesConsultadas: jsonb("fuentes_consultadas").notNull(),
    estado: draftStateEnum("estado").notNull(),
    autor: varchar("autor", { length: 255 }).notNull(),
    tipo: draftTypeEnum("tipo").notNull(),
    fechaCreacion: timestamp("fecha_creacion", { withTimezone: true }).notNull(),
    fechaPublicacionOriginal: timestamp("fecha_publicacion_original", { withTimezone: true }).notNull(),
    fechaCaptura: timestamp("fecha_captura", { withTimezone: true }).notNull(),
    tiempoLectura: varchar("tiempo_lectura", { length: 32 }).notNull(),
    seo: jsonb("seo").notNull(),
    fuente: jsonb("fuente").notNull(),
    riesgoEditorial: riskEnum("riesgo_editorial").notNull(),
    prioridadPublicacion: priorityEnum("prioridad_publicacion").notNull(),
    accionSugerida: actionEnum("accion_sugerida").notNull(),
    publishedArticleId: varchar("published_article_id", { length: 128 }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
  },
  (table) => ({
    slugUniqueIdx: uniqueIndex("draft_articles_slug_unique_idx").on(table.slug),
    signalUniqueIdx: uniqueIndex("draft_articles_signal_unique_idx").on(table.signalId),
    stateIdx: index("draft_articles_state_idx").on(table.estado, table.createdAt)
  })
);

export const publicationReviews = pgTable(
  "publication_reviews",
  {
    id: varchar("id", { length: 128 }).primaryKey(),
    draftId: varchar("draft_id", { length: 128 })
      .notNull()
      .references(() => draftArticles.id, { onDelete: "cascade" }),
    reviewerName: varchar("reviewer_name", { length: 255 }).notNull(),
    decision: draftStateEnum("decision").notNull(),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
  },
  (table) => ({
    draftIdx: index("publication_reviews_draft_idx").on(table.draftId, table.createdAt)
  })
);

export const publishedArticles = pgTable(
  "published_articles",
  {
    id: varchar("id", { length: 128 }).primaryKey(),
    draftId: varchar("draft_id", { length: 128 })
      .notNull()
      .references(() => draftArticles.id, { onDelete: "restrict" }),
    slug: varchar("slug", { length: 255 }).notNull(),
    titulo: text("titulo").notNull(),
    excerpt: text("excerpt").notNull(),
    deck: text("deck"),
    cuerpo: text("cuerpo").array().notNull(),
    categoria: categoryEnum("categoria").notNull(),
    autor: varchar("autor", { length: 255 }).notNull(),
    tiempoLectura: varchar("tiempo_lectura", { length: 32 }).notNull(),
    accent: varchar("accent", { length: 255 }).notNull(),
    tag: varchar("tag", { length: 64 }).notNull(),
    visualUrl: text("visual_url"),
    visualAlt: text("visual_alt"),
    publishedAt: timestamp("published_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
  },
  (table) => ({
    slugUniqueIdx: uniqueIndex("published_articles_slug_unique_idx").on(table.slug),
    draftUniqueIdx: uniqueIndex("published_articles_draft_unique_idx").on(table.draftId),
    categoryDateIdx: index("published_articles_category_date_idx").on(table.categoria, table.publishedAt)
  })
);
