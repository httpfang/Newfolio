import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronDown, Check, RefreshCw, Clock } from 'lucide-react';
import ScrollFloat from '@/components/bits/ScrollFloat';
import { useScrollCardReveal } from '@/components/bits/useScrollCardReveal';
import LightRays from '@/components/bits/LightRays.bg';

gsap.registerPlugin(ScrollTrigger);

// Static data - will be updated later
const experienceData = [
  {
    id: 1,
    title: 'Freelance Graphic Designer',
    subtitle: 'Logo, Brand Identity, Social Media, etc',
    dateRange: '2022-Present',
    startMonth: 'Nov',
    endMonth: 'Present',
    isCurrent: true,
  },
  {
    id: 2,
    title: 'Etsy Seller',
    subtitle: 'Watercolor Illustrations & Merch Design Templates',
    dateRange: '2022-Present',
    startMonth: 'Nov',
    endMonth: 'Present',
    isCurrent: true,
  },
  {
    id: 3,
    title: 'Junior Staff Of Industrial Engineering Team',
    company: 'PT Kanaan Global Indonesia',
    dateRange: '2021-2022',
    startMonth: 'Sept',
    endMonth: 'Aug',
    isCurrent: false,
  },
];

const expertiseData = {
  description: 'Logo, Brand Identity, Packaging, Poster & Editorial, Social Media Post, 3D & Motion Graphic.',
  hardSkills: {
    imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop',
    software: ['Ai', 'Ps', 'Ae', 'Id', 'Figma', 'Blender'],
  },
  softSkills: ['Creativity', 'Teamwork', 'Time_Management', 'Flexibility', 'Communication'],
};

const educationData = [
  {
    id: 1,
    title: 'UI/UX Bootcamp Course',
    institution: 'Skola Expert',
    dateRange: '2022',
    isCompleted: true,
  },
  {
    id: 2,
    title: 'Civil Engineering',
    institution: 'Universitas Sebelas Maret',
    dateRange: '2017-2021',
    gpa: 'GPA 3,59/4,00',
    isCompleted: true,
  },
  {
    id: 3,
    title: 'Science',
    institution: 'SMA N 1 Yogyakarta',
    dateRange: '2015-2017',
    gpa: 'GPA 83,4/100',
    isCompleted: true,
  },
];

// Experience Card Component
function ExperienceCard({ experience }: { experience: typeof experienceData[0] }) {
  return (
    <div className="relative bg-white/10 backdrop-blur-sm rounded-[12px] p-5 mb-4 shadow-[0_2px_8px_rgba(255,255,255,0.1)] border border-white/10 section-content">
      {/* Status Icon - Top Right */}
      <div className="absolute top-4 right-4">
        {experience.isCurrent ? (
          <RefreshCw className="w-5 h-5 text-white/70" strokeWidth={2} />
        ) : (
          <Check className="w-5 h-5 text-white/70" strokeWidth={2} />
        )}
      </div>

      {/* Date Pill */}
      <div className="mb-4">
        <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold bg-[#3B82F6] text-white">
          {experience.dateRange}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-[15px] font-semibold text-white mb-2 pr-10 leading-tight">
        {experience.title}
        {(experience.subtitle || experience.company) && (
          <span className="block text-sm font-normal text-white/70 mt-1">
            ({experience.subtitle || experience.company})
          </span>
        )}
      </h3>

      {/* Timeline */}
      <div className="flex items-center gap-3 mt-4 pt-4 border-t border-white/20">
        <span className="text-xs text-white/70 font-medium">{experience.startMonth}</span>
        <div className="flex-1 h-[2px] bg-white/30"></div>
        <span className="text-xs text-white/70 font-medium">{experience.endMonth}</span>
      </div>
    </div>
  );
}

// Education Card Component
function EducationCard({ education }: { education: typeof educationData[0] }) {
  return (
    <div className="relative bg-[#1a1a1a] rounded-[12px] p-5 mb-4 shadow-[0_2px_8px_rgba(0,0,0,0.15)] section-content">
      {/* Checkmark Icon - Top Right */}
      <div className="absolute top-4 right-4">
        <Check className="w-5 h-5 text-white" strokeWidth={2} />
      </div>

      {/* Date Pill - White */}
      <div className="mb-4">
        <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold bg-white text-[#1a1a1a]">
          {education.dateRange}
        </span>
      </div>

      {/* Institution */}
      <p className="text-sm text-white/90 mb-2 font-medium">{education.institution}</p>

      {/* Title */}
      <h3 className="text-[15px] font-semibold text-white mb-2 pr-10 leading-tight">
        {education.title}
      </h3>

      {/* GPA */}
      {education.gpa && (
        <p className="text-xs text-white/70 mt-1">({education.gpa})</p>
      )}
    </div>
  );
}

// Section Header Component with Animation
function SectionHeader({ title }: { title: string }) {
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;

    gsap.fromTo(
      el,
      {
        opacity: isInViewport ? 1 : 0,
        y: isInViewport ? 0 : 30,
        filter: isInViewport ? 'blur(0px)' : 'blur(4px)',
      },
      {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: 2,
        ease: 'power1.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 95%',
          end: 'top 50%',
          scrub: true,
          immediateRender: isInViewport,
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === el) {
          trigger.kill();
        }
      });
    };
  }, []);

  return (
    <div ref={headerRef} className="flex items-center gap-2 mb-6">
      <h2 className="text-3xl lg:text-4xl font-serif text-white tracking-tight">{title}</h2>
      <ChevronDown className="w-5 h-5 text-white/60" strokeWidth={2} />
    </div>
  );
}

// Subsection Header Component with Animation
function SubsectionHeader({ title }: { title: string }) {
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;

    gsap.fromTo(
      el,
      {
        opacity: isInViewport ? 1 : 0,
        x: isInViewport ? 0 : -20,
      },
      {
        opacity: 1,
        x: 0,
        duration: 2,
        ease: 'power1.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 95%',
          end: 'top 50%',
          scrub: true,
          immediateRender: isInViewport,
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === el) {
          trigger.kill();
        }
      });
    };
  }, []);

  return (
    <div ref={headerRef} className="flex items-center gap-2 mb-4">
      <h3 className="text-base font-semibold text-white">{title}</h3>
      <ChevronDown className="w-4 h-4 text-white/60" strokeWidth={2} />
    </div>
  );
}

export default function ExperienceSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const experienceCardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const educationCardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const expertiseTextRef = useRef<HTMLParagraphElement>(null);
  const imageCardRef = useRef<HTMLDivElement>(null);
  const softSkillsRef = useRef<HTMLDivElement>(null);

  // Animate experience cards
  useScrollCardReveal(experienceCardsRef, {
    directions: [
      { x: -40, y: 50, rotate: -3, scale: 0.9 },
      { x: 30, y: 50, rotate: 2, scale: 0.9 },
      { x: -30, y: 50, rotate: -2, scale: 0.9 },
    ],
    start: 'top 95%',
    end: 'top 30%',
    duration: 2.5,
    ease: 'power1.out',
    contentSelector: '.section-content',
  });

  // Animate education cards
  useScrollCardReveal(educationCardsRef, {
    directions: [
      { x: 40, y: 50, rotate: 3, scale: 0.9 },
      { x: -35, y: 50, rotate: -2, scale: 0.9 },
      { x: 30, y: 50, rotate: 2, scale: 0.9 },
    ],
    start: 'top 95%',
    end: 'top 30%',
    duration: 2.5,
    ease: 'power1.out',
    contentSelector: '.section-content',
  });

  // Animate expertise description text
  useEffect(() => {
    const el = expertiseTextRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;

    gsap.fromTo(
      el,
      {
        opacity: isInViewport ? 1 : 0,
        y: isInViewport ? 0 : 20,
        clipPath: isInViewport ? 'inset(0% 0% 0% 0%)' : 'inset(0% 0% 100% 0%)',
      },
      {
        opacity: 1,
        y: 0,
        clipPath: 'inset(0% 0% 0% 0%)',
        duration: 2,
        ease: 'power1.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 90%',
          end: 'top 50%',
          scrub: true,
          immediateRender: isInViewport,
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === el) {
          trigger.kill();
        }
      });
    };
  }, []);

  // Animate image card
  useEffect(() => {
    const el = imageCardRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;

    gsap.fromTo(
      el,
      {
        opacity: isInViewport ? 1 : 0,
        scale: isInViewport ? 1 : 0.95,
        y: isInViewport ? 0 : 30,
      },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 2.5,
        ease: 'power1.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 95%',
          end: 'top 40%',
          scrub: true,
          immediateRender: isInViewport,
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === el) {
          trigger.kill();
        }
      });
    };
  }, []);

  // Animate soft skills tags
  useEffect(() => {
    const el = softSkillsRef.current;
    if (!el) return;

    const tags = el.querySelectorAll('span');
    if (tags.length === 0) return;

    const rect = el.getBoundingClientRect();
    const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;

    gsap.fromTo(
      tags,
      {
        opacity: isInViewport ? 1 : 0,
        scale: isInViewport ? 1 : 0.8,
        y: isInViewport ? 0 : 20,
      },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 1.5,
        ease: 'power1.out',
        stagger: 0.15,
        scrollTrigger: {
          trigger: el,
          start: 'top 95%',
          end: 'top 50%',
          scrub: true,
          immediateRender: isInViewport,
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === el) {
          trigger.kill();
        }
      });
    };
  }, []);

  // Get current date/time for heading
  const getCurrentDateTime = () => {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return now.toLocaleDateString('en-US', options);
  };

  return (
    <section
      ref={sectionRef}
      id="experience"
      className="py-20 px-4 sm:px-6 lg:px-8 bg-black min-h-screen relative overflow-hidden"
    >
      {/* Light Rays Background Effect */}
      <div className="absolute inset-0 pointer-events-none">
        <LightRays
          raysOrigin="top-center"
          raysColor="#00ffff"
          raysSpeed={1.4}
          lightSpread={1}
          rayLength={3}
          fadeDistance={2}
          saturation={1.1}
          followMouse={true}
          mouseInfluence={0.5}
          noiseAmount={0.19}
          distortion={0.1}
          pulsating={false}
          className="custom-rays"
        />
      </div>

      {/* Subtle background pattern */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)`,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Modern Heading with GSAP Animation */}
        <div className="mb-16 lg:mb-20">
          <ScrollFloat
            animationDuration={1}
            ease="back.inOut(2)"
            scrollStart="center bottom+=50%"
            scrollEnd="bottom bottom-=40%"
            stagger={0.03}
            containerClassName="my-0"
            textClassName="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-serif text-white leading-[0.9] tracking-tighter"
          >
            HANDS ON
          </ScrollFloat>

          {/* Date/Time Subtitle */}
          <div className="flex items-center gap-4 mt-6">
            <div className="flex items-center gap-2 text-sm text-white/70">
              <Clock className="w-4 h-4" strokeWidth={2} />
              <span className="font-medium">{getCurrentDateTime()}</span>
            </div>
            <div className="flex-1 h-px bg-white opacity-20"></div>
          </div>
        </div>

        {/* Three Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Column 1: Experience */}
          <div className="flex flex-col">
            <SectionHeader title="Experience" />
            <div className="flex-1">
              {experienceData.map((exp, index) => (
                <div
                  key={exp.id}
                  ref={(el) => {
                    experienceCardsRef.current[index] = el;
                  }}
                >
                  <ExperienceCard experience={exp} />
                </div>
              ))}
            </div>
          </div>

          {/* Column 2: Expertise */}
          <div className="flex flex-col">
            <SectionHeader title="Expertise" />
            
            {/* Expertise Description */}
            <div className="mb-8">
              <p
                ref={expertiseTextRef}
                className="text-sm text-white/80 leading-relaxed"
              >
                {expertiseData.description}
              </p>
            </div>

            {/* Image Container */}
            <div className="mb-4">
              <div
                ref={imageCardRef}
                className="bg-white/10 backdrop-blur-sm rounded-[12px] overflow-hidden shadow-[0_2px_8px_rgba(255,255,255,0.1)] border border-white/10"
              >
                <div className="aspect-[5/6] bg-gray-200 relative max-h-[400px]">
                  <img
                    src={expertiseData.hardSkills.imageUrl}
                    alt="Professional workspace setup showing laptop, smartphone, notebook, and desk accessories"
                    className="w-full h-full object-cover grayscale"
                  />
                </div>
              </div>
            </div>

            {/* Softskill Subsection */}
            <div>
              <SubsectionHeader title="Softskill" />
              <div ref={softSkillsRef} className="flex flex-wrap gap-2">
                {expertiseData.softSkills.map((skill, index) => {
                  const isBlue = index === 0 || index === expertiseData.softSkills.length - 1;
                  return (
                    <span
                      key={index}
                      className={`inline-block px-4 py-2 rounded-full text-xs font-semibold ${
                        isBlue
                          ? 'bg-[#3B82F6] text-white'
                          : 'bg-white/10 text-white border border-white/20 backdrop-blur-sm'
                      }`}
                    >
                      #{skill}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Column 3: Education */}
          <div className="flex flex-col">
            <SectionHeader title="Education" />
            <div className="flex-1">
              {educationData.map((edu, index) => (
                <div
                  key={edu.id}
                  ref={(el) => {
                    educationCardsRef.current[index] = el;
                  }}
                >
                  <EducationCard education={edu} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
