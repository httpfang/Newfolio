import type { RefObject } from "react";
import gsap from "gsap";

// --- SHIMMER EFFECT STYLES ---
export const shimmerStyle = `
  .shimmer {
    position: relative;
    overflow: hidden;
  }
  .shimmer::after {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent);
    animation: shimmerMove 1.6s infinite;
  }
  @keyframes shimmerMove {
    0% { left: -100%; }
    100% { left: 100%; }
  }
`;

// --- GSAP FADE-IN ON DATA LOAD ---
export function gsapFadeIn(ref: RefObject<Element>): void {
  if (ref.current) {
    gsap.from(ref.current, {
      opacity: 0,
      y: 20,
      duration: 0.6,
      ease: "power2.out",
      stagger: 0.1,
    });
  }
}

// --- STAGGER REVEAL WHEN SKELETONS DISAPPEAR ---
export function staggerReveal(target: string | Element | Element[]): void {
  const elements = Array.isArray(target)
    ? target
    : typeof target === "string"
    ? gsap.utils.toArray(target)
    : [target];

  gsap.from(elements, {
    opacity: 0,
    y: 10,
    duration: 0.5,
    stagger: 0.08,
    ease: "power1.out",
  });
}