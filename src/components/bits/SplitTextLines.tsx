import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface SplitTextLinesProps {
  children: string;
  className?: string;
  duration?: number;
  stagger?: number;
  ease?: string;
  scrollStart?: string;
  scrollEnd?: string;
  triggerElement?: React.RefObject<HTMLElement | null>;
}

export default function SplitTextLines({
  children,
  className = "",
  duration = 1.5,
  stagger = 0.1,
  ease = "power4",
  scrollStart = "top 85%",
  scrollEnd = "top 50%",
  triggerElement,
}: SplitTextLinesProps) {
  const containerRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Wait for next frame to ensure layout is complete
    requestAnimationFrame(() => {
      // Get the text content
      const text = children;
      const words = text.split(" ");
      
      // Create parent wrapper
      const parentDiv = document.createElement("div");
      parentDiv.className = "split-parent";
      parentDiv.style.overflow = "hidden";

      // Create a temporary span to measure words
      const measureSpan = document.createElement("span");
      measureSpan.style.visibility = "hidden";
      measureSpan.style.position = "absolute";
      measureSpan.style.whiteSpace = "nowrap";
      measureSpan.style.fontSize = window.getComputedStyle(container).fontSize;
      measureSpan.style.fontFamily = window.getComputedStyle(container).fontFamily;
      measureSpan.style.fontWeight = window.getComputedStyle(container).fontWeight;
      document.body.appendChild(measureSpan);

      const containerWidth = container.offsetWidth;
      const lines: string[][] = [];
      let currentLine: string[] = [];
      let currentWidth = 0;

      words.forEach((word, index) => {
        measureSpan.textContent = word + (index < words.length - 1 ? " " : "");
        const wordWidth = measureSpan.offsetWidth;

        if (currentWidth + wordWidth > containerWidth && currentLine.length > 0) {
          lines.push([...currentLine]);
          currentLine = [word];
          currentWidth = wordWidth;
        } else {
          currentLine.push(word);
          currentWidth += wordWidth;
        }

        if (index === words.length - 1 && currentLine.length > 0) {
          lines.push(currentLine);
        }
      });

      document.body.removeChild(measureSpan);

      // Clear and rebuild structure
      container.innerHTML = "";

      lines.forEach((lineWords) => {
        const childDiv = document.createElement("div");
        childDiv.className = "split-child";
        childDiv.style.display = "inline-block";
        childDiv.textContent = lineWords.join(" ");
        parentDiv.appendChild(childDiv);
      });

      container.appendChild(parentDiv);

      // Animate lines
      const lineElements = parentDiv.querySelectorAll<HTMLElement>(".split-child");
      if (lineElements.length === 0) return;

      const trigger = triggerElement?.current || container;

      // Check if element is already in viewport
      const rect = trigger.getBoundingClientRect();
      const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;

      // If already in viewport, set initial state
      if (isInViewport) {
        gsap.set(lineElements, { yPercent: 0 });
      }

      const tween = gsap.fromTo(
        lineElements,
        {
          yPercent: isInViewport ? 0 : 100,
        },
        {
          yPercent: 0,
          duration,
          ease,
          stagger,
          scrollTrigger: {
            trigger: trigger,
            start: scrollStart,
            end: scrollEnd,
            scrub: true,
            immediateRender: isInViewport,
          },
        }
      );

      return () => {
        if (tween?.scrollTrigger) {
          tween.scrollTrigger.kill();
        }
      };
    });
  }, [children, duration, stagger, ease, scrollStart, scrollEnd, triggerElement]);

  return (
    <h6 ref={containerRef} className={className}>
      {children}
    </h6>
  );
}

