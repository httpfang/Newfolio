import { useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface GitHubProfile {
  login: string;
  avatar_url: string;
  repos_url: string;
  name: string;
  bio: string;
  public_repos: number;
  followers: number;
}

interface GitHubRepo {
  id: number;
  name: string;
  description: string;
  html_url: string;
  language: string;
  stargazers_count: number;
  forks_count: number;
}

export default function PortfolioGitHub() {
  const [profile, setProfile] = useState<GitHubProfile | null>(null);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    gsap.from('.hero-title', {
      opacity: 0,
      y: 40,
      duration: 1,
      ease: 'power3.out',
      delay: 0.3
    });

    gsap.from('.profile-img', {
      opacity: 0,
      scale: 0.8,
      duration: 1,
      ease: 'back.out(1.7)',
      delay: 0.5
    });

    gsap.from('.bento-item', {
      opacity: 0,
      y: 30,
      stagger: 0.1,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.bento-grid',
        start: 'top 80%',
      }
    });
  }, []);

  useEffect(() => {
    async function load() {
      try {
        const token = import.meta.env.VITE_GITHUB_TOKEN as string | undefined;
        const headers: Record<string, string> = token 
          ? { Authorization: `Bearer ${token}` } 
          : {};
        
        const p = await fetch("https://api.github.com/users/httpfang", { 
          headers 
        }).then((r) => r.json());
        
        const r = await fetch(p.repos_url, { 
          headers 
        }).then((r) => r.json());
        
        setProfile(p);
        setRepos(r.sort((a: GitHubRepo, b: GitHubRepo) => 
          b.stargazers_count - a.stargazers_count
        ));
      } catch (error) {
        console.error("Failed to load GitHub data:", error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <section className="p-8 md:p-12">
      <div className="rounded-3xl overflow-hidden">


        {/* Bento Grid - Skills & Projects */}
        <div className="bento-grid p-8 md:p-12 space-y-4" id="work">
          {/* Skills Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bento-item bg-white p-8 rounded-2xl border-2 border-gray-200 hover:border-[#5865F2] transition-all">
              <div className="w-12 h-12 bg-[#5865F2]/10 rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">⚛️</span>
              </div>
              <h3 className="text-xl font-bold text-black mb-3">Frontend</h3>
              <div className="space-y-2">
                {["React", "Next.js", "TypeScript", "Tailwind CSS"].map((skill) => (
                  <span key={skill} className="inline-block mr-2 text-sm text-gray-600">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="bento-item bg-white p-8 rounded-2xl border-2 border-gray-200 hover:border-[#5865F2] transition-all">
              <div className="w-12 h-12 bg-[#5865F2]/10 rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-bold text-black mb-3">Backend</h3>
              <div className="space-y-2">
                {["Node.js", "Express", "PostgreSQL", "Drizzle"].map((skill) => (
                  <span key={skill} className="inline-block mr-2 text-sm text-gray-600">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="bento-item bg-white p-8 rounded-2xl border-2 border-gray-200 hover:border-[#5865F2] transition-all">
              <div className="w-12 h-12 bg-[#5865F2]/10 rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">🛠️</span>
              </div>
              <h3 className="text-xl font-bold text-black mb-3">Tools</h3>
              <div className="space-y-2">
                {["Git", "Docker", "Vercel", "GSAP"].map((skill) => (
                  <span key={skill} className="inline-block mr-2 text-sm text-gray-600">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* GitHub Stats Banner */}
          <div className="bento-item bg-[#5865F2] p-8 rounded-2xl text-white">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div>
                <h3 className="text-3xl font-bold mb-2">GitHub Portfolio</h3>
                <p className="text-white/80">Showcasing {profile?.public_repos} public repositories</p>
              </div>
              <div className="flex items-center gap-8 mt-4 md:mt-0">
                <div className="text-center">
                  <div className="text-4xl font-bold">{profile?.public_repos}</div>
                  <div className="text-sm text-white/80">Repositories</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold">{profile?.followers}</div>
                  <div className="text-sm text-white/80">Followers</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold">{repos.reduce((acc, r) => acc + r.stargazers_count, 0)}</div>
                  <div className="text-sm text-white/80">Total Stars</div>
                </div>
              </div>
            </div>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {repos.slice(0, 6).map((repo) => (
              <a
                key={repo.id}
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="bento-item bg-white p-6 rounded-2xl border-2 border-gray-200 hover:border-[#5865F2] transition-all group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-black group-hover:text-[#5865F2] transition-colors mb-2">
                      {repo.name}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {repo.description || "No description available"}
                    </p>
                  </div>
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-[#5865F2] transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                  </svg>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  {repo.language && (
                    <span className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-[#5865F2] rounded-full"></div>
                      {repo.language}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    ⭐ {repo.stargazers_count}
                  </span>
                  <span className="flex items-center gap-1">
                    🔄 {repo.forks_count}
                  </span>
                </div>
              </a>
            ))}
          </div>

          {/* About Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="about">
            <div className="bento-item bg-white p-8 rounded-2xl border-2 border-gray-200">
              <h3 className="text-2xl font-bold text-black mb-4">Building the Future</h3>
              <p className="text-gray-600 leading-relaxed">
                20-year-old full-stack developer from India, passionate about creating elegant solutions to complex problems. I love crafting beautiful, performant web applications with modern technologies.
              </p>
            </div>

            <div className="bento-item bg-white p-8 rounded-2xl border-2 border-gray-200">
              <h3 className="text-2xl font-bold text-black mb-4">Beyond Code</h3>
              <p className="text-gray-600 leading-relaxed">
                When I'm not coding, you'll find me at the gym, exploring new places, watching football, or diving into the latest tech trends and startup culture.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="px-8 py-6 border-t border-gray-200">
          <div className="text-center">
            <p className="text-sm text-gray-400">
              © 2024 Fang. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </section>
);
}

const LoadingSkeleton = () => (
  <div className="p-12 animate-pulse">
        <div className="h-12 bg-gray-300 rounded-lg w-48 mb-12"></div>
        <div className="grid grid-cols-2 gap-8 mb-12">
          <div>
            <div className="h-16 bg-gray-300 rounded-lg w-3/4 mb-4"></div>
            <div className="h-16 bg-gray-300 rounded-lg w-2/3"></div>
          </div>
          <div className="h-80 bg-gray-300 rounded-3xl"></div>
        </div>
        <div className="grid grid-cols-3 gap-4 mb-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-48 bg-gray-300 rounded-2xl"></div>
          ))}
        </div>
      </div>
  );