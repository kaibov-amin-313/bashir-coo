import styles from "./PlaceholderMedia.module.css";

/**
 * Bashir&Co — PlaceholderMedia (neutral photo-frame).
 *
 * A calm, restrained stand-in for real photography: graded tonal ground,
 * soft light, a small uppercase label naming the intended subject. NOT a
 * fake object render. Replaced 1:1 by real photos through MediaSlot.
 */

export type PlaceholderKind =
  | "lightSurface" | "macroTexture" | "objectSilhouette" | "interiorAtmosphere"
  | "finalHeldBreath" | "collectionRoom" | "watchSurface" | "macroMetal"
  | "macroFabric" | "macroLeather" | "macroStone" | "jewelryLight" | "rareObject"
  | "editorialLifestyle" | "cashmere" | "suede" | "leather" | "stone" | "silk"
  | "watchMetal" | "bagLeather" | "interiorWarm" | "productStill";

const FAMILY: Record<PlaceholderKind, string> = {
  lightSurface: "interior", macroTexture: "clothing", objectSilhouette: "stone",
  interiorAtmosphere: "interior", finalHeldBreath: "interior", collectionRoom: "interior",
  watchSurface: "watch", macroMetal: "bag", macroFabric: "clothing", macroLeather: "leather",
  macroStone: "stone", jewelryLight: "jewelry", rareObject: "stone",
  editorialLifestyle: "editorial", cashmere: "clothing", suede: "leather", leather: "leather",
  stone: "stone", silk: "clothing", watchMetal: "watch", bagLeather: "bag",
  interiorWarm: "interior", productStill: "stone",
};

interface PlaceholderMediaProps {
  kind: PlaceholderKind;
  slot: string;
  singularColor?: boolean;
  temperature?: "warm" | "cool";
  /** Optional label shown inside the frame (e.g. "BASHIR&CO"). */
  label?: string;
  className?: string;
}

export function PlaceholderMedia({
  kind, slot, label, className,
}: PlaceholderMediaProps) {
  const family = FAMILY[kind];
  return (
    <div
      aria-hidden="true"
      data-media-slot={slot}
      className={[styles.base, styles[family], className].filter(Boolean).join(" ")}
    >
      <div className={styles.object}>
        <span className={styles.label}>{label ?? "BASHIR&CO"}</span>
      </div>
    </div>
  );
}
