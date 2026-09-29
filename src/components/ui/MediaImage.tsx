/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import Image from "next/image";

interface MediaImageProps {
  media?:
    | {
        url?: string;
        alt?: string;
        width?: number;
        height?: number;
        [key: string]: unknown;
      }
    | string
    | null;
  alt?: string;
  className?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
  priority?: boolean;
}

export function MediaImage({
  media,
  alt,
  className = "",
  fill = false,
  width,
  height,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  priority = false,
}: MediaImageProps) {
  // If no media is provided, render a neutral placeholder
  if (!media || typeof media === "string" || !media.url) {
    return (
      <div
        className={`bg-stone-200 flex items-center justify-center text-stone-400 ${className} ${fill ? "absolute inset-0" : ""}`}
        style={
          !fill
            ? {
                width: width || "100%",
                height: height || "100%",
                aspectRatio: width && height ? `${width}/${height}` : "16/9",
              }
            : {}
        }
      >
        <span className="text-sm font-medium">No Image Available</span>
      </div>
    );
  }

  const imageUrl = media.url;
  const imageAlt = alt || media.alt || "Tek Hay Bio Image";

  return (
    <div
      className={`${fill ? "absolute inset-0" : "relative w-full h-auto"} overflow-hidden ${className}`}
      style={!fill && width ? { maxWidth: width } : undefined}
    >
      <Image
        src={imageUrl}
        alt={imageAlt}
        fill={fill}
        width={!fill ? width || media.width : undefined}
        height={!fill ? height || media.height : undefined}
        sizes={sizes}
        priority={priority}
        className={fill ? "object-cover" : "w-full h-auto"}
      />
    </div>
  );
}
