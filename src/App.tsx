import { useState, useEffect } from 'react';
import { Loader } from '@/layout';
import {
  Hero,
  About,
  Projects,
  ExperienceSection,
  Contact,
} from '@/sections';
import { useLenis } from '@/hooks/useLenis';

function App() {
  const [loaderComplete, setLoaderComplete] = useState(false);

  // Initialize Lenis after loader completes
  useLenis(
    {
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      orientation: 'vertical',
      gestureOrientation: 'vertical',
    },
    loaderComplete
  );

  useEffect(() => {
    // Listen for loader completion event
    const handleLoaderComplete = () => {
      setLoaderComplete(true);
    };

    window.addEventListener('loaderComplete', handleLoaderComplete);

    // Fallback: enable Lenis after max loader time (6 seconds)
    const fallbackTimer = setTimeout(() => {
      setLoaderComplete(true);
    }, 6000);

    return () => {
      window.removeEventListener('loaderComplete', handleLoaderComplete);
      clearTimeout(fallbackTimer);
    };
  }, []);

  return (
    <>
      <Loader />
      <div className="min-h-screen bg-[#5865F2] p-6 md:p-8">
        <div className="w-full min-h-[calc(100vh-3rem)] md:min-h=[calc(100vh-4rem)] bg-[#F5F5F5] rounded-3xl shadow-2xl overflow-hidden border-4 border-[#5865F2]">
          <main>
            <Hero />
            <About />
            <Projects />
            <ExperienceSection />
            <Contact />
          </main>
        </div>
      </div>
    </>
  );
}

export default App;
