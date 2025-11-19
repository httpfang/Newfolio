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

      spans.forEach((el, i) => {
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration,
          ease: "power3.out",
          delay: (i * delay) / 1000, // convert ms to seconds
        });
      });
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