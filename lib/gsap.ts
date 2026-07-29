"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

/**
 * Bashir&Co — GSAP registration (client-only).
 *
 * The single place plugins are registered (Production Architecture Plan
 * Ch.7: "registered once, globally, before any trigger is created").
 * The `"use client"` directive means this module can never execute during
 * server render — importing GSAP from here, rather than from "gsap"
 * directly, is what guarantees every consumer inherits that safety.
 *
 * Rule for every future phase: components import { gsap, ScrollTrigger }
 * from "@/lib/gsap", never from the packages directly. A direct
 * `import gsap from "gsap"` in a component file bypasses this module's
 * registration guarantee and is a defect.
 */
gsap.registerPlugin(ScrollTrigger, useGSAP);

export { gsap, ScrollTrigger, useGSAP };
