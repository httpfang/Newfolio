import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface UseLenisOptions {
  duration?: number;
  easing?: (t: number) => number;
  smoothWheel?: boolean;
  orientation?: 'vertical' | 'horizontal';
  gestureOrientation?: 'vertical' | 'horizontal' | 'both';
  touchMultiplier?: number;
  wheelMultiplier?: number;
  infinite?: boolean;
  lerp?: number;
}

/**
 * Custom hook for smooth scrolling with Lenis
 * Integrates seamlessly with GSAP ScrollTrigger using the recommended approach
 * 
 * @param options - Lenis configuration options
 * @param enabled - Whether to enable smooth scrolling (default: true)
 */
export const useLenis = (
  options: UseLenisOptions = {},
  enabled: boolean = true
) => {
  useEffect(() => {
    if (!enabled) return;

    // Initialize Lenis with configuration
    const lenis = new Lenis({
      duration: options.duration ?? 1.2,
      easing: options.easing ?? ((t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))),
      smoothWheel: options.smoothWheel ?? true,
      orientation: options.orientation ?? 'vertical',
      gestureOrientation: options.gestureOrientation ?? 'vertical',
      touchMultiplier: options.touchMultiplier ?? 1,
      wheelMultiplier: options.wheelMultiplier ?? 1,
      infinite: options.infinite ?? false,
      lerp: options.lerp,
    });

    // Synchronize Lenis scrolling with GSAP's ScrollTrigger plugin
    lenis.on('scroll', ScrollTrigger.update);

    // Add Lenis's requestAnimationFrame (raf) method to GSAP's ticker
    // This ensures Lenis's smooth scroll animation updates on each GSAP tick
    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000); // Convert time from seconds to milliseconds
    };

    gsap.ticker.add(tickerCallback);

    // Disable lag smoothing in GSAP to prevent any delay in scroll animations
    gsap.ticker.lagSmoothing(0);

    // Cleanup on unmount
    return () => {
      gsap.ticker.remove(tickerCallback);
      lenis.destroy();
    };
  }, [
    enabled,
    options.duration,
    options.easing,
    options.smoothWheel,
    options.orientation,
    options.gestureOrientation,
    options.touchMultiplier,
    options.wheelMultiplier,
    options.infinite,
    options.lerp,
  ]);
};

