import { useEffect, useMemo, useRef } from "react";
import { gsap } from "gsap";

interface SplitTextProps {
  text: string;
  delay?: number; // ms delay between character animations
  duration?: number; // seconds per character animation
  className?: string;
}

// A lightweight SplitText inspired by React Bits docs (Manual install):
// https://reactbits.dev/get-started/installation
export default function SplitText({
  text,
  delay = 40,
  duration = 0.6,
  className,
}: SplitTextProps) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const letters = useMemo(() => Array.from(text), [text]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const spans = containerRef.current?.querySelectorAll("span[data-char]");
      if (!spans || spans.length === 0) return;

      gsap.set(spans, { opacity: 0, y: 12 });

      // Function to start the animation immediately
      const startAnimation = () => {
        // Use requestAnimationFrame to ensure smooth start on next frame
        requestAnimationFrame(() => {
          spans.forEach((el, i) => {
            gsap.to(el, {
              opacity: 1,
              y: 0,
              duration,
              ease: "power3.out",
              delay: (i * delay) / 1000, // convert ms to seconds
            });
          });
        });
      };

      // Check if loader is already complete (loader element doesn't exist)
      const loaderElement = document.querySelector('.loader-container');
      
      let cleanup: (() => void) | undefined;
      
      if (!loaderElement) {
        // Loader already completed, start animation immediately
        startAnimation();
      } else {
        // Wait for loader to complete - start immediately when event fires
        const handleLoaderComplete = () => {
          startAnimation();
        };
        
        window.addEventListener('loaderComplete', handleLoaderComplete, { once: true });
        
        cleanup = () => {
          window.removeEventListener('loaderComplete', handleLoaderComplete);
        };
      }

      return cleanup;
    }, containerRef);

    return () => ctx.revert();
  }, [delay, duration, letters]);

  return (
    <span ref={containerRef} className={className} aria-label={text}>
      {letters.map((ch, i) => (
        <span key={`${ch}-${i}`} data-char className="inline-block">
          {ch === " " ? "\u00A0" : ch}
        </span>
      ))}
    </span>
  );
}