import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface AnimationDirection {
  x?: number;
  y?: number;
  rotate?: number;
  scale?: number;
}

interface ScrollCardRevealProps {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  direction?: AnimationDirection | AnimationDirection[];
  start?: string;
  end?: string;
  duration?: number;
  ease?: string;
  delay?: number;
  stagger?: number;
  useContentSelector?: boolean;
  contentSelector?: string;
  scrollContainerRef?: React.RefObject<HTMLElement>;
}

const ScrollCardReveal: React.FC<ScrollCardRevealProps> = ({
  children,
  className = "",
  contentClassName = "section-content",
  direction = { x: 0, y: 30, rotate: 0, scale: 0.9 },
  start = "top 85%",
  end = "top 50%",
  duration = 1.2,
  ease = "power3.out",
  delay = 0,
  useContentSelector = true,
  contentSelector = ".section-content",
  scrollContainerRef,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scroller = scrollContainerRef?.current || window;
    const targetElement = useContentSelector
      ? container.querySelector<HTMLElement>(contentSelector) || container
      : container;

    // Handle array of directions for staggered animations
    const directions: AnimationDirection[] = Array.isArray(direction)
      ? direction
      : [direction];

    const defaultDirection: AnimationDirection = {
      x: 0,
      y: 30,
      rotate: 0,
      scale: 0.9,
    };

    const animDirection = directions[0] || defaultDirection;

    const fromProps: gsap.TweenVars = {
      opacity: 0,
      x: animDirection.x ?? 0,
      y: animDirection.y ?? 30,
      rotation: animDirection.rotate ?? 0,
      scale: animDirection.scale ?? 0.9,
    };

    const toProps: gsap.TweenVars = {
      opacity: 1,
      x: 0,
      y: 0,
      rotation: 0,
      scale: 1,
      duration,
      ease,
      delay,
      scrollTrigger: {
        trigger: container,
        scroller,
        start,
        end,
        scrub: true,
      },
    };

    gsap.fromTo(targetElement, fromProps, toProps);

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === container) {
          trigger.kill();
        }
      });
    };
  }, [
    direction,
    start,
    end,
    duration,
    ease,
    delay,
    useContentSelector,
    contentSelector,
    scrollContainerRef,
  ]);

  return (
    <div ref={containerRef} className={className}>
      {useContentSelector ? (
        <div className={contentClassName}>{children}</div>
      ) : (
        children
      )}
    </div>
  );
};

export default ScrollCardReveal;

