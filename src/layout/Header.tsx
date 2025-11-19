import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { PERSONAL_INFO, NAV_ITEMS } from '@/constants/constants';
import { cn } from '@/lib/utils';
import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollToPlugin);

export default function Header() {
  const logoRef = useRef<HTMLAnchorElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  // Removed sticky scroll tracking

  // GSAP Animations on Mount
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate logo
      gsap.from(logoRef.current, {
        opacity: 0,
        x: -30,
        duration: 0.8,
        ease: 'power3.out',
      });

      // Navigation elements removed; no nav item animation

      // Animate CTA button
      gsap.from(ctaRef.current, {
        opacity: 0,
        scale: 0.8,
        duration: 0.6,
        ease: 'back.out(1.7)',
        delay: 0.6,
      });

      // Sticky background effect removed
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
    <header
      className={cn('relative w-full transition-all duration-500')}
    >
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

          {/* Navigation removed */}

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

          {/* Mobile Menu removed */}
        </div>

        {/* Mobile Menu removed */}
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
  );
}