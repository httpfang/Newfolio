import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ScrollFloat from "@/components/bits/ScrollFloat";
import SplitTextLines from "@/components/bits/SplitTextLines";
import PixelTransition from "@/components/bits/PixelTransition";
import { useScrollCardReveal } from "@/components/bits/useScrollCardReveal";

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

  return (
    <section
      ref={aboutSectionRef}
      id="about"
      className="mt-[70px] pt-12 pb-24 px-4 sm:px-6 lg:px-8 min-h-screen bg-[#F5F3EE] relative overflow-hidden"
    >
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, #2D5016 1px, transparent 0)`,
        backgroundSize: '40px 40px'
      }}></div>
      
      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Title */}
        <div className="mb-12 lg:mb-16 lg:flex lg:items-start lg:justify-between lg:gap-12">
          <div className="flex-1">
            <ScrollFloat
              animationDuration={1}
              ease="back.inOut(2)"
              scrollStart="center bottom+=50%"
              scrollEnd="bottom bottom-=40%"
              stagger={0.03}
              containerClassName="my-0"
              textClassName="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-serif text-[#2D5016] leading-[0.9] tracking-tighter"
            >
              ABOUT ME
            </ScrollFloat>
            <div className="flex items-center gap-3 mt-4">
              <div className="h-[1px] w-12 bg-[#2D5016] opacity-30"></div>
              <div className="text-[#2D5016] text-sm opacity-40 tracking-[0.3em]">***</div>
              <div className="h-[1px] w-12 bg-[#2D5016] opacity-30"></div>
            </div>
            
            {/* Rectangular Image Placeholder */}
            <div className="mt-8 w-full max-w-md group">
              <PixelTransition
                firstContent={
                  <div className="w-full h-[200px] sm:h-[240px] lg:h-[280px] flex items-center justify-center text-[#2D5016] bg-[#E8E6E1] rounded-lg border border-[#2D5016]/10">
                    <p className="text-center px-4 text-sm font-light">
                      Image Placeholder
                      <br />
                      <span className="text-xs text-[#2D5016]/40">
                        (Add your image)
                      </span>
                    </p>
                  </div>
                }
                secondContent={
                  <img
                    src="/placeholder-rect.jpg"
                    alt="About me"
                    className="w-full h-[200px] sm:h-[240px] lg:h-[280px] object-cover grayscale hover:grayscale-[50%] transition-all duration-700 rounded-lg"
                  />
                }
                gridSize={7}
                pixelColor="#2D5016"
                animationStepDuration={0.3}
                once={false}
                className="w-full bg-transparent border-0 rounded-lg shadow-[0_8px_30px_rgb(45,80,22,0.08)] group-hover:shadow-[0_12px_40px_rgb(45,80,22,0.12)] transition-shadow duration-500"
                aspectRatio="0%"
                style={{ height: "200px" }}
              />
            </div>
          </div>

          {/* Right Side - Small Paragraph Text */}
          <div className="mt-10 lg:mt-0 lg:max-w-md xl:max-w-lg lg:text-right">
            <SplitTextLines
              className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-serif text-[#2D5016] leading-[1.3] tracking-tight"
              duration={1.5}
              stagger={0.1}
              ease="power4"
              scrollStart="top 70%"
              scrollEnd="top 30%"
              triggerElement={aboutSectionRef}
            >
              I'M MOST INSPIRED BY TECHNOLOGY, PROBLEM-SOLVING AND CREATIVE CODING. I CAN'T IMAGINE MY LIFE WITHOUT BUILDING MEANINGFUL DIGITAL EXPERIENCES.
            </SplitTextLines>
            <div className="flex items-center gap-3 mt-5 lg:justify-end">
              <div className="h-[1px] w-12 bg-[#2D5016] opacity-30"></div>
              <div className="text-[#2D5016] text-sm opacity-40 tracking-[0.3em]">***</div>
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
                <div className="w-full h-[180px] sm:h-[200px] lg:h-[220px] flex items-center justify-center text-[#2D5016] bg-[#E8E6E1] rounded-2xl border border-[#2D5016]/10">
                  <p className="text-center px-4 text-xs font-light">
                    Image
                    <br />
                    <span className="text-[10px] text-[#2D5016]/40">
                      (Add your image)
                    </span>
                  </p>
                </div>
              }
              secondContent={
                <img
                  src="/placeholder-middle.jpg"
                  alt="About me"
                  className="w-full h-[180px] sm:h-[200px] lg:h-[220px] object-cover grayscale hover:grayscale-[50%] transition-all duration-700 rounded-2xl"
                />
              }
              gridSize={7}
              pixelColor="#2D5016"
              animationStepDuration={0.3}
              once={false}
              className="w-full rounded-2xl shadow-[0_10px_40px_rgb(45,80,22,0.08)] group-hover:shadow-[0_15px_50px_rgb(45,80,22,0.12)] bg-transparent border-0 transition-shadow duration-500"
              aspectRatio="0%"
              style={{ height: "180px" }}
            />
          </div>

          {/* Scattered Sections */}
          {aboutSections.map((section, index) => (
            <div
              key={section.number}
              ref={(el) => {
                sectionRefs.current[index] = el;
              }}
              className="absolute hidden lg:block group"
              style={{
                top: section.position.top,
                left: section.position.left,
                right: section.position.right,
                bottom: section.position.bottom,
                maxWidth: section.position.maxWidth,
              }}
            >
              <div className="section-content flex gap-4 items-start p-5 rounded-xl hover:bg-white/40 transition-all duration-300">
                <div className="shrink-0 relative">
                  <span className="text-3xl font-extralight text-[#2D5016]/20 group-hover:text-[#2D5016]/40 transition-colors duration-300">
                    {section.number}
                  </span>
                  <div className="absolute -bottom-1 left-0 h-[1px] w-0 bg-[#2D5016] group-hover:w-full transition-all duration-500"></div>
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
          <div className="lg:hidden space-y-6">
            {aboutSections.map((section, index) => (
              <div
                key={section.number}
                ref={(el) => {
                  sectionRefs.current[index + 5] = el;
                }}
                className="section-content flex gap-4 p-5 rounded-xl bg-white/30 hover:bg-white/50 transition-all duration-300"
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
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 hidden lg:block group">
            <div className="relative">
              {/* Decorative corner elements */}
              <div className="absolute -top-3 -left-3 w-6 h-6 border-l-2 border-t-2 border-[#2D5016]/20 rounded-tl-lg"></div>
              <div className="absolute -bottom-3 -right-3 w-6 h-6 border-r-2 border-b-2 border-[#2D5016]/20 rounded-br-lg"></div>
              
              <PixelTransition
                firstContent={
                  <div className="w-[300px] h-[480px] xl:w-[340px] xl:h-[540px] flex items-center justify-center text-[#2D5016] rounded-3xl bg-[#E8E6E1] border border-[#2D5016]/10">
                    <p className="text-center px-4 font-light">
                      Your Photo
                      <br />
                      <span className="text-sm text-[#2D5016]/40">
                        (Add your image)
                      </span>
                    </p>
                  </div>
                }
                secondContent={
                  <img
                    src="/placeholder-about.jpg"
                    alt="About me"
                    className="w-[300px] h-[480px] xl:w-[340px] xl:h-[540px] object-cover grayscale hover:grayscale-0 transition-all duration-700 rounded-3xl"
                  />
                }
                gridSize={7}
                pixelColor="#2D5016"
                animationStepDuration={0.3}
                once={false}
                className="rounded-3xl shadow-[0_20px_60px_rgb(45,80,22,0.15)] group-hover:shadow-[0_25px_70px_rgb(45,80,22,0.2)] bg-transparent border-0 transition-shadow duration-500"
                aspectRatio="0%"
                style={{ width: "300px", height: "480px" }}
              />
            </div>
          </div>

          {/* Mobile Image */}
          <div className="lg:hidden mx-auto my-12 max-w-[280px]">
            <PixelTransition
              firstContent={
                <div className="w-[280px] h-[420px] flex items-center justify-center text-[#2D5016] rounded-3xl bg-[#E8E6E1] border border-[#2D5016]/10">
                  <p className="text-center px-4 font-light">
                    Your Photo
                    <br />
                    <span className="text-sm text-[#2D5016]/40">
                      (Add your image)
                    </span>
                  </p>
                </div>
              }
              secondContent={
                <img
                  src="/placeholder-about.jpg"
                  alt="About me"
                  className="w-[280px] h-[420px] object-cover grayscale rounded-3xl"
                />
              }
              gridSize={7}
              pixelColor="#2D5016"
              animationStepDuration={0.3}
              once={true}
              className="rounded-3xl shadow-[0_15px_50px_rgb(45,80,22,0.12)] bg-transparent border-0"
              aspectRatio="0%"
              style={{ width: "280px", height: "420px" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}