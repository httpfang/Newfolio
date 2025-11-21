import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { PERSONAL_INFO, NAV_ITEMS } from '@/constants/constants';
import { cn } from '@/lib/utils';
import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import GitStreakChart from '@/assets/GitStreakChart.png';
import SplitText from '@/components/bits/SplitText';

gsap.registerPlugin(ScrollToPlugin);

export default function Hero() {
  const logoRef = useRef<HTMLAnchorElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

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
            ease: 'power3.out',
          });

          // Animate CTA button
          gsap.from(ctaRef.current, {
            opacity: 0,
            scale: 0.8,
            duration: 0.6,
            ease: 'back.out(1.7)',
            delay: 0.6,
          });
        });
      };

      // Check if loader is already complete
      const loaderElement = document.querySelector('.loader-container');
      
      let cleanup: (() => void) | undefined;
      
      if (!loaderElement) {
        // Loader already completed, start animations immediately
        startAnimations();
      } else {
        // Wait for loader to complete - start immediately when event fires
        const handleLoaderComplete = () => {
          startAnimations();
        };
        
        window.addEventListener('loaderComplete', handleLoaderComplete, { once: true });
        
        cleanup = () => {
          window.removeEventListener('loaderComplete', handleLoaderComplete);
        };
      }

      return cleanup;
    });

    return () => ctx.revert();
  }, []);

  const handleNavClick = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      gsap.to(window, {
        duration: 1,
        scrollTo: { y: element, offsetY: 80 },
        ease: 'power3.inOut',
      });
    }
  };

  // Full-screen menu overlay state and refs
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const openMenu = () => {
    setIsMenuOpen(true);
    requestAnimationFrame(() => {
      if (!menuRef.current) return;
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.fromTo(
        menuRef.current,
        { opacity: 0, yPercent: -2 },
        { opacity: 1, yPercent: 0, duration: 0.4 }
      );
      const items = menuRef.current.querySelectorAll('.overlay-item');
      if (items.length) tl.from(items, { opacity: 0, y: 20, stagger: 0.08, duration: 0.5 }, '-=0.1');
      const socials = menuRef.current.querySelectorAll('.overlay-social');
      if (socials.length) tl.from(socials, { opacity: 0, y: 10, stagger: 0.05, duration: 0.3 }, '-=0.3');
    });
  };

  const closeMenu = () => {
    if (!menuRef.current) return setIsMenuOpen(false);
    const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' } });
    tl.to(menuRef.current, { opacity: 0, yPercent: -2, duration: 0.35 }).add(() => setIsMenuOpen(false));
  };

  // CTA hover/leave: spin 360° and scale for delight
  const handleCTAHover = (e: React.MouseEvent<HTMLButtonElement>) => {
    gsap.to(e.currentTarget, {
      rotation: '+=360',
      scale: 1.1,
      duration: 0.6,
      ease: 'power2.out',
      overwrite: 'auto',
    });
  };

  const handleCTALeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    gsap.to(e.currentTarget, {
      scale: 1,
      duration: 0.4,
      ease: 'power2.inOut',
      overwrite: 'auto',
    });
  };

  return (
    <>
      <header className={cn('relative w-full transition-all duration-500')}>
        <nav className="container mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <a
              ref={logoRef}
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('#home');
              }}
              className="text-2xl font-serif italic text-black tracking-tight hover:opacity-80 transition-opacity relative"
              onMouseEnter={(e) => {
                gsap.to(e.currentTarget, {
                  x: 5,
                  duration: 0.3,
                  ease: 'power2.out',
                });
              }}
              onMouseLeave={(e) => {
                gsap.to(e.currentTarget, {
                  x: 0,
                  duration: 0.3,
                  ease: 'power2.out',
                });
              }}
            >
              {PERSONAL_INFO.name?.split(' ')[0] || 'Arlo'}
            </a>

            {/* CTA Emoji */}
            <div ref={ctaRef} className="hidden md:block">
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
          <div ref={menuRef} className="fixed inset-0 z-[100] bg-[#e8defa] text-[#1a1a1a]">
            <div className="flex flex-col h-full">
              {/* Top bar */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-black/10">
                <span className="text-xs tracking-widest uppercase">{PERSONAL_INFO.name || 'Portfolio'}</span>
                <button
                  aria-label="Close menu"
                  className="text-3xl leading-none bg-transparent hover:bg-transparent"
                  onClick={closeMenu}
                >
                  -
                </button>
              </div>

              {/* Center menu items - scattered layout */}
              <div className="relative flex-1">
                {NAV_ITEMS.map((item, idx) => {
                  const positions = [
                    { top: '10%', left: '8%', rotate: -6, size: 'text-7xl md:text-8xl' },
                    { top: '28%', left: '36%', rotate: 8, size: 'text-6xl md:text-7xl' },
                    { top: '58%', left: '14%', rotate: -3, size: 'text-8xl md:text-9xl' },
                    { top: '22%', left: '72%', rotate: 6, size: 'text-7xl md:text-8xl' },
                    { top: '70%', left: '48%', rotate: -7, size: 'text-6xl md:text-7xl' },
                    { top: '45%', left: '84%', rotate: 3, size: 'text-5xl md:text-6xl' },
                  ];
                  const p = positions[idx % positions.length];
                  return (
                    <button
                      key={item.href}
                      className={cn(
                        'overlay-item absolute font-serif italic tracking-wide',
                        p.size
                      )}
                      style={{ top: p.top, left: p.left, transform: `rotate(${p.rotate}deg)` }}
                      onClick={() => {
                        closeMenu();
                        handleNavClick(item.href);
                      }}
                      onMouseEnter={(e) => {
                        gsap.to(e.currentTarget, { scale: 1.08, y: -4, duration: 0.25, ease: 'power2.out', overwrite: 'auto' });
                      }}
                      onMouseLeave={(e) => {
                        gsap.to(e.currentTarget, { scale: 1, y: 0, duration: 0.2, ease: 'power2.inOut', overwrite: 'auto' });
                      }}
                    >
                      {item.label.toUpperCase()}
                    </button>
                  );
                })}
              </div>

              {/* Bottom socials */}
              <div className="grid grid-cols-4 border-t border-black/10">
                {['Instagram', 'LinkedIn', 'Behance', 'Dribbble'].map((name, idx) => (
                  <a
                    key={name}
                    href="#"
                    className={cn(
                      'overlay-social text-center py-3 text-xs uppercase tracking-wider border-black/10',
                      idx !== 3 && 'border-r'
                    )}
                    onClick={(e) => e.preventDefault()}
                  >
                    {name}
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>

      <section
        id="home"
        className="relative min-h-screen flex items-center px-6 md:px-10 pt-20 md:mt-16 mb-[40px]"
      >
      <div className="max-w-6xl mx-auto w-full mt-20">
        {/* Top playful illustration vibes */}
        <div className="pointer-events-none absolute inset-x-0 top-8 flex justify-center ">
          <img
            src={GitStreakChart}
            alt="Git streak chart"
            className="hidden md:block w-full max-w-[1200px] h-auto"
          />
        </div>

        {/* Headline */}
        <h1 className="text-[#1C1B1A] font-black tracking-tight leading-[0.9] text-5xl sm:text-6xl md:text-7xl mt-70">
          <SplitText
            text="Overclocked and stateside"
            className="block"
            delay={100}
            duration={0.9}
          />
          <h1 className="mt-1">
            <SplitText
              text="code tracker"
              className="block"
              delay={100}
              duration={0.6}
            />
          </h1>
        </h1>

        {/* Subcopy */}
        <p className="mt-4 max-w-2xl text-[#4A4947] text-lg md:text-xl">
          A cheeky tool for global devs, caffeine enthusiasts, and frequent
          flyers between client and server. Track commits, uptime, and vibes —
          all in one place.
        </p>

        {/* CTA pill */}
        <a
          href="#projects"
          className="mt-8 w-full rounded-full h-14 md:h-16 bg-[#E6B25C] border border-[#D9A650] shadow-sm flex items-center px-6 text-[#1C1B1A] transition-transform duration-300 ease-in-out hover:scale-105 cursor-pointer"
        >
          <span className="inline-flex items-center gap-2 font-medium">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M12 0c-2.2 0-4 1.8-4 4 0 1.7 1.1 3.3 2.6 3.7-.1.5-.3 1.1-.6 1.7-.4.9-1 1.9-1.8 2.8-.4.4-.8.9-1.3 1.3-.6.6-1.1 1.3-1.7 2.1-.8 1.1-1.4 2.3-1.6 3.6-.1.6.4 1.2 1 1.2.3 0 .6-.1.8-.3 1.6-1.2 3.3-2 5.1-2.4 1.8-.4 3.7-.4 5.5 0 1.9.5 3.6 1.3 5.2 2.5.2.2.5.3.8.3.6 0 1.1-.6 1-1.2-.3-1.4-.9-2.7-1.7-3.8-.6-.8-1.2-1.5-1.8-2.1-.5-.5-.9-.9-1.3-1.4-.8-.9-1.4-1.9-1.8-2.8-.3-.6-.5-1.2-.6-1.7C16.9 7.2 18 5.6 18 4c0-2.2-1.8-4-4-4-1.2 0-2.2.5-3 1.3C14.2 1.6 13.5 1 12.7 1c-.4 0-.8.2-1 .5C11.2 1.2 11.1 1 11 1c-.5 0-.9.4-.9.9 0 .2.1.4.2.6-.2-.3-.5-.5-.8-.5z" />
            </svg>
            Clone from GitHub
          </span>
          <span className="ml-auto w-10 h-10 md:w-11 md:h-11 rounded-full border border-[#1C1B1A] flex items-center justify-center">
            <span className="text-2xl">→</span>
          </span>
        </a>
      </div>
    </section>
    </>
  );
}

