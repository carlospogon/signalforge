import type { CSSProperties } from "react";
import Image from "next/image";

type EditorialImageProps = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  className?: string;
  imageClassName?: string;
  objectPosition?: string;
  sizes?: string;
  overlayClassName?: string;
  overlayStyle?: CSSProperties;
  presentation?: "cover" | "framed";
};

export function EditorialImage({
  src,
  alt,
  width,
  height,
  priority = false,
  className = "",
  imageClassName = "",
  objectPosition = "center center",
  sizes = "(max-width: 768px) 100vw, 1200px",
  overlayClassName = "",
  overlayStyle,
  presentation = "cover"
}: EditorialImageProps) {
  if (presentation === "framed" && width && height) {
    return (
      <div className={`relative overflow-hidden bg-slate-900 ${className}`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(94,242,255,0.2),transparent_22%),radial-gradient(circle_at_82%_24%,rgba(59,130,246,0.24),transparent_20%),linear-gradient(135deg,rgba(7,16,24,0.36),rgba(7,16,24,0.92))]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(24,48,77,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(24,48,77,0.16)_1px,transparent_1px)] bg-[size:28px_28px] opacity-60" />
        <div className="relative flex h-full items-center justify-center p-6 sm:p-8 lg:p-10">
          <div className="rounded-[1.6rem] border border-white/10 bg-[#08111a]/80 p-2 shadow-[0_18px_50px_rgba(0,0,0,0.35)] backdrop-blur">
            <Image
              src={src}
              alt={alt}
              width={width}
              height={height}
              priority={priority}
              sizes={sizes}
              className={`h-auto max-h-[70vh] w-auto max-w-full rounded-[1.1rem] object-contain ${imageClassName}`}
              style={{ objectPosition }}
            />
          </div>
        </div>
        {overlayClassName || overlayStyle ? (
          <div className={`absolute inset-0 ${overlayClassName}`} style={overlayStyle} />
        ) : null}
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden bg-slate-900 ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className={`object-cover ${imageClassName}`}
        style={{ objectPosition }}
      />
      {overlayClassName || overlayStyle ? (
        <div className={`absolute inset-0 ${overlayClassName}`} style={overlayStyle} />
      ) : null}
    </div>
  );
}
