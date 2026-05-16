"use client";

import type { CSSProperties, ReactNode } from "react";
import { useState } from "react";

type RemoteArticleImageProps = {
  src: string;
  alt: string;
  className: string;
  imageClassName?: string;
  objectPosition?: string;
  overlayClassName?: string;
  overlayStyle?: CSSProperties;
  fallback: ReactNode;
};

export function RemoteArticleImage({
  src,
  alt,
  className,
  imageClassName = "",
  objectPosition = "center center",
  overlayClassName = "",
  overlayStyle,
  fallback
}: RemoteArticleImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed || !src.trim()) {
    return <>{fallback}</>;
  }

  return (
    <div className={`relative overflow-hidden bg-slate-900 ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className={`h-full w-full object-cover ${imageClassName}`}
        style={{ objectPosition }}
        onError={() => setFailed(true)}
      />
      {overlayClassName || overlayStyle ? (
        <div className={`absolute inset-0 ${overlayClassName}`} style={overlayStyle} />
      ) : null}
    </div>
  );
}
