import { useState, useEffect, useRef } from "react";
import { Button } from "@/ui/button";
import { PERSONAL_INFO, NAV_ITEMS } from "@/constants/constants";
import { cn } from "@/lib/utils";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import GitStreakChart from "@/assets/GitStreakChart.png";
import SplitText from "@/bits/SplitText";

gsap.registerPlugin(ScrollToPlugin, ScrollTrigger);

export default function Hero() {
  const logoRef = useRef<HTMLAnchorElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const subcopyRef = useRef<HTMLParagraphElement>(null);

  // GSAP Animations on Mount - Wait for loader to complete
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Function to start animations immediately
      const startAnimations = () => {
        // Use requestAnimationFrame to ensure smooth start on next frame
        requestAnimationFrame(() => {
          // Animate logo
          gsap.from(logoRef.current, {
            opacity: 0,
            x: -30,
            duration: 0.8,
            ease: "power3.out",
          });

          // Animate CTA button
          gsap.from(ctaRef.current, {
            opacity: 0,
            scale: 0.8,
            duration: 0.6,
            ease: "back.out(1.7)",
            delay: 0.6,
          });
        });
      };

      // Check if loader is already complete
      const loaderElement = document.querySelector(".loader-container");

      let cleanup: (() => void) | undefined;

      if (!loaderElement) {
        // Loader already completed, start animations immediately
        startAnimations();
      } else {
        // Wait for loader to complete - start immediately when event fires
        const handleLoaderComplete = () => {
          startAnimations();
        };

        window.addEventListener("loaderComplete", handleLoaderComplete, {
          once: true,
        });

        cleanup = () => {
          window.removeEventListener("loaderComplete", handleLoaderComplete);
        };
      }

      return cleanup;
    });

    return () => ctx.revert();
  }, []);

  // ScrollTrigger animation for subcopy - Award-winning style (works on scroll up and down)
  // Only enabled on desktop/tablet, disabled on mobile
  useEffect(() => {
    if (!subcopyRef.current) return;

    // Check if mobile (less than 768px)
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      // On mobile, just set visible state without animation
      const paragraphs = subcopyRef.current?.querySelectorAll("p");
      if (paragraphs && paragraphs.length > 0) {
        gsap.set(paragraphs, {
          opacity: 1,
          y: 0,
          clipPath: "inset(0 0 0% 0)",
        });
      }
      return;
    }

    const ctx = gsap.context(() => {
      const paragraphs = subcopyRef.current?.querySelectorAll("p");
      if (!paragraphs || paragraphs.length === 0) return;

      // Create ScrollTrigger animations that work both ways
      paragraphs.forEach((para, index) => {
        // Create timeline for each paragraph
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: para,
            start: "top 90%",
            end: "top 50%",
            scrub: 1,
            toggleActions: "play none none reverse",
          },
        });

        // Set initial state
        gsap.set(para, {
          opacity: 0,
          y: 60,
          clipPath: "inset(0 0 100% 0)",
        });

        // Animate in
        tl.to(para, {
          opacity: 1,
          y: 0,
          clipPath: "inset(0 0 0% 0)",
          duration: 1,
          ease: "power4.out",
          delay: index * 0.15,
        });

        // Subtle parallax on scroll for depth (works both ways)
        ScrollTrigger.create({
          trigger: para,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.5,
          onUpdate: (self) => {
            const progress = self.progress;
            gsap.to(para, {
              y: progress * 25,
              ease: "none",
            });
          },
        });
      });
    });

    return () => ctx.revert();
  }, []);

  const handleNavClick = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      gsap.to(window, {
        duration: 1,
        scrollTo: { y: element, offsetY: 80 },
        ease: "power3.inOut",
      });
    }
  };

  // Full-screen menu overlay state and refs
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Prevent body scroll when menu overlay is open
  useEffect(() => {
    if (isMenuOpen) {
      // Save current scroll position
      const scrollY = window.scrollY;
      // Apply styles to prevent scrolling
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";

      return () => {
        // Restore scroll position when menu closes
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
        document.body.style.overflow = "";
        window.scrollTo(0, scrollY);
      };
    }
  }, [isMenuOpen]);

  const openMenu = () => {
    setIsMenuOpen(true);
    requestAnimationFrame(() => {
      if (!menuRef.current) return;
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(
        menuRef.current,
        { opacity: 0, yPercent: -2 },
        { opacity: 1, yPercent: 0, duration: 0.4 }
      );
      const items = menuRef.current.querySelectorAll(".overlay-item");
      if (items.length)
        tl.from(
          items,
          { opacity: 0, y: 20, stagger: 0.08, duration: 0.5 },
          "-=0.1"
        );
      const socials = menuRef.current.querySelectorAll(".overlay-social");
      if (socials.length)
        tl.from(
          socials,
          { opacity: 0, y: 10, stagger: 0.05, duration: 0.3 },
          "-=0.3"
        );
    });
  };

  const closeMenu = () => {
    if (!menuRef.current) return setIsMenuOpen(false);
    const tl = gsap.timeline({ defaults: { ease: "power2.inOut" } });
    tl.to(menuRef.current, { opacity: 0, yPercent: -2, duration: 0.35 }).add(
      () => setIsMenuOpen(false)
    );
  };

  // CTA hover/leave: spin 360° and scale for delight
  const handleCTAHover = (e: React.MouseEvent<HTMLButtonElement>) => {
    gsap.to(e.currentTarget, {
      rotation: "+=360",
      scale: 1.1,
      duration: 0.6,
      ease: "power2.out",
      overwrite: "auto",
    });
  };

  const handleCTALeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    gsap.to(e.currentTarget, {
      scale: 1,
      duration: 0.4,
      ease: "power2.inOut",
      overwrite: "auto",
    });
  };

  return (
    <>
      <header className={cn("relative w-full transition-all duration-500")}>
        <nav className="container mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <a
              ref={logoRef}
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick("#home");
              }}
              className="text-xl sm:text-2xl font-serif italic text-black tracking-tight hover:opacity-80 transition-opacity relative"
              onMouseEnter={(e) => {
                gsap.to(e.currentTarget, {
                  x: 5,
                  duration: 0.3,
                  ease: "power2.out",
                });
              }}
              onMouseLeave={(e) => {
                gsap.to(e.currentTarget, {
                  x: 0,
                  duration: 0.3,
                  ease: "power2.out",
                });
              }}
            >
              {PERSONAL_INFO.name?.split(" ")[0] || "Arlo"}
            </a>

            {/* CTA Emoji */}
            <div ref={ctaRef}>
              <Button
                variant="ghost"
                className="p-0 bg-transparent hover:bg-transparent text-2xl"
                onClick={openMenu}
                aria-label="Open menu"
                onMouseEnter={handleCTAHover}
                onMouseLeave={handleCTALeave}
              >
                😊
              </Button>
            </div>
          </div>
        </nav>

        {/* Full-screen Overlay Menu */}
        {isMenuOpen && (
          <div
            ref={menuRef}
            className="fixed inset-0 z-[100] bg-[#e8defa] text-[#1a1a1a] overflow-y-auto"
          >
            <div className="flex flex-col h-full min-h-screen">
              {/* Top bar */}
              <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-black/10">
                <span className="text-[10px] sm:text-xs tracking-widest uppercase">
                  {PERSONAL_INFO.name || "Portfolio"}
                </span>
                <button
                  aria-label="Close menu"
                  className="text-2xl sm:text-3xl leading-none bg-transparent hover:bg-transparent"
                  onClick={closeMenu}
                >
                  -
                </button>
              </div>

              {/* Center menu items - stacked on mobile, scattered on desktop */}
              <div className="relative flex-1">
                {/* Mobile/Tablet Layout - Stacked */}
                <div className="md:hidden flex flex-col items-center justify-center h-full px-4 space-y-6 sm:space-y-8">
                  {NAV_ITEMS.map((item) => (
                    <button
                      key={item.href}
                      className={cn(
                        "overlay-item font-serif italic tracking-wide text-4xl sm:text-5xl"
                      )}
                      onClick={() => {
                        closeMenu();
                        handleNavClick(item.href);
                      }}
                      onTouchStart={(e) => {
                        gsap.to(e.currentTarget, {
                          scale: 0.95,
                          duration: 0.15,
                          ease: "power2.out",
                          overwrite: "auto",
                        });
                      }}
                      onTouchEnd={(e) => {
                        gsap.to(e.currentTarget, {
                          scale: 1,
                          duration: 0.15,
                          ease: "power2.inOut",
                          overwrite: "auto",
                        });
                      }}
                    >
                      {item.label.toUpperCase()}
                    </button>
                  ))}
                </div>

                {/* Desktop Layout - Scattered */}
                <div className="hidden md:block relative h-full">
                  {NAV_ITEMS.map((item, idx) => {
                    const positions = [
                      {
                        top: "10%",
                        left: "8%",
                        rotate: -6,
                        size: "text-7xl lg:text-8xl",
                      },
                      {
                        top: "28%",
                        left: "36%",
                        rotate: 8,
                        size: "text-6xl lg:text-7xl",
                      },
                      {
                        top: "58%",
                        left: "14%",
                        rotate: -3,
                        size: "text-8xl lg:text-9xl",
                      },
                      {
                        top: "22%",
                        left: "72%",
                        rotate: 6,
                        size: "text-7xl lg:text-8xl",
                      },
                      {
                        top: "70%",
                        left: "48%",
                        rotate: -7,
                        size: "text-6xl lg:text-7xl",
                      },
                      {
                        top: "45%",
                        left: "84%",
                        rotate: 3,
                        size: "text-5xl lg:text-6xl",
                      },
                    ];
                    const p = positions[idx % positions.length];
                    return (
                      <button
                        key={item.href}
                        className={cn(
                          "overlay-item absolute font-serif italic tracking-wide",
                          p.size
                        )}
                        style={{
                          top: p.top,
                          left: p.left,
                          transform: `rotate(${p.rotate}deg)`,
                        }}
                        onClick={() => {
                          closeMenu();
                          handleNavClick(item.href);
                        }}
                        onMouseEnter={(e) => {
                          gsap.to(e.currentTarget, {
                            scale: 1.08,
                            y: -4,
                            duration: 0.25,
                            ease: "power2.out",
                            overwrite: "auto",
                          });
                        }}
                        onMouseLeave={(e) => {
                          gsap.to(e.currentTarget, {
                            scale: 1,
                            y: 0,
                            duration: 0.2,
                            ease: "power2.inOut",
                            overwrite: "auto",
                          });
                        }}
                      >
                        {item.label.toUpperCase()}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Bottom socials */}
              <div className="grid grid-cols-4 border-t border-black/10">
                <a
                  href="https://www.linkedin.com/in/harsh-verma-develop/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="overlay-social text-center py-2.5 sm:py-3 text-[10px] sm:text-xs uppercase tracking-wider border-black/10 border-r"
                >
                  LinkedIn
                </a>
                <a
                  href="https://www.instagram.com/fanggore/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="overlay-social text-center py-2.5 sm:py-3 text-[10px] sm:text-xs uppercase tracking-wider border-black/10 border-r"
                >
                  Instagram
                </a>
                <a
                  href="https://x.com/fanghttp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="overlay-social text-center py-2.5 sm:py-3 text-[10px] sm:text-xs uppercase tracking-wider border-black/10 border-r"
                >
                  Twitter
                </a>
                <div className="overlay-social text-center py-2.5 sm:py-3 text-[10px] sm:text-xs uppercase tracking-wider">
                  enough broo!!!
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      <section
        id="home"
        className="relative flex items-center px-4 sm:px-6 md:px-10 mt-[94px] sm:mt-[102px] md:mt-[118px] pt-8 sm:pt-12 md:pt-16 pb-20 sm:pb-24 md:pb-20"
      >
        <div className="max-w-6xl mx-auto w-full">
          {/* Top playful illustration vibes */}
          <div className="pointer-events-none flex flex-col items-center justify-center mb-6 sm:mb-8 md:mb-0 md:absolute md:inset-x-0 md:top-4">
            <img
              src={GitStreakChart}
              alt="Git streak chart"
              className="block w-full max-w-[600px] sm:max-w-[720px] md:max-w-[1200px] h-auto"
            />
            {/* Small italic caption below image */}
            <p className="block mt-2 sm:mt-3 text-[10px] sm:text-xs italic text-[#4A4947] text-center px-4">
              dont take the content serious im still building
            </p>
          </div>

          {/* Content wrapper - positioned below image on mobile, absolute on desktop */}
          <div className="relative mt-8 sm:mt-10 md:mt-[280px] lg:mt-[320px]">
            {/* Headline */}
            <h1 className="text-[#1C1B1A] font-black tracking-tight leading-[1.3] sm:leading-[1.1] text-2xl sm:text-4xl md:text-5xl lg:text-6xl">
              <SplitText
                text="Overclocked & emotionally"
                className="block"
                delay={100}
                duration={0.9}
              />
              <span className="block">
                <SplitText
                  text="attached to my commits"
                  className="block"
                  delay={100}
                  duration={0.6}
                />
              </span>
            </h1>

            {/* Subcopy */}
            <div ref={subcopyRef} className="mt-3 sm:mt-4 md:mt-5 max-w-2xl">
              <p className="text-[#4A4947] text-base sm:text-lg md:text-xl leading-relaxed">
                Track commits, uptime, chaos levels, and questionable life choices
                all in one dangerously clean interface.A mildly unhinged visual
                diary of my late nights, caffeine decisions, and the "one last
                commit" that turned into fifteen.
              </p>
              <p className="text-[#4A4947] text-base sm:text-lg md:text-xl leading-relaxed mt-2">
                Warning: May cause productivity, obsession, and an unhealthy
                attachment to green squares.
              </p>
            </div>

            {/* CTA pill */}
            <a
              href="#projects"
              className="mt-5 sm:mt-6 md:mt-8 w-full sm:w-auto sm:max-w-md rounded-full h-12 sm:h-14 md:h-16 bg-[#E6B25C] border border-[#D9A650] shadow-sm flex items-center justify-between px-4 sm:px-6 md:px-8 text-[#1C1B1A] transition-transform duration-300 ease-in-out hover:scale-105 cursor-pointer active:scale-95"
            >
              <span className="inline-flex items-center gap-2 font-medium text-sm sm:text-base md:text-lg">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                  className="sm:w-[18px] sm:h-[18px]"
                >
                  <path d="M12 0c-2.2 0-4 1.8-4 4 0 1.7 1.1 3.3 2.6 3.7-.1.5-.3 1.1-.6 1.7-.4.9-1 1.9-1.8 2.8-.4.4-.8.9-1.3 1.3-.6.6-1.1 1.3-1.7 2.1-.8 1.1-1.4 2.3-1.6 3.6-.1.6.4 1.2 1 1.2.3 0 .6-.1.8-.3 1.6-1.2 3.3-2 5.1-2.4 1.8-.4 3.7-.4 5.5 0 1.9.5 3.6 1.3 5.2 2.5.2.2.5.3.8.3.6 0 1.1-.6 1-1.2-.3-1.4-.9-2.7-1.7-3.8-.6-.8-1.2-1.5-1.8-2.1-.5-.5-.9-.9-1.3-1.4-.8-.9-1.4-1.9-1.8-2.8-.3-.6-.5-1.2-.6-1.7C16.9 7.2 18 5.6 18 4c0-2.2-1.8-4-4-4-1.2 0-2.2.5-3 1.3C14.2 1.6 13.5 1 12.7 1c-.4 0-.8.2-1 .5C11.2 1.2 11.1 1 11 1c-.5 0-.9.4-.9.9 0 .2.1.4.2.6-.2-.3-.5-.5-.8-.5z" />
                </svg>
                Clone from GitHub
              </span>
              <span className="w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-full border border-[#1C1B1A] flex items-center justify-center shrink-0">
                <span className="text-lg sm:text-xl md:text-2xl">→</span>
              </span>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
