import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { gsap } from "gsap";
import { PERSONAL_INFO } from "@/constants/constants";
import SkillItem from "./SkillItem";

type SkillCategory = 'frontend' | 'backend' | 'tool';

interface SkillOverlayProps {
  isOpen: boolean;
  category: SkillCategory | null;
  skills: string[];
  categoryLabel: string;
  onClose: () => void;
}

export default function SkillOverlay({
  isOpen,
  category,
  skills,
  categoryLabel,
  onClose,
}: SkillOverlayProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  // Animate overlay open/close
  useEffect(() => {
    if (!overlayRef.current) return;

    if (isOpen) {
      requestAnimationFrame(() => {
        if (!overlayRef.current) return;
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
        
        tl.fromTo(
          overlayRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.5 }
        );
        
        const title = overlayRef.current.querySelector('.overlay-title');
        if (title) {
          gsap.set(title, { filter: 'blur(10px)', opacity: 0, y: 20 });
          tl.to(title, { 
            filter: 'blur(0px)', 
            opacity: 1, 
            y: 0, 
            duration: 0.8,
            ease: 'power3.out'
          }, '-=0.3');
        }
        
        const skillItems = overlayRef.current.querySelectorAll('.skill-item');
        if (skillItems.length) {
          gsap.set(skillItems, { opacity: 0, y: 30, scale: 0.9 });
          tl.to(
            skillItems,
            {
              opacity: 1,
              y: 0,
              scale: 1,
              stagger: 0.08,
              duration: 0.6,
              ease: 'back.out(1.2)',
            },
            '-=0.4'
          );
        }
        
        const closeBtn = overlayRef.current.querySelector('.close-btn');
        if (closeBtn) {
          tl.from(closeBtn, { opacity: 0, scale: 0.8, duration: 0.4 }, '-=0.5');
        }
      });
    }
  }, [isOpen]);

  const handleClose = () => {
    if (!overlayRef.current) {
      onClose();
      return;
    }
    const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' } });
    
    const title = overlayRef.current.querySelector('.overlay-title');
    const skillItems = overlayRef.current.querySelectorAll('.skill-item');
    
    if (title) {
      tl.to(title, { 
        filter: 'blur(10px)', 
        opacity: 0, 
        y: -20, 
        duration: 0.3 
      }, 0);
    }
    
    if (skillItems.length) {
      tl.to(
        skillItems,
        {
          opacity: 0,
          y: -20,
          scale: 0.9,
          stagger: 0.04,
          duration: 0.3,
        },
        0
      );
    }
    
    tl.to(overlayRef.current, {
      opacity: 0,
      duration: 0.4,
    }).add(() => {
      onClose();
    });
  };

  if (!isOpen || !category) return null;

  const overlayContent = (
    <div
      ref={overlayRef}
      className="fixed inset-0 text-[#1a1a1a] overflow-y-auto"
      style={{ 
        isolation: 'isolate',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 9999,
        backgroundColor: '#e8defa',
        background: '#e8defa',
        willChange: 'opacity',
      }}
    >
      <div className="relative flex flex-col h-full">
        <div className="flex items-center justify-between px-6 py-4 border-b border-black/10">
          <span className="text-xs tracking-widest uppercase font-serif text-[#1a1a1a]">
            {PERSONAL_INFO.name || 'Portfolio'}
          </span>
          <button
            aria-label="Close skills overlay"
            className="close-btn text-3xl leading-none bg-transparent hover:bg-transparent font-serif text-[#1a1a1a]"
            onClick={handleClose}
            onMouseEnter={(e) => {
              gsap.to(e.currentTarget, {
                scale: 1.1,
                rotation: 90,
                duration: 0.2,
                ease: 'power2.out',
                overwrite: 'auto',
              });
            }}
            onMouseLeave={(e) => {
              gsap.to(e.currentTarget, {
                scale: 1,
                rotation: 0,
                duration: 0.2,
                ease: 'power2.inOut',
                overwrite: 'auto',
              });
            }}
          >
            ×
          </button>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 md:py-20 overflow-y-auto">
          <h3 className="overlay-title text-6xl md:text-8xl font-serif italic tracking-wide mb-12 md:mb-16 text-center text-[#1a1a1a]">
            {categoryLabel.toUpperCase()}
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 max-w-4xl w-full">
            {skills.map((skill) => (
              <SkillItem key={skill} skill={skill} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Render overlay using portal to document.body to escape any stacking context issues
  return typeof window !== 'undefined' ? createPortal(overlayContent, document.body) : null;
}

