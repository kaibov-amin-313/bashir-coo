"use client";

import { useEffect, useRef, useState } from "react";
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
 * Guards the hydration race: if the browser finishes loading the <img>
 * before React attaches onLoad (common for cached/fast images), the
 * mount effect detects img.complete and reveals it anyway.
 */

interface MediaSlotProps {
  src?: string;
  fallbackKind: PlaceholderKind;
  alt?: string;
  priority?: boolean;
  label?: string;
  className?: string;
}

export function MediaSlot({
  src,
  fallbackKind,
  alt = "",
  priority = false,
  label,
  className,
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
        // eslint-disable-next-line @next/next/no-img-element
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          className={[styles.image, loaded ? styles.imageLoaded : ""]
            .filter(Boolean)
            .join(" ")}
          loading={priority ? "eager" : "lazy"}
          onLoad={(e) => {
            if ((e.target as HTMLImageElement).naturalWidth > 0) setLoaded(true);
            else setFailed(true);
          }}
          onError={() => setFailed(true)}
        />
      ) : null}
    </div>
  );
}
