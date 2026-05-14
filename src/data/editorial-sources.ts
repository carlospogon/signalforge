import { EditorialSource } from "@/types/editorial";

export const editorialSources: EditorialSource[] = [
  {
    id: "openai-news-rss",
    nombre: "OpenAI News RSS",
    url: "https://openai.com/news/rss.xml",
    tipo: "rss",
    categoriaPrincipal: "ia",
    idioma: "en",
    nivelFiabilidad: "alta",
    frecuenciaConsulta: "1h",
    permiteAutopublicacion: true,
    requiereRevision: false
  },
  {
    id: "mit-technology-review-ai",
    nombre: "MIT Technology Review AI",
    url: "https://www.technologyreview.com/feed/",
    tipo: "rss",
    categoriaPrincipal: "tecnologia",
    idioma: "en",
    nivelFiabilidad: "alta",
    frecuenciaConsulta: "6h",
    permiteAutopublicacion: false,
    requiereRevision: true
  },
  {
    id: "arxiv-cs-ai",
    nombre: "arXiv cs.AI",
    url: "https://export.arxiv.org/rss/cs.AI",
    tipo: "paper_feed",
    categoriaPrincipal: "ia",
    idioma: "en",
    nivelFiabilidad: "alta",
    frecuenciaConsulta: "12h",
    permiteAutopublicacion: true,
    requiereRevision: true
  }
];
