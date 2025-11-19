import { Header, Footer } from '@/layout';
import {
  Hero,
  About,
  Projects,
  Skills,
  ExperienceSection,
  Contact,
} from '@/sections';

function App() {
  return (
    <div className="min-h-screen bg-[#5865F2] p-6 md:p-8">
      <div className="w-full min-h-[calc(100vh-3rem)] md:min-h=[calc(100vh-4rem)] bg-[#F5F5F5] rounded-3xl shadow-2xl overflow-hidden border-4 border-[#5865F2]">
        <Header />
        <main>
          <Hero />
          <About />
          <Projects />
          <Skills />
          <ExperienceSection />
          <Contact />
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default App;
