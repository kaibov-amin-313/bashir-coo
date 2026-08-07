"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { PlaceholderMedia, type PlaceholderKind } from "@/components/media";
import styles from "./MediaSlot.module.css";

/**
 * Bashir&Co — MediaSlot.
 *
 * The editorial placeholder ALWAYS renders as the base layer, so the
 * frame is never empty. When a real photo exists at `src`, it loads on
 * top and fades in once decoded; if it errors it stays hidden and the
 * placeholder shows through. Real photos replace placeholders 1:1 with
 * no layout change.
 *
 * The photo goes through next/image rather than a bare <img>: the source
 * JPEGs are full-resolution (the homepage hero alone is 492 KB) and a
 * phone was downloading exactly the same file as a desktop. next/image
 * re-encodes to AVIF/WebP and serves a width suited to the device, which
 * is the largest weight saving available on a site whose first
 * impression is a full-bleed photograph.
 *
 * `sizes` is how the right width gets chosen, and it can't be guessed
 * from inside this component — a hero fills the viewport while a cart
 * thumbnail is 76px wide. Callers that aren't full-bleed should say so;
 * the default assumes they are, which is wasteful rather than broken if
 * left unset.
 *
 * Guards the hydration race: if the browser finishes loading the image
 * before React attaches onLoad (common for cached images), the mount
 * effect detects img.complete and reveals it anyway.
 */

interface MediaSlotProps {
  src?: string;
  fallbackKind: PlaceholderKind;
  alt?: string;
  priority?: boolean;
  label?: string;
  className?: string;
  /** CSS `sizes` for srcset selection. Defaults to full viewport width. */
  sizes?: string;
}

export function MediaSlot({
  src,
  fallbackKind,
  alt = "",
  priority = false,
  label,
  className,
  sizes = "100vw",
}: MediaSlotProps) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const showImage = src && !failed;

  // Catch images that finished loading before onLoad was wired up.
  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;
    if (img.complete) {
      if (img.naturalWidth > 0) setLoaded(true);
      else setFailed(true);
    }
  }, [src]);

  return (
    <div className={[styles.slot, className].filter(Boolean).join(" ")}>
      <PlaceholderMedia
        kind={fallbackKind}
        slot={src ?? fallbackKind}
        label={label}
        className={styles.fallback}
      />
      {showImage ? (
        <Image
          ref={imgRef}
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          className={[styles.image, loaded ? styles.imageLoaded : ""]
            .filter(Boolean)
            .join(" ")}
          priority={priority}
          onLoad={(e) => {
            const img = e.target as HTMLImageElement;
            if (img.naturalWidth > 0) setLoaded(true);
            else setFailed(true);
          }}
          onError={() => setFailed(true)}
        />
      ) : null}
    </div>
  );
}
