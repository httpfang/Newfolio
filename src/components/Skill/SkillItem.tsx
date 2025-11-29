import  { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { getSkillIcon, imageBasedSkills } from "@/components/Skill/skillIcons";
import { cn } from "@/lib/utils";

interface SkillItemProps {
  skill: string;
}

export default function SkillItem({ skill }: SkillItemProps) {
  const [isHovered, setIsHovered] = useState(false);
  const logoContainerRef = useRef<HTMLDivElement>(null);
  const itemRef = useRef<HTMLDivElement>(null);

  // Animate logo in/out on hover
  useEffect(() => {
    if (!logoContainerRef.current) return;

    if (isHovered) {
      gsap.fromTo(
        logoContainerRef.current,
        {
          opacity: 0,
          scale: 0.5,
        },
        {
          opacity: 1,
          scale: 1,
          duration: 0.4,
          ease: 'back.out(1.7)',
        }
      );
    } else {
      gsap.to(logoContainerRef.current, {
        opacity: 0,
        scale: 0.5,
        duration: 0.3,
        ease: 'power2.in',
      });
    }
  }, [isHovered]);

  // Smooth cursor following effect with interpolation
  useEffect(() => {
    if (!logoContainerRef.current || !isHovered) return;

    const logoElement = logoContainerRef.current;
    let animationFrameId: number;
    let targetX = 0;
    let targetY = 0;
    let currentXPos = 0;
    let currentYPos = 0;
    const ease = 0.15; // Smooth interpolation factor (lower = smoother, more lag)

    // Initial positioning - set logo to the right of item
    const updateInitialPosition = () => {
      if (!logoContainerRef.current || !itemRef.current) return;
      
      const itemRect = itemRef.current.getBoundingClientRect();
      const rightOffset = 24;
      const left = itemRect.right + rightOffset;
      const top = itemRect.top + (itemRect.height / 2);
      
      gsap.set(logoElement, {
        left: `${left}px`,
        top: `${top}px`,
        x: 0,
        y: '-50%',
      });
      
      // Reset tracking variables
      currentXPos = 0;
      currentYPos = 0;
      targetX = 0;
      targetY = 0;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!logoContainerRef.current || !itemRef.current) return;

      const logoRect = logoElement.getBoundingClientRect();
      const logoCenterX = logoRect.left + logoRect.width / 2;
      const logoCenterY = logoRect.top + logoRect.height / 2;
      
      // Calculate offset from cursor to logo center
      targetX = e.clientX - logoCenterX;
      targetY = e.clientY - logoCenterY;
    };

    // Smooth animation loop using requestAnimationFrame
    const animate = () => {
      // Interpolate current position towards target
      currentXPos += (targetX - currentXPos) * ease;
      currentYPos += (targetY - currentYPos) * ease;
      
      // Apply transform
      gsap.set(logoElement, {
        x: currentXPos,
        y: currentYPos,
      });
      
      animationFrameId = requestAnimationFrame(animate);
    };

    updateInitialPosition();
    animate();
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', updateInitialPosition);
    window.addEventListener('scroll', updateInitialPosition);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', updateInitialPosition);
      window.removeEventListener('scroll', updateInitialPosition);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      // Reset position
      gsap.set(logoElement, { x: 0, y: 0 });
    };
  }, [isHovered]);

  const icon = getSkillIcon(skill);
  const isImageBased = imageBasedSkills.includes(skill);

  return (
    <>
      <div
        ref={itemRef}
        className="skill-item p-6 md:p-8 rounded-lg border border-black/10 bg-white/50 backdrop-blur-sm relative"
        style={{
          boxShadow: '0 2px 8px rgba(26, 26, 26, 0.04), 0 4px 16px rgba(26, 26, 26, 0.02)',
        }}
        onMouseEnter={(e) => {
          setIsHovered(true);
          gsap.to(e.currentTarget, {
            scale: 1.03,
            y: -4,
            boxShadow: '0 8px 24px rgba(26, 26, 26, 0.08), 0 4px 12px rgba(26, 26, 26, 0.04)',
            duration: 0.3,
            ease: 'power2.out',
            overwrite: 'auto',
          });
        }}
        onMouseLeave={(e) => {
          setIsHovered(false);
          gsap.to(e.currentTarget, {
            scale: 1,
            y: 0,
            boxShadow: '0 2px 8px rgba(26, 26, 26, 0.04), 0 4px 16px rgba(26, 26, 26, 0.02)',
            duration: 0.3,
            ease: 'power2.inOut',
            overwrite: 'auto',
          });
        }}
      >
        <span className="text-xl md:text-2xl font-medium text-[#1a1a1a] tracking-tight">
          {skill}
        </span>
      </div>

      {/* Floating logo with smooth cursor following effect */}
      {isHovered && (
        <div
          ref={logoContainerRef}
          className="fixed z-[101] pointer-events-none"
          style={{
            willChange: 'transform',
            transformOrigin: 'center center',
          }}
        >
          <div
            className={cn(
              "flex items-center justify-center",
              isImageBased 
                ? "w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24" 
                : "text-5xl md:text-6xl lg:text-7xl"
            )}
            style={{
              color: '#1a1a1a',
            }}
          >
            {icon}
          </div>
        </div>
      )}
    </>
  );
}
