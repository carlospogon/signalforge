import { CategorySlug } from "@/types/article";

export type EditorialCategory = Exclude<CategorySlug, "energia">;

export type SourceType = "rss" | "api" | "paper_feed" | "press" | "mock";

export type ReliabilityLevel = "alta" | "media" | "experimental";

export type PollFrequency = "15m" | "1h" | "6h" | "12h" | "24h";

export type EditorialRisk = "bajo" | "medio" | "alto";

export type EditorialPriority = "baja" | "media" | "alta" | "urgente";

export type EditorialAction = "autopublish_candidate" | "review_required" | "manual_only";

export type DraftState =
  | "imported"
  | "draft"
  | "needs_review"
  | "approved"
  | "published"
  | "rejected";

export type DraftType = "radar" | "analysis" | "opinion";

export type EditorialSource = {
  id: string;
  nombre: string;
  url: string;
  tipo: SourceType;
  categoriaPrincipal: EditorialCategory;
  idioma: "es" | "en";
  nivelFiabilidad: ReliabilityLevel;
  frecuenciaConsulta: PollFrequency;
  permiteAutopublicacion: boolean;
  requiereRevision: boolean;
};

export type SourceSignal = {
  id: string;
  sourceId: string;
  tituloOriginal: string;
  urlOriginal: string;
  guidOriginal?: string;
  fechaPublicacion: string;
  resumenOriginal: string;
  palabrasClave: string[];
  imagenUrl?: string;
  imagenAlt?: string;
};

export type EditorialClassification = {
  categoria: EditorialCategory;
  relevancia: number;
  riesgoEditorial: EditorialRisk;
  prioridadPublicacion: EditorialPriority;
  accionSugerida: EditorialAction;
  formatoSugerido: DraftType;
};

export type ImportedSignal = {
  id: string;
  tituloOriginal: string;
  urlOriginal: string;
  guidOriginal?: string;
  fuente: EditorialSource;
  fechaPublicacion: string;
  resumenOriginal: string;
  palabrasClave: string[];
  categoriaSugerida: EditorialCategory;
  fechaIngesta: string;
  hashUnico: string;
  imagenUrl?: string;
  imagenAlt?: string;
  clasificacion: EditorialClassification;
};

export type DraftArticle = {
  id: string;
  titulo: string;
  slug: string;
  subtitulo: string;
  entradilla: string;
  cuerpo: string[];
  categoria: EditorialCategory;
  etiquetas: string[];
  fuentesConsultadas: Array<{
    nombre: string;
    url: string;
    tipo: SourceType;
  }>;
  estado: DraftState;
  autor: string;
  tipo: DraftType;
  fechaCreacion: string;
  fechaPublicacionOriginal: string;
  fechaCaptura: string;
  tiempoLectura: string;
  seo: {
    canonicalPath: string;
    openGraphTitle: string;
    openGraphDescription: string;
    twitterTitle: string;
    twitterDescription: string;
    fuenteOriginal: string;
    fechaCaptura: string;
    fechaPublicacionOriginal: string;
  };
  fuente: {
    id: string;
    nombre: string;
    urlOriginal: string;
    tituloOriginal?: string;
    resumenOriginal?: string;
    imagenUrl?: string;
    imagenAlt?: string;
  };
  riesgoEditorial: EditorialRisk;
  prioridadPublicacion: EditorialPriority;
  accionSugerida: EditorialAction;
  originalSignalId: string;
};
