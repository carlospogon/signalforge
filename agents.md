# AGENTS.md — signalForge / Synaptik

## Contexto del proyecto

Este repositorio se llama `signalForge`.

El objetivo del proyecto es construir la plataforma digital de **Synaptik**, un medio editorial profesional especializado en ciencia, tecnología e innovación.

Synaptik no debe parecer un blog nuevo ni genérico, sino una revista digital consolidada, moderna y con autoridad editorial.

Lema editorial:

> “No perseguimos titulares. Interpretamos señales.”

La web debe transmitir:

- autoridad editorial;
- profundidad analítica;
- estética tecnológica y premium;
- sensación de medio consolidado;
- orientación a ciencia, tecnología, IA, ciberseguridad, espacio, biotech y cultura digital.

## Stack obligatorio

El proyecto debe construirse con:

- Next.js
- TypeScript
- Tailwind CSS
- Vercel como hosting
- GitHub como repositorio
- Cloudflare para dominio/DNS

Prioridades técnicas:

- SEO sólido mediante SSR o SSG.
- Diseño responsive mobile-first.
- Alto rendimiento y Core Web Vitals.
- Arquitectura limpia, modular y escalable.
- Separación clara entre layout, componentes, datos y lógica.

## Identidad visual

Inspiración visual:

- Xataka
- Genbeta
- Wired

Pero con identidad propia.

Estilo:

- Dark mode dominante.
- Negro, azul oscuro, cyan/neón.
- Tipografía moderna y tecnológica.
- Diseño limpio, sobrio y premium.
- Futurista, pero sin exagerar.

Evitar:

- estética de blog amateur;
- exceso de colores;
- diseño sobrecargado;
- sensación de plantilla genérica.

## Estructura principal de la homepage MVP

La primera versión debe incluir:

1. Header
   - Logo Synaptik
   - Menú: IA, Ciencia, Tecnología, Espacio, Biotech, Ciberseguridad, Opinión, Laboratorio
   - Buscador
   - Newsletter

2. Hero principal
   - Artículo destacado
   - Imagen impactante
   - Título fuerte
   - Extracto
   - Autor
   - Tiempo de lectura

3. Columna lateral tipo Radar
   - Noticias rápidas
   - Tendencias
   - Última hora

4. Secciones por categorías
   - Grid de artículos
   - Cards con categoría, título, extracto e icono

5. Métricas de autoridad editorial
   - Desde 2012
   - +12.500 artículos
   - +2.5M lectores/mes
   - 150+ países

6. Manifiesto Synaptik
   - Enfoque editorial
   - Valores
   - Diferenciación frente a medios basados en clickbait

## Tono editorial

El lenguaje debe ser:

- profesional;
- analítico;
- claro;
- sobrio;
- sin sensacionalismo;
- sin clickbait.

Los titulares deben ser potentes, pero no vacíos.

Synaptik debe priorizar contexto, interpretación y pensamiento crítico.

## Arquitectura recomendada

Usar una estructura limpia similar a:

```txt
src/
  app/
    page.tsx
    layout.tsx
    globals.css
  components/
    layout/
    home/
    articles/
    ui/
  data/
    articles.ts
    categories.ts
  lib/
    utils.ts
  types/
    article.ts
