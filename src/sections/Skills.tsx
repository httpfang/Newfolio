import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ScrollFloat from "@/components/bits/ScrollFloat";
import { useMagneticCursor } from "@/hooks/useMagneticCursor";
import { PERSONAL_INFO, SKILLS } from "@/constants/constants";
import { cn } from "@/lib/utils";
import LogoLoop from "@/components/bits/LogoLoop";
import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiTailwindcss,
  SiNodedotjs,
  SiExpress,
  SiMongodb,
  SiPostgresql,
  SiGit,
  SiGithub,
  SiVercel,
  SiPostman,
  SiFigma,
  SiDocker,
  SiJavascript,
  SiPython,
  SiHtml5,
  SiCss3,
  SiRedux,
  SiAmazon,
  SiStripe,
} from "react-icons/si";

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

// Map skill names to their icon components
const skillIconMap: Record<string, React.ReactNode> = {
  // Frontend
  'React.js': <SiReact />,
  'React': <SiReact />,
  'Next.js': <SiNextdotjs />,
  'TypeScript': <SiTypescript />,
  'JavaScript': <SiJavascript />,
  'HTML': <SiHtml5 />,
  'CSS': <SiCss3 />,
  'Tailwind CSS': <SiTailwindcss />,
  'TailwindCSS': <SiTailwindcss />,
  'Redux': <SiRedux />,
  'GSAP': <img src="https://gsap.com/community/uploads/monthly_2020_03/tweenmax.png.cf27916e926fbb328ff214f66b4c8429.png" alt="GSAP" className="h-[48px] w-auto object-contain" />,
  'Framer Motion': (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 140" className="h-[48px] w-auto">
      <path d="M 44.65 33.992 L 95.35 33.992 L 95.35 59.341 L 70 59.341 Z M 44.65 59.341 L 70 59.341 L 95.35 84.691 L 44.65 84.691 Z M 44.65 84.691 L 70 84.691 L 70 110.041 Z" fill="rgb(0, 0, 0)"></path>
    </svg>
  ),
  // Backend
  'Node.js': <SiNodedotjs />,
  'Express.js': <SiExpress />,
  'Express': <SiExpress />,
  'Python': <SiPython />,
  // Tools
  'Git': <SiGit />,
  'GitHub': <SiGithub />,
  'Docker': <SiDocker />,
  'Postman': <SiPostman />,
  'MongoDB': <SiMongodb />,
  'PostgreSQL': <SiPostgresql />,
  'Drizzle ORM': <img src="https://pbs.twimg.com/media/F7V2rLQWUAAgaLh.jpg" alt="Drizzle ORM" className="h-[48px] w-auto object-contain" />,
  'AWS': <SiAmazon />,
  'Stripe': <SiStripe />,
  'Clerk': <img src="https://assets.streamlinehq.com/image/private/w_300,h_300,ar_1/f_auto/v1/icons/logos/clerk-uvna1mxd54k50cohb8o2i.png/clerk-nzr7956knokwjx841f6yye.png?_a=DATAg1AAZAA0" alt="Clerk" className="h-[48px] w-auto object-contain" />,
  'Vercel': <SiVercel />,
  'Figma': <SiFigma />,
};

// Helper function to get icon for a skill, with fallback to text
const getSkillIcon = (skillName: string): React.ReactNode => {
  return skillIconMap[skillName] || <span className="font-bold text-[#1a1a1a]">{skillName}</span>;
};

// List of skills that use image-based icons (including SVGs)
const imageBasedSkills = ['GSAP', 'Framer Motion', 'Drizzle ORM', 'Clerk'];

// Helper function to get icon for LogoLoop (with different color scheme)
const getSkillIconForLoop = (skillName: string): React.ReactNode => {
  const icon = skillIconMap[skillName];
  if (icon) {
    // If it's an image-based skill, return the image as-is
    if (imageBasedSkills.includes(skillName)) {
      return icon;
    }
    return icon;
  }
  return <span className="font-bold text-[#2D5016]">{skillName}</span>;
};

// Generate random scattered positions for tech logos in overlay
const getScatteredPositions = (count: number) => {
  const positions = [];
  for (let i = 0; i < count; i++) {
    // Random positions avoiding edges (5% to 90% for both top and left)
    const top = 5 + Math.random() * 85;
    const left = 5 + Math.random() * 85;
    const rotate = (Math.random() - 0.5) * 30; // -15 to 15 degrees
    const scale = 0.6 + Math.random() * 0.4; // 0.6 to 1.0
    
    positions.push({
      top: `${top}%`,
      left: `${left}%`,
      rotate,
      scale,
    });
  }
  return positions;
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
  const overlayRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const skillsHeadingRef = useRef<HTMLDivElement>(null);
  const [logoPositions, setLogoPositions] = useState<Array<{ top: string; left: string; rotate: number; scale: number }>>([]);
  
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
    // Generate random positions for logos
    const positions = getScatteredPositions(skillsData[category].length);
    setLogoPositions(positions);
    setIsOverlayOpen(true);
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
      
      // Animate scattered tech logos with pop animation
      const techLogos = overlayRef.current.querySelectorAll('.scattered-tech-logo');
      if (techLogos.length) {
        // Set initial state - all logos start invisible and scaled to 0
        gsap.set(techLogos, { opacity: 0, scale: 0 });
        
        // Pop animation - each logo pops in randomly
        techLogos.forEach((logo) => {
          const delay = Math.random() * 0.3; // Random delay 0-0.3s for random popping
          
          gsap.to(logo, {
            opacity: 0.5,
            scale: 1,
            duration: 0.5,
            delay: delay,
            ease: 'back.out(2.5)', // Bouncy pop effect
          });
        });
        
        // Continuous floating animation after pop
        techLogos.forEach((logo) => {
          gsap.to(logo, {
            y: '+=15',
            rotation: `+=${Math.random() * 8 - 4}`,
            duration: 2.5 + Math.random() * 1.5,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
            delay: 0.5, // Start floating after pop animation
          });
        });
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
  };

  const closeOverlay = () => {
    if (!overlayRef.current) {
      setIsOverlayOpen(false);
      return;
    }
    const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' } });
    
    const title = overlayRef.current.querySelector('.overlay-title');
    const skillItems = overlayRef.current.querySelectorAll('.skill-item');
    const techLogos = overlayRef.current.querySelectorAll('.scattered-tech-logo');
    
    if (title) {
      tl.to(title, { 
        filter: 'blur(10px)', 
        opacity: 0, 
        y: -20, 
        duration: 0.3 
      }, 0);
    }
    
    if (techLogos.length) {
      tl.to(
        techLogos,
        {
          opacity: 0,
          scale: 0,
          stagger: 0.02,
          duration: 0.2,
        },
        0
      );
      // Kill floating animations
      techLogos.forEach((logo) => {
        gsap.killTweensOf(logo);
      });
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
      setIsOverlayOpen(false);
      setActiveTab(null);
    });
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
        <div ref={skillsHeadingRef} className="mb-16">
          <div className="flex items-center gap-6 md:gap-8 mb-4">
            <ScrollFloat
              animationDuration={1}
              ease="back.inOut(2)"
              scrollStart="center bottom+=50%"
              scrollEnd="bottom bottom-=40%"
              stagger={0.03}
              containerClassName="my-0"
              textClassName="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-serif text-[#2D5016] leading-[0.9] tracking-tighter"
            >
              SKILLS
            </ScrollFloat>
            <div className="flex-1 h-[60px] md:h-[80px] relative overflow-hidden">
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
          <div className="divider-container flex items-center gap-3 mt-4">
            <div className="h-px w-12 bg-[#2D5016] opacity-30"></div>
            <div className="text-[#2D5016] text-sm opacity-40 tracking-[0.3em]">
              TECHNOLOGIES
            </div>
            <div className="flex-1 h-px bg-[#2D5016] opacity-30"></div>
          </div>
        </div>

        {/* Skills Array Display */}
        <div className="flex items-center justify-center w-full mt-8 md:mt-12 px-4">
          <div className="flex items-center gap-2 md:gap-4 font-mono text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-[#2D5016]">
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
                      'hover:text-[#2D5016]/70 transition-colors duration-300',
                      'select-none relative z-10',
                      'text-2xl sm:text-3xl md:text-4xl lg:text-5xl'
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
                    <span className="text-[#2D5016]/60 mx-2 md:mx-4">,</span>
                  )}
                </span>
              );
            })}
            <span className="text-[#2D5016]/60">]</span>
          </div>
        </div>
      </div>

      {/* Full-Screen Overlay */}
      {isOverlayOpen && activeTab && (
        <div
          ref={overlayRef}
          className="fixed inset-0 z-[100] bg-[#e8defa] text-[#1a1a1a] overflow-y-auto"
        >
          {/* Scattered animated tech logos */}
          {skillsData[activeTab].map((skill, index) => {
            const pos = logoPositions[index];
            const icon = getSkillIcon(skill);
            
            if (!pos) return null;
            
            return (
              <div
                key={`${skill}-${index}`}
                className="scattered-tech-logo absolute pointer-events-none"
                data-rotate={pos.rotate}
                style={{
                  top: pos.top,
                  left: pos.left,
                  transform: `rotate(${pos.rotate}deg)`,
                }}
              >
                <div className={`text-[#1a1a1a] opacity-50 ${imageBasedSkills.includes(skill) ? 'w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 flex items-center justify-center' : 'text-4xl md:text-5xl lg:text-6xl'}`}>
                  {icon}
                </div>
              </div>
            );
          })}

          <div className="relative flex flex-col h-full">
            <div className="flex items-center justify-between px-6 py-4 border-b border-black/10">
              <span className="text-xs tracking-widest uppercase font-serif text-[#1a1a1a]">
                {PERSONAL_INFO.name || 'Portfolio'}
              </span>
              <button
                aria-label="Close skills overlay"
                className="close-btn text-3xl leading-none bg-transparent hover:bg-transparent font-serif text-[#1a1a1a]"
                onClick={closeOverlay}
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
                {categoryLabels[activeTab].toUpperCase()}
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 max-w-4xl w-full">
                {skillsData[activeTab].map((skill) => (
                  <div
                    key={skill}
                    className="skill-item p-6 md:p-8 rounded-lg border border-black/10 bg-white/50 backdrop-blur-sm"
                    style={{
                      boxShadow: '0 2px 8px rgba(26, 26, 26, 0.04), 0 4px 16px rgba(26, 26, 26, 0.02)',
                    }}
                    onMouseEnter={(e) => {
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
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

