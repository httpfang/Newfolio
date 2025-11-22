import { useRef, useEffect } from 'react';
import gsap from 'gsap';

interface UseMagneticCursorOptions {
  strength?: number;
}

/**
 * Custom hook that creates a magnetic cursor effect for an element
 * The element will smoothly follow the cursor when nearby
 * 
 * @param options - Configuration options
 * @param options.strength - The strength of the magnetic effect (0-1, default: 0.2)
 * @returns A ref to attach to the element
 */
export function useMagneticCursor<T extends HTMLElement = HTMLElement>(
  options: UseMagneticCursorOptions = {}
): React.RefObject<T> {
  const elementRef = useRef<T | null>(null);
  const { strength = 0.2 } = options;
  const animationRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!element) return;

      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const distanceX = e.clientX - centerX;
      const distanceY = e.clientY - centerY;
      const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

      // Magnetic radius - adjust based on element size
      const radius = Math.max(rect.width, rect.height) * 1.5;

      if (distance < radius) {
        // Calculate magnetic force (stronger when closer)
        const force = (1 - distance / radius) * strength;
        const moveX = distanceX * force;
        const moveY = distanceY * force;

        // Kill any existing animation
        if (animationRef.current) {
          animationRef.current.kill();
        }

        // Animate to new position
        animationRef.current = gsap.to(element, {
          x: moveX,
          y: moveY,
          duration: 0.3,
          ease: 'power2.out',
          overwrite: 'auto',
        });
      } else {
        // Return to original position when cursor is far
        if (animationRef.current) {
          animationRef.current.kill();
        }
        animationRef.current = gsap.to(element, {
          x: 0,
          y: 0,
          duration: 0.5,
          ease: 'power2.out',
          overwrite: 'auto',
        });
      }
    };

    const handleMouseLeave = () => {
      if (!element) return;
      if (animationRef.current) {
        animationRef.current.kill();
      }
      gsap.to(element, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseleave', handleMouseLeave);
      if (animationRef.current) {
        animationRef.current.kill();
      }
    };
  }, [strength]);

  return elementRef as React.RefObject<T>;  
}

