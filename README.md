# signalForge

MVP editorial de **Synaptik**, una revista digital centrada en ciencia, tecnologia e innovacion.

## Stack

- Next.js 15
- TypeScript
- Tailwind CSS
- Neon Postgres
- Drizzle ORM

## Desarrollo local

```bash
npm install
npm run dev
```

## Variables de entorno

Crear un archivo `.env.local` en la raiz del proyecto:

```env
DATABASE_URL=postgresql://USER:PASSWORD@YOUR_POOLER_HOST/neondb?sslmode=require&channel_binding=require
DIRECT_DATABASE_URL=postgresql://USER:PASSWORD@YOUR_DIRECT_HOST/neondb?sslmode=require&channel_binding=require
```

Notas:

- `DATABASE_URL` se usa en runtime.
- `DIRECT_DATABASE_URL` se usa para migraciones.
- No subir `.env.local` ni credenciales al repositorio.

## Base de datos

Comandos disponibles:

```bash
npm run db:generate
npm run db:migrate
```

Estado actual:

- fuentes editoriales persistidas en Neon
- ingesta RSS/Atom real
- señales importadas persistidas
- borradores editoriales persistidos

## Rutas incluidas

- `/` portada editorial
- `/admin/drafts` cola editorial interna
- `/rss.xml` feed propio
- `/categoria/[slug]` paginas de categoria
- `/articulo/[id]` paginas de articulo

## Despliegue

### 1. GitHub

- crear o conectar el repositorio Git
- confirmar que `.env.local` no entra en el commit
- subir el contenido del proyecto

### 2. Neon

- proyecto actual: `synaptik-db`
- region recomendada: `eu-central-1`
- aplicar migraciones antes o despues del primer deploy:

```bash
npm run db:migrate
```

### 3. Vercel

- importar el repositorio desde GitHub
- anadir estas variables de entorno en Vercel:
  - `DATABASE_URL`
  - `DIRECT_DATABASE_URL`
- lanzar el deploy

## Comprobaciones recomendadas antes de publicar

```bash
npm run lint
npm run typecheck
npm run build
```

## Estructura

```txt
src/
  app/
  components/
  data/
  db/
  lib/
  types/
scripts/
drizzle/
```
