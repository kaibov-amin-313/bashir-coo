"use client";

import { useEffect, useState } from "react";
import styles from "./Preloader.module.css";

/**
 * Bashir&Co — Preloader.
 *
 * Shows on every load of the homepage. The wordmark's eleven letterform
 * paths are drawn in by stroke — the `vivus` technique: each path starts
 * with its own dash-offset equal to its length, then animates to zero,
 * so the outline appears to be written, before the fill settles in. Each
 * letter starts slightly after the last (staggered via animation-delay)
 * so the word reads as being written left to right rather than all
 * letters materialising in lockstep.
 *
 * Once the page's assets are in — or a hard ceiling is hit, whichever
 * comes first — the whole screen fades away. The ceiling matters: never
 * hold the visitor hostage to one slow asset.
 *
 * Scroll is locked while it's up; the markup is aria-hidden since this
 * is decoration, not content a screen reader should announce.
 */

const MIN_MS = 1600; // let the draw actually finish, not flash
const MAX_MS = 3500; // never hold the page hostage to a slow asset

export function Preloader() {
  const [hidden, setHidden] = useState(false);
  const [removed, setRemoved] = useState(false);

  useEffect(() => {
    const start = Date.now();
    let done = false;

    const finish = () => {
      if (done) return;
      done = true;
      const elapsed = Date.now() - start;
      const wait = Math.max(0, MIN_MS - elapsed);
      window.setTimeout(() => setHidden(true), wait);
    };

    if (document.readyState === "complete") {
      finish();
    } else {
      window.addEventListener("load", finish, { once: true });
    }

    const ceiling = window.setTimeout(finish, MAX_MS);

    return () => {
      window.removeEventListener("load", finish);
      window.clearTimeout(ceiling);
    };
  }, []);

  useEffect(() => {
    if (removed) return;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = previous;
    };
  }, [removed]);

  useEffect(() => {
    if (!hidden) return;
    const t = window.setTimeout(() => setRemoved(true), 700);
    return () => window.clearTimeout(t);
  }, [hidden]);

  if (removed) return null;

  return (
    <div
      className={[styles.root, hidden ? styles.hidden : ""].filter(Boolean).join(" ")}
      aria-hidden="true"
    >
      <div className={styles.markWrap}>
        <svg
          className={styles.mark}
          viewBox="0 0 495 206"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g
            className={styles.strokeGroup}
            transform="translate(0,206) scale(0.1,-0.1)"
          >
          <path d="M1999 1566 c-85 -30 -150 -88 -193 -174 -53 -106 -266 -628 -266 -654 0 -4 15 -8 33 -8 31 0 34 4 97 127 81 157 167 289 225 342 47 43 66 49 84 28 14 -18 9 -34 -78 -251 -40 -99 -71 -189 -69 -199 10 -64 97 -41 185 49 35 35 63 70 63 77 -1 6 -16 -5 -35 -27 -40 -45 -93 -86 -112 -86 -23 0 -14 32 61 220 89 224 93 239 68 270 l-19 24 -49 -19 c-68 -26 -144 -102 -225 -224 -38 -57 -69 -102 -69 -99 0 11 141 350 179 430 54 113 111 168 175 168 49 0 56 -6 71 -64 13 -49 29 -55 50 -22 50 75 -62 133 -176 92z" style={{ animationDelay: "0ms" }} pathLength={1} />
          <path d="M4219 1556 c-157 -56 -322 -291 -390 -553 -32 -127 -22 -211 31 -258 32 -29 137 -27 205 3 48 22 51 25 85 109 19 47 37 91 39 97 2 6 -15 -17 -38 -51 -57 -84 -142 -160 -188 -169 -51 -10 -83 27 -83 95 0 82 46 239 119 404 85 195 226 346 300 322 30 -9 44 -57 39 -139 -2 -41 -3 -74 -2 -73 5 5 74 182 74 188 0 13 -80 39 -118 39 -20 -1 -53 -7 -73 -14z" style={{ animationDelay: "90ms" }} pathLength={1} />
          <path d="M498 1548 c7 -7 12 -24 12 -38 0 -28 -245 -645 -283 -713 -12 -22 -33 -45 -47 -53 -22 -13 -11 -14 115 -11 129 3 144 5 193 30 69 36 128 98 163 172 53 110 34 197 -49 232 l-34 14 59 29 c74 34 128 87 159 154 42 89 27 153 -42 182 -44 18 -264 20 -246 2z m205 -9 c44 -23 48 -59 17 -145 -45 -128 -122 -204 -208 -204 -23 0 -42 3 -41 8 0 4 31 79 67 167 52 123 73 162 92 172 31 16 45 16 73 2z m-140 -380 c38 -17 51 -50 43 -111 -8 -61 -61 -176 -105 -230 -55 -65 -168 -102 -190 -60 -7 13 9 63 63 197 40 99 75 188 79 198 8 20 71 24 110 6z" style={{ animationDelay: "180ms" }} pathLength={1} />
          <path d="M3370 1484 c-85 -48 -140 -151 -140 -263 l0 -57 -70 -48 c-121 -83 -188 -178 -198 -279 -13 -138 127 -189 296 -106 l63 31 28 -31 c36 -38 84 -41 149 -10 41 20 102 92 89 105 -3 3 -13 -8 -21 -25 -38 -72 -98 -77 -142 -11 l-27 40 27 35 c28 37 86 152 86 172 0 19 60 63 86 63 13 0 24 5 24 10 0 6 -48 10 -125 10 -77 0 -125 -4 -125 -10 0 -5 17 -10 38 -10 26 0 45 -7 57 -20 16 -18 17 -26 6 -74 -13 -61 -67 -154 -81 -140 -13 13 -56 183 -71 276 -24 158 6 287 80 335 44 29 76 29 96 0 13 -20 13 -30 1 -75 l-13 -52 27 0 c22 0 30 6 39 31 17 49 13 78 -14 104 -34 34 -103 34 -165 -1z m-120 -479 c7 -38 24 -103 37 -143 13 -39 21 -77 18 -82 -15 -24 -92 -54 -142 -54 -45 -1 -57 3 -80 27 -64 63 -20 231 88 339 l53 53 7 -35 c3 -19 12 -66 19 -105z" style={{ animationDelay: "270ms" }} pathLength={1} />
          <path d="M2344 1471 c-34 -25 -85 -91 -70 -91 3 0 26 15 50 34 24 18 56 36 70 40 17 4 26 13 26 26 0 29 -30 25 -76 -9z" style={{ animationDelay: "360ms" }} pathLength={1} />
          <path d="M2266 1274 c-42 -15 -126 -79 -126 -95 0 -6 19 6 42 25 44 38 63 44 71 23 3 -7 -33 -105 -79 -217 -86 -212 -98 -262 -66 -279 31 -16 111 28 170 94 28 32 50 61 47 63 -2 2 -30 -23 -62 -57 -59 -62 -79 -72 -89 -47 -3 8 35 114 85 237 50 122 91 226 91 230 0 10 -29 39 -38 38 -4 0 -25 -7 -46 -15z" style={{ animationDelay: "450ms" }} pathLength={1} />
          <path d="M2490 1272 c-44 -23 -101 -64 -95 -70 2 -2 20 6 39 18 73 45 73 8 0 -186 -31 -82 -69 -184 -85 -226 l-28 -78 38 0 c37 0 39 2 56 48 46 124 197 380 242 409 20 13 28 13 55 2 28 -12 32 -11 49 10 11 13 19 32 19 42 0 22 -34 42 -59 34 -31 -10 -104 -95 -161 -188 -29 -48 -55 -86 -57 -84 -2 2 15 53 37 113 47 124 49 168 10 171 -14 2 -41 -5 -60 -15z" style={{ animationDelay: "540ms" }} pathLength={1} />
          <path d="M4461 1268 c-122 -60 -221 -230 -221 -377 0 -75 23 -124 70 -148 93 -47 241 52 315 210 70 149 64 281 -15 322 -41 21 -98 19 -149 -7z m124 -8 c43 -48 -11 -276 -98 -413 -81 -125 -162 -142 -174 -36 -12 105 86 360 166 432 46 41 79 47 106 17z" style={{ animationDelay: "630ms" }} pathLength={1} />
          <path d="M1009 1260 c-19 -10 -58 -39 -87 -65 -177 -159 -260 -471 -123 -467 63 2 119 51 201 177 29 44 50 72 46 62 -32 -97 -47 -161 -44 -193 3 -33 7 -39 28 -42 32 -4 110 47 151 99 43 55 32 57 -20 4 -72 -74 -112 -72 -91 4 6 23 29 85 51 139 61 145 111 283 107 288 -3 2 -19 -1 -37 -7 -26 -9 -35 -8 -50 5 -24 21 -87 20 -132 -4z m119 -12 c20 -20 14 -41 -48 -168 -100 -201 -192 -327 -236 -318 -44 8 -22 163 41 288 78 156 192 249 243 198z" style={{ animationDelay: "810ms" }} pathLength={1} />
          <path d="M1425 1261 c-43 -26 -61 -50 -75 -97 -13 -45 -5 -88 44 -219 29 -80 32 -124 11 -165 -29 -55 -82 -51 -121 11 -25 40 -41 48 -62 27 -38 -38 15 -88 92 -88 75 0 135 33 164 90 30 59 26 107 -22 229 -45 114 -47 172 -5 204 35 25 59 16 84 -30 27 -51 60 -53 60 -3 0 27 -6 37 -25 47 -37 19 -110 16 -145 -6z" style={{ animationDelay: "900ms" }} pathLength={1} />
          </g>
        </svg>
      </div>
    </div>
  );
}
