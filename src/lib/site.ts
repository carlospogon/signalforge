function resolveSiteUrl() {
  const value = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (!value) {
    return "https://synaptik.vercel.app";
  }

  return value.startsWith("http://") || value.startsWith("https://") ? value : `https://${value}`;
}

export const siteConfig = {
  name: "Synaptik",
  description:
    "Revista digital editorial sobre ciencia, tecnologia, IA, ciberseguridad, espacio, biotech y cultura digital.",
  url: resolveSiteUrl(),
  contactEmail: "contacto@synaptik.media",
  newsletterEmail: "newsletter@synaptik.media",
  partnershipsEmail: "alianzas@synaptik.media",
  eventsEmail: "agenda@synaptik.media"
} as const;
