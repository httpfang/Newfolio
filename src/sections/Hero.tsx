
import GitStreakChart from '@/assets/GitStreakChart.png';

export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center px-6 md:px-10 pt-20"
    >
      <div className="max-w-6xl mx-auto w-full">
        {/* Top playful illustration vibes */}
        <div className="pointer-events-none absolute inset-x-0 top-8 flex justify-center opacity-80">
          <img src={GitStreakChart} alt="Git streak chart" width="900" height="180" className="hidden md:block" />
        </div>

        {/* Headline */}
        <h1 className="text-[#1C1B1A] font-black tracking-tight leading-[0.9] text-5xl sm:text-6xl md:text-7xl">
          Overclocked and stateside
          <br />
          code tracker
        </h1>

        {/* Subcopy */}
        <p className="mt-4 max-w-2xl text-[#4A4947] text-lg md:text-xl">
          A cheeky tool for global devs, caffeine enthusiasts, and frequent flyers between client and server. Track commits, uptime, and vibes — all in one place.
        </p>

        {/* CTA pill */}
        <a
          href="#projects"
          className="mt-8 w-full rounded-full h-14 md:h-16 bg-[#E6B25C] border border-[#D9A650] shadow-sm flex items-center px-6 text-[#1C1B1A]"
        >
          <span className="inline-flex items-center gap-2 font-medium">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 0c-2.2 0-4 1.8-4 4 0 1.7 1.1 3.3 2.6 3.7-.1.5-.3 1.1-.6 1.7-.4.9-1 1.9-1.8 2.8-.4.4-.8.9-1.3 1.3-.6.6-1.1 1.3-1.7 2.1-.8 1.1-1.4 2.3-1.6 3.6-.1.6.4 1.2 1 1.2.3 0 .6-.1.8-.3 1.6-1.2 3.3-2 5.1-2.4 1.8-.4 3.7-.4 5.5 0 1.9.5 3.6 1.3 5.2 2.5.2.2.5.3.8.3.6 0 1.1-.6 1-1.2-.3-1.4-.9-2.7-1.7-3.8-.6-.8-1.2-1.5-1.8-2.1-.5-.5-.9-.9-1.3-1.4-.8-.9-1.4-1.9-1.8-2.8-.3-.6-.5-1.2-.6-1.7C16.9 7.2 18 5.6 18 4c0-2.2-1.8-4-4-4-1.2 0-2.2.5-3 1.3C14.2 1.6 13.5 1 12.7 1c-.4 0-.8.2-1 .5C11.2 1.2 11.1 1 11 1c-.5 0-.9.4-.9.9 0 .2.1.4.2.6-.2-.3-.5-.5-.8-.5z"/></svg>
            Clone from GitHub
          </span>
          <span className="ml-auto w-10 h-10 md:w-11 md:h-11 rounded-full border border-[#1C1B1A] flex items-center justify-center">
            <span className="text-2xl">→</span>
          </span>
        </a>
      </div>
    </section>
  );
}

