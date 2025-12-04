import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ScrollFloat from "@/bits/ScrollFloat";
import PixelTransition from "@/bits/PixelTransition";
import { useScrollCardReveal } from "@/bits/useScrollCardReveal";

gsap.registerPlugin(ScrollTrigger);

const aboutSections = [
  {
    number: "01",
    title: "LOVE",
    text: "I LOVE CLEAN CODE, INNOVATIVE SOLUTIONS AND USER-CENTRIC DESIGN.",
    position: { top: "10%", left: "5%", maxWidth: "240px" },
  },
  {
    number: "02",
    title: "PAST EXPERIENCE",
    text: "I'VE WORKED AS A FULL STACK DEVELOPER, BUILDING SCALABLE WEB APPLICATIONS WITH THE MERN STACK.",
    position: { top: "22%", right: "8%", maxWidth: "260px" },
  },
  {
    number: "03",
    title: "APPROACH",
    text: "MY BACKGROUND ALLOWS ME TO APPLY A SYSTEMATIC APPROACH TO WEB DEVELOPMENT, FOCUSING ON PERFORMANCE AND USER EXPERIENCE.",
    position: { top: "52%", right: "6%", maxWidth: "280px" },
  },
  {
    number: "04",
    title: "CURRENT EXPERIENCE",
    text: "I'VE BEEN WORKING AS A FULL STACK DEVELOPER, CREATING MODERN WEB APPLICATIONS WITH REACT, NEXT.JS, AND NODE.JS.",
    position: { bottom: "18%", left: "4%", maxWidth: "260px" },
  },
  {
    number: "05",
    title: "INSPIRATION",
    text: "I'M MOST INSPIRED BY TECHNOLOGY, PROBLEM-SOLVING AND CREATIVE CODING. I CAN'T IMAGINE MY LIFE WITHOUT BUILDING MEANINGFUL DIGITAL EXPERIENCES.",
    position: { bottom: "5%", right: "8%", maxWidth: "280px" },
  },
];

export default function About() {
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const aboutSectionRef = useRef<HTMLElement>(null);
  const rightParagraphRef = useRef<HTMLParagraphElement>(null);

  // Use the scroll card reveal hook for animations
  useScrollCardReveal(sectionRefs, {
    start: "top 85%",
    end: "top 50%",
    duration: 1,
    ease: "power2.out",
    contentSelector: ".section-content",
    directions: [
      { x: -40, y: 20 },
      { x: 40, y: 20 },
      { x: 30, y: 30 },
      { x: -30, y: 20 },
      { x: 40, y: 30 },
    ],
  });

  // Animate right paragraph text with the same effect as expertise text in Experience
  useEffect(() => {
    const el = rightParagraphRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;

    gsap.fromTo(
      el,
      {
        opacity: isInViewport ? 1 : 0,
        y: isInViewport ? 0 : 20,
        clipPath: isInViewport ? "inset(0% 0% 0% 0%)" : "inset(0% 0% 100% 0%)",
      },
      {
        opacity: 1,
        y: 0,
        clipPath: "inset(0% 0% 0% 0%)",
        duration: 2,
        ease: "power1.out",
        scrollTrigger: {
          trigger: el,
          start: "top 90%",
          end: "top 50%",
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
    <section
      ref={aboutSectionRef}
      id="about"
      className="mt-0 sm:mt-[50px] md:mt-[70px] pt-8 sm:pt-10 md:pt-12 pb-24 px-4 sm:px-6 lg:px-8 min-h-screen bg-[#F5F3EE] relative overflow-hidden"
    >
      {/* Subtle background pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #2D5016 1px, transparent 0)`,
          backgroundSize: "40px 40px",
        }}
      ></div>

      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Title */}
        <div className="mb-8 sm:mb-10 md:mb-12 lg:mb-16 lg:flex lg:items-start lg:justify-between lg:gap-12">
          <div className="flex-1">
            <ScrollFloat
              animationDuration={1}
              ease="back.inOut(2)"
              scrollStart="center bottom+=50%"
              scrollEnd="bottom bottom-=40%"
              stagger={0.03}
              containerClassName="my-0"
              textClassName="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-serif text-[#2D5016] leading-[0.9] tracking-tighter"
              textStyle={{ fontFamily: "'Brimful', serif", letterSpacing: '0.05em' }}
            >
              ABOUT ME
            </ScrollFloat>
            <div className="flex items-center gap-3 mt-3 sm:mt-4">
              <div className="h-[1px] w-12 bg-[#2D5016] opacity-30"></div>
              <div className="text-[#2D5016] text-sm opacity-40 tracking-[0.3em]">
                ***
              </div>
              <div className="h-[1px] w-12 bg-[#2D5016] opacity-30"></div>
            </div>

            {/* Rectangular Image Placeholder */}
            <div className="mt-6 sm:mt-8 w-full max-w-md group ">
              <PixelTransition
                firstContent={
                  <img
                    src="/imgleft.jpg"
                    alt="About me"
                    className="w-full h-[200px] sm:h-[240px] lg:h-[280px] object-cover grayscale group-hover:grayscale-0 transition-all duration-700 rounded-lg"
                  />
                }
                secondContent={
                  <img
                    src="/imgleft.jpg"
                    alt="About me"
                    className="w-full h-[200px] sm:h-[240px] lg:h-[280px] object-cover grayscale group-hover:grayscale-0 transition-all duration-700 rounded-lg"
                  />
                }
                gridSize={7}
                pixelColor="#2D5016"
                animationStepDuration={0.3}
                once={false}
                className="w-full bg-transparent !border-0 rounded-lg"
                aspectRatio="0%"
                style={{ height: "200px", border: "none !important" }}
              />
            </div>
          </div>

          {/* Right Side - Small Paragraph Text */}
          <div className="mt-6 sm:mt-8 md:mt-10 lg:mt-0 lg:max-w-md xl:max-w-lg lg:text-right">
            <p
              ref={rightParagraphRef}
              className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-serif text-[#2D5016] leading-[1.3] tracking-tight"
            >
              I'm most inspired by technology, problem-solving and creative
              coding. I can't imagine my life without building meaningful
              digital experiences. Have to say all of these right ( lol🤦‍♂️)
            </p>
            <div className="flex items-center gap-3 mt-4 sm:mt-5 lg:justify-end">
              <div className="h-[1px] w-12 bg-[#2D5016] opacity-30"></div>
              <div className="text-[#2D5016] text-sm opacity-40 tracking-[0.3em]">
                ***
              </div>
              <div className="h-[1px] w-12 bg-[#2D5016] opacity-30"></div>
            </div>
          </div>
        </div>

        {/* Scattered Layout Container */}
        <div className="relative min-h-[900px] lg:min-h-[1100px] xl:min-h-[1200px]">
          {/* Middle Image Placeholder */}
          <div className="absolute top-[-5%] right-[8%] w-[240px] sm:w-[280px] lg:w-[300px] hidden lg:block z-0 group">
            <PixelTransition
              firstContent={
                <img
                  src="/imgright.png"
                  alt="About me"
                  className="w-full h-[180px] sm:h-[200px] lg:h-[220px] object-cover object-center grayscale group-hover:grayscale-0 transition-all duration-700 rounded-2xl"
                  style={{ objectPosition: 'center 120%' }}
                />
              }
              secondContent={
                <img
                  src="/imgright.png"
                  alt="About me"
                  className="w-full h-[180px] sm:h-[200px] lg:h-[220px] object-cover object-center grayscale group-hover:grayscale-0 transition-all duration-700 rounded-2xl"
                  style={{ objectPosition: 'center 120%' }}
                />
              }
              gridSize={7}
              pixelColor="#2D5016"
              animationStepDuration={0.3}
              once={false}
              className="w-full rounded-2xl bg-transparent !border-0"
              aspectRatio="0%"
              style={{ height: "180px", border: "none !important" }}
            />
          </div>

          {/* Scattered Sections */}
          {aboutSections.map((section, index) => (
            <div
              key={section.number}
              ref={(el) => {
                sectionRefs.current[index] = el;
              }}
              className="absolute hidden lg:block"
              style={{
                top: section.position.top,
                left: section.position.left,
                right: section.position.right,
                bottom: section.position.bottom,
                maxWidth: section.position.maxWidth,
              }}
            >
              <div className="section-content flex gap-4 items-start p-5 rounded-xl">
                <div className="shrink-0 relative">
                  <span className="text-3xl font-extralight text-[#2D5016]/20">
                    {section.number}
                  </span>
                </div>
                <div>
                  <h3 className="text-[11px] font-semibold text-[#2D5016] mb-3 tracking-[0.15em] uppercase">
                    {section.title}
                  </h3>
                  <p className="text-[13px] text-[#2D5016]/80 leading-relaxed font-light tracking-wide">
                    {section.text}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {/* Mobile/Tablet Layout - Stacked */}
          <div className="lg:hidden space-y-4 sm:space-y-5 md:space-y-6">
            {aboutSections.map((section, index) => (
              <div
                key={section.number}
                ref={(el) => {
                  sectionRefs.current[index + 5] = el;
                }}
                className="section-content flex gap-4 p-5 rounded-xl"
              >
                <div className="shrink-0">
                  <span className="text-3xl font-extralight text-[#2D5016]/20">
                    {section.number}
                  </span>
                </div>
                <div>
                  <h3 className="text-[11px] font-semibold text-[#2D5016] mb-3 tracking-[0.15em] uppercase">
                    {section.title}
                  </h3>
                  <p className="text-[13px] text-[#2D5016]/80 leading-relaxed font-light tracking-wide">
                    {section.text}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Central Image - Vertical/Portrait with Rounded Edges */}
          <div className="absolute top-[65%] left-1/2 transform -translate-x-1/2 -translate-y-[60%] z-10 hidden lg:block group">
            <div className="relative">
              <PixelTransition
                firstContent={
                  <img
                    src="/img3.jpg"
                    alt="About me"
                    className="w-[300px] h-[480px] xl:w-[340px] xl:h-[540px] object-cover grayscale group-hover:grayscale-0 transition-all duration-700 rounded-3xl"
                    style={{ transform: "translateY(-30px)" }}
                  />
                }
                secondContent={
                  <img
                    src="/img3.jpg"
                    alt="About me"
                    className="w-[300px] h-[480px] xl:w-[340px] xl:h-[540px] object-cover grayscale group-hover:grayscale-0 transition-all duration-700 rounded-3xl"
                    style={{ transform: "translateY(-30px)" }}
                  />
                }
                gridSize={7}
                pixelColor="#2D5016"
                animationStepDuration={0.3}
                once={false}
                className="rounded-3xl bg-transparent !border-0"
                aspectRatio="0%"
                style={{
                  width: "300px",
                  height: "480px",
                  border: "none !important",
                }}
              />
            </div>
          </div>

          {/* Mobile Image */}
          <div className="lg:hidden mx-auto my-8 sm:my-10 md:my-12 max-w-[280px] group">
            <PixelTransition
              firstContent={
                <img
                  src="/img3.jpg"
                  alt="About me"
                  className="w-[280px] h-[420px] object-cover grayscale group-hover:grayscale-0 transition-all duration-700 rounded-3xl"
                  style={{ transform: "translateY(-20px)" }}
                />
              }
              secondContent={
                <img
                  src="/img3.jpg"
                  alt="About me"
                  className="w-[280px] h-[420px] object-cover grayscale group-hover:grayscale-0 transition-all duration-700 rounded-3xl"
                  style={{ transform: "translateY(-20px)" }}
                />
              }
              gridSize={7}
              pixelColor="#2D5016"
              animationStepDuration={0.3}
              once={true}
              className="rounded-3xl bg-transparent !border-0"
              aspectRatio="0%"
              style={{ width: "280px", height: "420px", border: "none !important" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
