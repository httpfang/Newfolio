import { useEffect, useState, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Loader.css';

gsap.registerPlugin(ScrollTrigger);

const Loader = () => {
  const [isVisible, setIsVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Prevent scrolling while loader is visible
    document.body.style.overflow = 'hidden';
    // Ensure page starts at top
    window.scrollTo(0, 0);

    // Run loader for 3-5 seconds (random between 3-5)
    const duration = Math.random() * 2000 + 3000; // 3000-5000ms

    const timer = setTimeout(() => {
      if (!containerRef.current) return;
      
      // Dispatch custom event IMMEDIATELY when loader starts to fade out
      // This allows animations to start right away, not after fade completes
      window.dispatchEvent(new CustomEvent('loaderComplete'));
      
      // Restore scrolling immediately
      document.body.style.overflow = '';
      
      // Fade out loader
      gsap.to(containerRef.current, {
        opacity: 0,
        duration: 0.8,
        ease: 'power2.inOut',
        onComplete: () => {
          setIsVisible(false);
          
          // Critical: Refresh ScrollTrigger after loader completes
          // This ensures all scroll-based animations recalculate positions
          requestAnimationFrame(() => {
            ScrollTrigger.refresh();
            // Additional refreshes after layout settles
            setTimeout(() => {
              ScrollTrigger.refresh();
              // One more refresh to ensure everything is calculated correctly
              setTimeout(() => {
                ScrollTrigger.refresh();
              }, 200);
            }, 100);
          });
          
          // Smooth scroll to top (Hero section)
          window.scrollTo({ top: 0, behavior: 'smooth' });
        },
      });
    }, duration);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = '';
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div ref={containerRef} className="loader-container">
      <div>
        <div className="loader">
          <span>
            <span />
            <span />
            <span />
            <span />
          </span>
          <div className="base">
            <span />
            <div className="face" />
          </div>
        </div>
        <div className="longfazers">
          <span />
          <span />
          <span />
          <span />
        </div>
      </div>
    </div>
  );
};

export default Loader;

