import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface AnimationDirection {
  x?: number;
  y?: number;
  rotate?: number;
  scale?: number;
}

interface UseScrollCardRevealOptions {
  directions?: AnimationDirection[];
  start?: string;
  end?: string;
  duration?: number;
  ease?: string;
  contentSelector?: string;
  scrollContainerRef?: React.RefObject<HTMLElement>;
  enabled?: boolean;
}

// Hook version for multiple cards with different directions
// Accepts either a ref to an array of elements, an array of refs, or an array of elements
export const useScrollCardReveal = (
  refs: React.MutableRefObject<(HTMLDivElement | null)[]> | React.RefObject<HTMLDivElement>[] | (HTMLDivElement | null)[],
  options?: UseScrollCardRevealOptions
) => {
  useEffect(() => {
    const {
      directions = [],
      start = "top 85%",
      end = "top 50%",
      duration = 1.2,
      ease = "power3.out",
      contentSelector = ".section-content",
      scrollContainerRef,
      enabled = true,
    } = options || {};

    if (!enabled) return;

    // Get the actual array of elements
    let elements: (HTMLDivElement | null)[];
    if (refs && "current" in refs) {
      // It's a ref object containing an array
      elements = refs.current || [];
    } else if (Array.isArray(refs)) {
      // It's already an array
      elements = refs.map((ref) => {
        // Handle both ref objects and direct element references
        return ref && "current" in ref ? ref.current : ref;
      });
    } else {
      elements = [];
    }

    const scroller = scrollContainerRef?.current || window;

    const defaultDirections: AnimationDirection[] = [
      { x: -50, y: 30, rotate: -5, scale: 0.9 },
      { x: 50, y: 30, rotate: 5, scale: 0.9 },
      { x: 30, y: 40, rotate: 3, scale: 0.9 },
      { x: -40, y: 25, rotate: -3, scale: 0.9 },
      { x: 45, y: 35, rotate: 4, scale: 0.9 },
      { x: -35, y: 30, rotate: -4, scale: 0.9 },
    ];

    const triggers: ScrollTrigger[] = [];

    // Wait a bit to ensure loader is done and layout is settled
    const timeoutId = setTimeout(() => {
      elements.forEach((element, index) => {
        if (!element) return;

        const targetElement =
          element.querySelector<HTMLElement>(contentSelector) || element;

        const animDirection =
          directions[index] || defaultDirections[index % 6] || {
            x: 0,
            y: 30,
            rotate: 0,
            scale: 0.9,
          };

        // Check if element is already in viewport - if so, make it visible immediately
        const rect = element.getBoundingClientRect();
        const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;
        
        // If already in viewport, set initial state to visible
        if (isInViewport) {
          gsap.set(targetElement, {
            opacity: 1,
            x: 0,
            y: 0,
            rotation: 0,
            scale: 1,
          });
        }

        const tween = gsap.fromTo(
          targetElement,
          {
            opacity: isInViewport ? 1 : 0,
            x: isInViewport ? 0 : (animDirection.x ?? 0),
            y: isInViewport ? 0 : (animDirection.y ?? 30),
            rotation: isInViewport ? 0 : (animDirection.rotate ?? 0),
            scale: isInViewport ? 1 : (animDirection.scale ?? 0.9),
          },
          {
            opacity: 1,
            x: 0,
            y: 0,
            rotation: 0,
            scale: 1,
            duration,
            ease,
            scrollTrigger: {
              trigger: element,
              scroller,
              start,
              end,
              scrub: true,
              // If already in viewport, start immediately
              immediateRender: isInViewport,
            },
          }
        );

        // Store trigger for cleanup
        if (tween.scrollTrigger) {
          triggers.push(tween.scrollTrigger);
        }
      });
    }, 200);

    return () => {
      clearTimeout(timeoutId);
      // Only kill triggers created by this hook
      triggers.forEach((trigger) => trigger.kill());
    };

    return () => {
      // Only kill triggers created by this hook
      triggers.forEach((trigger) => trigger.kill());
    };
  }, [refs, options]);
};

