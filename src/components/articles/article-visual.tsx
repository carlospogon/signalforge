import type { CSSProperties } from "react";
import { articleVisuals } from "@/data/article-visuals";
import { Article } from "@/types/article";
import { EditorialImage } from "@/components/ui/editorial-image";

type ArticleVisualProps = {
  article: Article;
  className: string;
  priority?: boolean;
  sizes?: string;
  presentation?: "cover" | "framed";
  imageClassName?: string;
  overlayClassName?: string;
  overlayStyle?: CSSProperties;
};

export function ArticleVisual({
  article,
  className,
  priority = false,
  sizes,
  presentation = "cover",
  imageClassName = "",
  overlayClassName = "",
  overlayStyle
}: ArticleVisualProps) {
  const visual = article.visual ?? articleVisuals[article.id];

  if (visual?.mode === "asset" && visual.src) {
    if (visual.src.startsWith("http://") || visual.src.startsWith("https://")) {
      return (
        <div className={`relative overflow-hidden bg-slate-900 ${className}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={visual.src}
            alt={visual.alt ?? article.title}
            className={`h-full w-full object-cover ${imageClassName}`}
            style={{ objectPosition: visual.objectPosition ?? "center center" }}
          />
          {overlayClassName || overlayStyle ? (
            <div className={`absolute inset-0 ${overlayClassName}`} style={overlayStyle} />
          ) : null}
        </div>
      );
    }

    return (
      <EditorialImage
        src={visual.src}
        alt={visual.alt ?? article.title}
        width={visual.width}
        height={visual.height}
        priority={priority}
        className={className}
        objectPosition={visual.objectPosition ?? "center center"}
        sizes={sizes}
        presentation={presentation}
        overlayClassName="bg-[radial-gradient(circle_at_78%_20%,rgba(99,196,255,0.16),transparent_24%)]"
        overlayStyle={
          visual.overlay
            ? {
                backgroundImage: `${visual.overlay}, radial-gradient(circle at 78% 20%, rgba(99,196,255,0.16), transparent 24%)`
              }
            : undefined
        }
      />
    );
  }

  return (
    <div className={`relative overflow-hidden bg-[#08111a] ${className}`}>
      <div className={`absolute inset-0 bg-gradient-to-br ${article.accent}`} />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_18%,rgba(95,242,255,0.28),transparent_20%),radial-gradient(circle_at_20%_80%,rgba(255,255,255,0.08),transparent_18%),linear-gradient(135deg,rgba(7,16,24,0.1),rgba(7,16,24,0.9))]" />
      <div className="absolute -right-10 top-6 h-28 w-28 rounded-full border border-white/10 bg-white/5 blur-[1px]" />
      <div className="absolute left-5 top-5 h-12 w-12 rounded-full border border-cyan-300/20 bg-cyan-300/10" />
      <div className="absolute bottom-6 left-6 right-6 border-t border-white/10 pt-4">
        <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.16em] text-white/70">
          <span>{article.tag}</span>
          <span>{article.category}</span>
        </div>
      </div>
    </div>
  );
}
