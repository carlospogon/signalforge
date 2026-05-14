import { articleVisuals } from "@/data/article-visuals";
import { Article } from "@/types/article";
import { EditorialImage } from "@/components/ui/editorial-image";

type ArticleVisualProps = {
  article: Article;
  className: string;
  priority?: boolean;
  sizes?: string;
  presentation?: "cover" | "framed";
};

export function ArticleVisual({
  article,
  className,
  priority = false,
  sizes,
  presentation = "cover"
}: ArticleVisualProps) {
  const visual = articleVisuals[article.id];

  if (visual?.mode === "asset" && visual.src) {
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
