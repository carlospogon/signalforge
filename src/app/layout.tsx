import type { Metadata } from "next";
import { IBM_Plex_Sans, Space_Grotesk } from "next/font/google";
import { siteConfig } from "@/lib/site";
import "./globals.css";

const bodyFont = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body"
});

const displayFont = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-display"
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} | Ciencia, tecnologia e innovacion`,
    template: `%s | ${siteConfig.name}`
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: ["Synaptik", "IA", "ciencia", "tecnologia", "ciberseguridad", "espacio", "biotech"],
  alternates: {
    types: {
      "application/rss+xml": `${siteConfig.url}/rss.xml`
    }
  },
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    title: `${siteConfig.name} | Ciencia, tecnologia e innovacion`,
    description: siteConfig.description,
    locale: "es_ES"
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} | Ciencia, tecnologia e innovacion`,
    description: siteConfig.description
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${bodyFont.variable} ${displayFont.variable} bg-ink text-slate-100 antialiased`}>
        {children}
      </body>
    </html>
  );
}
