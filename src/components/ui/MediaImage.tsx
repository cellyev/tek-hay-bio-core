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

import { isMediaVideo } from "@/lib/gallery/utils";

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

  const isVideo = isMediaVideo(media);
  const videoThumbnailUrl = (media as any).videoThumbnail?.url;

  // If it's a video without a thumbnail image, render an HTML5 video preview instead of crashing Next.js Image
  if (isVideo && !videoThumbnailUrl) {
    return (
      <div
        className={`${fill ? "absolute inset-0" : "relative w-full h-auto"} bg-stone-900 overflow-hidden ${className}`}
        style={!fill && width ? { maxWidth: width } : undefined}
      >
        <video
          src={media.url}
          preload="metadata"
          muted
          playsInline
          className={fill ? "w-full h-full object-cover" : "w-full h-auto object-cover"}
        />
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center pointer-events-none">
          <div className="w-10 h-10 rounded-full bg-black/60 text-white flex items-center justify-center backdrop-blur-sm border border-white/20 shadow-lg">
            <svg className="w-5 h-5 text-amber-400 fill-amber-400 ml-0.5" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </div>
    );
  }

  const imageUrl = videoThumbnailUrl || media.url;
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
