export type CategorySlug =
  | "ia"
  | "ciencia"
  | "tecnologia"
  | "espacio"
  | "salud"
  | "energia"
  | "biotech"
  | "ciberseguridad"
  | "opinion"
  | "laboratorio";

export type Article = {
  id: string;
  title: string;
  excerpt: string;
  category: CategorySlug;
  author: string;
  readingTime: string;
  publishedAt: string;
  accent: string;
  tag: string;
  deck?: string;
  body: string[];
  visual?: ArticleVisual;
};

export type ArticleVisual = {
  mode: "gradient" | "asset";
  overlay?: string;
  src?: string;
  alt?: string;
  objectPosition?: string;
  width?: number;
  height?: number;
};

export type Category = {
  slug: CategorySlug;
  label: string;
  description: string;
  icon: string;
};

export type RadarItem = {
  title: string;
  category: string;
  timestamp: string;
};
