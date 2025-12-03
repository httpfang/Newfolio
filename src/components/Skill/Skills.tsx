import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ScrollFloat from "@/bits/ScrollFloat";
import { useMagneticCursor } from "@/hooks/useMagneticCursor";
import { SKILLS } from "@/constants/constants";
import { cn } from "@/lib/utils";
import LogoLoop from "@/bits/LogoLoop";
import SkillOverlay from "@/components/Skill/SkillOverlay";
import { getSkillIconForLoop } from "@/components/Skill/skillIcons";

gsap.registerPlugin(ScrollTrigger);

type SkillCategory = 'frontend' | 'backend' | 'tool';

const skillCategories: SkillCategory[] = ['frontend', 'backend', 'tool'];

const categoryLabels: Record<SkillCategory, string> = {
  frontend: 'Frontend',
  backend: 'Backend',
  tool: 'Tools',
};

// Get skills data from constants, filtered by category
const getSkillsByCategory = (category: SkillCategory): string[] => {
  return SKILLS.filter(skill => skill.category === category).map(skill => skill.name);
};

const skillsData: Record<SkillCategory, string[]> = {
  frontend: getSkillsByCategory('frontend'),
  backend: getSkillsByCategory('backend'),
  tool: getSkillsByCategory('tool'),
};


// Tab rotation values for hover effect
const TAB_ROTATIONS: number[] = [-3, 2, -2];

// Map skill names to their URLs
const skillUrlMap: Record<string, string> = {
  'JavaScript': 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
  'TypeScript': 'https://www.typescriptlang.org',
  'Python': 'https://www.python.org',
  'HTML': 'https://developer.mozilla.org/en-US/docs/Web/HTML',
  'CSS': 'https://developer.mozilla.org/en-US/docs/Web/CSS',
  'React.js': 'https://react.dev',
  'React': 'https://react.dev',
  'Next.js': 'https://nextjs.org',
  'Redux': 'https://redux.js.org',
  'Tailwind CSS': 'https://tailwindcss.com',
  'GSAP': 'https://gsap.com',
  'Framer Motion': 'https://www.framer.com/motion',
  'Node.js': 'https://nodejs.org',
  'Express.js': 'https://expressjs.com',
  'Express': 'https://expressjs.com',
  'Git': 'https://git-scm.com',
  'GitHub': 'https://github.com',
  'Docker': 'https://www.docker.com',
  'Postman': 'https://www.postman.com',
  'MongoDB': 'https://www.mongodb.com',
  'PostgreSQL': 'https://www.postgresql.org',
  'Drizzle ORM': 'https://orm.drizzle.team',
  'AWS': 'https://aws.amazon.com',
  'Stripe': 'https://stripe.com',
  'Clerk': 'https://clerk.com',
  'Vercel': 'https://vercel.com',
  'Figma': 'https://www.figma.com',
};

// Technology logos for LogoLoop - generated from SKILLS
const techLogos = SKILLS.map((skill) => {
  const icon = getSkillIconForLoop(skill.name);
  const href = skillUrlMap[skill.name] || '#';
  
  return {
    node: icon,
    title: skill.name,
    href: href,
  };
});

export default function Skills() {
  // Skills section state and refs
  const [activeTab, setActiveTab] = useState<SkillCategory | null>(null);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const skillsHeadingRef = useRef<HTMLDivElement>(null);
  
  // Magnetic cursor refs for each tab
  const frontendTabRef = useMagneticCursor<HTMLButtonElement>({ strength: 0.15 });
  const backendTabRef = useMagneticCursor<HTMLButtonElement>({ strength: 0.15 });
  const toolTabRef = useMagneticCursor<HTMLButtonElement>({ strength: 0.15 });

  // Store tab refs in array for easy access
  useEffect(() => {
    tabRefs.current = [frontendTabRef.current, backendTabRef.current, toolTabRef.current];
  }, [frontendTabRef, backendTabRef, toolTabRef]);

  // Prevent body scroll when overlay is open
  useEffect(() => {
    if (isOverlayOpen) {
      // Save current scroll position
      const scrollY = window.scrollY;
      // Apply styles to prevent scrolling
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      
      return () => {
        // Restore scroll position when overlay closes
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOverlayOpen]);

  // Animate skills heading on scroll
  useEffect(() => {
    if (!skillsHeadingRef.current) return;

    const heading = skillsHeadingRef.current;
    const divider = heading.querySelector('.divider-container');

    const rect = heading.getBoundingClientRect();
    const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;

    const timeoutId = setTimeout(() => {
      if (divider) {
        gsap.fromTo(
          divider,
          {
            opacity: isInViewport ? 1 : 0,
            scaleX: isInViewport ? 1 : 0,
          },
          {
            opacity: 1,
            scaleX: 1,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: heading,
              start: 'top 85%',
              end: 'top 60%',
              scrub: true,
              immediateRender: isInViewport,
            },
          }
        );
      }
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === heading || trigger.vars.trigger === divider) {
          trigger.kill();
        }
      });
    };
  }, []);

  // Skills overlay functions
  const openOverlay = (category: SkillCategory) => {
    setActiveTab(category);
    setIsOverlayOpen(true);
  };

  const closeOverlay = () => {
    setIsOverlayOpen(false);
    setActiveTab(null);
  };

  const handleTabHover = (e: React.MouseEvent<HTMLButtonElement>, index: number) => {
    const element = e.currentTarget;
    gsap.to(element, {
      scale: 1.05,
      rotation: TAB_ROTATIONS[index] * 1.2,
      filter: 'blur(0.5px)',
      duration: 0.3,
      ease: 'power2.out',
      overwrite: 'auto',
    });
  };

  const handleTabLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    const element = e.currentTarget;
    const index = tabRefs.current.indexOf(element);
    gsap.to(element, {
      scale: 1,
      rotation: TAB_ROTATIONS[index] || 0,
      filter: 'blur(0px)',
      duration: 0.3,
      ease: 'power2.inOut',
      overwrite: 'auto',
    });
  };

  return (
    <>
      {/* Skills Section */}
      <div id="skills" className="mt-20 scroll-mt-[70px]">
        <div ref={skillsHeadingRef} className="mb-12 sm:mb-14 md:mb-16 px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 md:gap-8 mb-4">
            <ScrollFloat
              animationDuration={1}
              ease="back.inOut(2)"
              scrollStart="center bottom+=50%"
              scrollEnd="bottom bottom-=40%"
              stagger={0.03}
              containerClassName="my-0"
              textClassName="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-serif text-[#2D5016] leading-[0.9] tracking-tighter"
            >
              SKILLS
            </ScrollFloat>
            <div className="flex-1 w-full sm:w-auto h-[50px] sm:h-[60px] md:h-[80px] relative overflow-hidden">
              <LogoLoop
                logos={techLogos}
                speed={80}
                direction="left"
                logoHeight={48}
                gap={48}
                hoverSpeed={40}
                scaleOnHover
                fadeOut
                fadeOutColor="#F5F3EE"
                ariaLabel="Technology stack"
                className="h-full"
              />
            </div>
          </div>
          <div className="divider-container flex items-center gap-2 sm:gap-3 mt-4">
            <div className="h-px w-8 sm:w-12 bg-[#2D5016] opacity-30"></div>
            <div className="text-[#2D5016] text-xs sm:text-sm opacity-40 tracking-[0.2em] sm:tracking-[0.3em]">
              TECHNOLOGIES
            </div>
            <div className="flex-1 h-px bg-[#2D5016] opacity-30"></div>
          </div>
        </div>

        {/* Skills Array Display */}
        <div className="flex items-center justify-center w-full mt-6 sm:mt-8 md:mt-12 px-4 sm:px-6">
          <div className="flex items-center gap-1.5 sm:gap-2 md:gap-4 font-mono text-xl sm:text-2xl md:text-4xl lg:text-5xl text-[#2D5016] flex-wrap justify-center">
            <span className="text-[#2D5016]/60">[</span>
            {skillCategories.map((category, index) => {
              const refMap = {
                frontend: frontendTabRef,
                backend: backendTabRef,
                tool: toolTabRef,
              };
              const tabRef = refMap[category];

              return (
                <span key={category} className="flex items-center">
                  <button
                    ref={tabRef}
                    onClick={() => openOverlay(category)}
                    className={cn(
                      'font-serif italic tracking-wide text-[#2D5016] cursor-pointer',
                      'hover:text-[#2D5016]/70 active:scale-95 transition-colors duration-300',
                      'select-none relative z-10 touch-manipulation',
                      'text-xl sm:text-2xl md:text-4xl lg:text-5xl'
                    )}
                    style={{
                      transform: `rotate(${TAB_ROTATIONS[index]}deg)`,
                      textShadow: '0 2px 8px rgba(45, 80, 22, 0.08), 0 4px 16px rgba(45, 80, 22, 0.04)',
                      filter: 'drop-shadow(0 1px 2px rgba(45, 80, 22, 0.05))',
                      transformOrigin: 'center center',
                    }}
                    onMouseEnter={(e) => handleTabHover(e, index)}
                    onMouseLeave={handleTabLeave}
                    aria-label={`Open ${categoryLabels[category]} skills`}
                  >
                    <span className="relative z-10">"{categoryLabels[category].toLowerCase()}"</span>
                    <span 
                      className="absolute inset-0 opacity-[0.02] pointer-events-none"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                        mixBlendMode: 'multiply',
                      }}
                    />
                  </button>
                  {index < skillCategories.length - 1 && (
                    <span className="text-[#2D5016]/60 mx-1 sm:mx-2 md:mx-4">,</span>
                  )}
                </span>
              );
            })}
            <span className="text-[#2D5016]/60">]</span>
          </div>
        </div>
      </div>

      {/* Full-Screen Overlay */}
      <SkillOverlay
        isOpen={isOverlayOpen}
        category={activeTab}
        skills={activeTab ? skillsData[activeTab] : []}
        categoryLabel={activeTab ? categoryLabels[activeTab] : ''}
        onClose={closeOverlay}
      />
    </>
  );
}


