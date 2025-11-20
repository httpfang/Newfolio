import { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ScrollFloat from "@/components/bits/ScrollFloat";
import { useScrollCardReveal } from "@/components/bits/useScrollCardReveal";

gsap.registerPlugin(ScrollTrigger);

interface GitHubProfile {
  login: string;
  avatar_url: string;
  html_url: string;
  bio: string | null;
  public_repos: number;
  followers: number;
  following: number;
  public_gists: number;
}

interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
}

export default function Projects() {
  const [githubData, setGithubData] = useState<GitHubProfile | null>(null);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);

  const sectionRef = useRef<HTMLElement | null>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const statsRef = useRef<(HTMLDivElement | null)[]>([]);

  const contributions = useMemo(
    () => Array.from({ length: 84 }, () => Math.random()),
    []
  );

  useEffect(() => {
    let isMounted = true;

    const fetchGithubData = async () => {
      try {
        const token = import.meta.env.VITE_GITHUB_TOKEN as string | undefined;
        const headers: Record<string, string> = token
          ? { Authorization: `Bearer ${token}` }
          : {};

        const [userRes, reposRes] = await Promise.all([
          fetch("https://api.github.com/users/httpfang", { headers }),
          fetch("https://api.github.com/users/httpfang/repos?sort=updated&per_page=6", {
            headers,
          }),
        ]);

        if (!userRes.ok || !reposRes.ok) {
          throw new Error("GitHub API request failed");
        }

        const userData: GitHubProfile = await userRes.json();
        const reposData: GitHubRepo[] = await reposRes.json();

        if (!isMounted) return;

        setGithubData(userData);
        setRepos(reposData);
      } catch (error) {
        console.error("Error fetching GitHub data:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchGithubData();

    return () => {
      isMounted = false;
    };
  }, []);

  const cardDirections = [
    { x: -40, y: 60, rotate: -6, scale: 0.9 },
    { x: 40, y: 60, rotate: 6, scale: 0.9 },
    { x: 30, y: 45, rotate: 3, scale: 0.92 },
    { x: -30, y: 45, rotate: -3, scale: 0.92 },
    { x: 20, y: 55, rotate: 4, scale: 0.9 },
    { x: -20, y: 55, rotate: -4, scale: 0.9 },
  ];

  useScrollCardReveal(cardsRef, {
    directions: repos.map((_, index) => cardDirections[index % cardDirections.length]),
    start: "top 90%",
    end: "top 60%",
    duration: 1.2,
    ease: "power3.out",
    contentSelector: ".repo-card-inner",
    enabled: !loading && repos.length > 0,
  });

  useEffect(() => {
    if (loading) return;

    const triggers: ScrollTrigger[] = [];
    const tweens: gsap.core.Tween[] = [];

    statsRef.current.forEach((stat, index) => {
      if (!stat) return;

      const tween = gsap.fromTo(
        stat,
        {
          opacity: 0,
          x: index % 2 === 0 ? -30 : 30,
        },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: "power2.out",
          delay: index * 0.1,
          scrollTrigger: {
            trigger: stat,
            start: "top 85%",
          },
        }
      );

      tweens.push(tween);
      if (tween.scrollTrigger) {
        triggers.push(tween.scrollTrigger);
      }
    });

    return () => {
      tweens.forEach((tween) => tween.kill());
      triggers.forEach((trigger) => trigger.kill());
    };
  }, [loading, repos.length]);

  const handleRepoClick = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  if (loading) {
    return (
      <section className="min-h-screen bg-[#F5F3EE] flex items-center justify-center">
        <div className="text-[#2D5016] text-2xl font-light animate-pulse">
          Loading projects...
        </div>
      </section>
    );
  }

  const stats = [
    { label: "Repos", value: githubData?.public_repos ?? 0, icon: "📦" },
    { label: "Followers", value: githubData?.followers ?? 0, icon: "👥" },
    { label: "Following", value: githubData?.following ?? 0, icon: "🔗" },
    { label: "Gists", value: githubData?.public_gists ?? 0, icon: "📝" },
  ];

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="mt-[70px] pt-12 pb-24 px-4 sm:px-6 lg:px-8 min-h-screen bg-[#F5F3EE] relative overflow-hidden"
    >
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#2D5016 1px, transparent 1px), linear-gradient(90deg, #2D5016 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="mb-16">
          <ScrollFloat
            animationDuration={1}
            ease="back.inOut(2)"
            scrollStart="center bottom+=50%"
            scrollEnd="bottom bottom-=40%"
            stagger={0.03}
            containerClassName="my-0"
            textClassName="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-serif text-[#2D5016] leading-[0.9] tracking-tighter"
          >
            PROJECTS
          </ScrollFloat>
          <div className="flex items-center gap-3 mt-4">
            <div className="h-px w-12 bg-[#2D5016] opacity-30"></div>
            <div className="text-[#2D5016] text-sm opacity-40 tracking-[0.3em]">
              GITHUB
            </div>
            <div className="flex-1 h-px bg-[#2D5016] opacity-30"></div>
          </div>
        </div>

        <div className="mb-20 relative">
          <div className="lg:flex lg:items-start lg:gap-12">
            <div className="relative mb-8 lg:mb-0 lg:sticky lg:top-24">
              <div
                className="relative group cursor-pointer"
                onClick={() =>
                  githubData && window.open(githubData.html_url, "_blank", "noopener,noreferrer")
                }
              >
                <div className="absolute -top-4 -left-4 w-12 h-12 border-l-2 border-t-2 border-[#2D5016]/30 rounded-tl-2xl group-hover:w-16 group-hover:h-16 transition-all duration-500"></div>
                <div className="absolute -bottom-4 -right-4 w-12 h-12 border-r-2 border-b-2 border-[#2D5016]/30 rounded-br-2xl group-hover:w-16 group-hover:h-16 transition-all duration-500"></div>

                <div className="relative w-48 h-48 mx-auto lg:mx-0">
                  <img
                    src={githubData?.avatar_url}
                    alt="GitHub Profile"
                    className="w-full h-full object-cover rounded-3xl shadow-[0_20px_60px_rgb(45,80,22,0.15)] group-hover:shadow-[0_25px_70px_rgb(45,80,22,0.25)] transition-all duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-[#2D5016] opacity-0 group-hover:opacity-10 rounded-3xl transition-opacity duration-500"></div>
                </div>

                <div className="absolute -bottom-3 -right-3 bg-[#2D5016] text-white px-4 py-2 rounded-full text-xs font-semibold shadow-lg group-hover:scale-110 transition-transform duration-300">
                  VIEW PROFILE
                </div>
              </div>
            </div>

            <div className="flex-1 space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                  <div
                    key={stat.label}
                    ref={(el) => {
                      statsRef.current[index] = el;
                    }}
                    className="group relative bg-white/40 backdrop-blur-sm p-6 rounded-2xl border border-[#2D5016]/10 hover:border-[#2D5016]/30 transition-all duration-500 hover:shadow-[0_10px_40px_rgb(45,80,22,0.1)] cursor-pointer"
                    style={{
                      transform: index % 2 === 0 ? "rotate(-1deg)" : "rotate(1deg)",
                    }}
                  >
                    <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">
                      {stat.icon}
                    </div>
                    <div className="text-3xl font-bold text-[#2D5016] mb-1">
                      {stat.value}
                    </div>
                    <div className="text-xs font-semibold text-[#2D5016]/60 tracking-wider uppercase">
                      {stat.label}
                    </div>
                    <div className="absolute bottom-0 left-0 h-1 w-0 bg-[#2D5016] group-hover:w-full transition-all duration-500 rounded-b-2xl"></div>
                  </div>
                ))}
              </div>

              {githubData?.bio && (
                <div className="mt-8 bg-white/30 backdrop-blur-sm p-6 rounded-2xl border border-[#2D5016]/10">
                  <p className="text-[#2D5016] text-lg font-light leading-relaxed">
                    {githubData.bio}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-3xl lg:text-4xl font-serif text-[#2D5016] mb-8 tracking-tight">
            Latest Repositories
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {repos.map((repo, index) => (
              <div
                key={repo.id}
                ref={(el) => {
                  cardsRef.current[index] = el;
                }}
                onClick={() => handleRepoClick(repo.html_url)}
                className="group relative bg-white/50 backdrop-blur-sm rounded-2xl overflow-hidden cursor-pointer border border-[#2D5016]/10 hover:border-[#2D5016]/30 transition-all duration-500"
                style={{ perspective: "1000px" }}
              >
                <div className="repo-card-inner relative p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-semibold text-[#2D5016] group-hover:text-[#3D6020] transition-colors line-clamp-1">
                      {repo.name}
                    </h3>
                    <span className="text-2xl opacity-50 group-hover:opacity-100 group-hover:rotate-12 transition-all duration-300">
                      📁
                    </span>
                  </div>

                  <p className="text-sm text-[#2D5016]/70 mb-4 line-clamp-2 min-h-[40px] font-light">
                    {repo.description || "No description available"}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-[#2D5016]/60">
                    {repo.language && (
                      <div className="flex items-center gap-1">
                        <span className="w-3 h-3 rounded-full bg-[#2D5016]"></span>
                        <span className="font-medium">{repo.language}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <span>⭐</span>
                      <span>{repo.stargazers_count}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>🔱</span>
                      <span>{repo.forks_count}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-[#2D5016]/10">
                    <span className="text-xs text-[#2D5016]/50">
                      Updated {new Date(repo.updated_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="absolute inset-0 bg-linear-to-br from-[#2D5016]/0 via-[#2D5016]/0 to-[#2D5016]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-y-0 translate-y-2">
                  <div className="bg-[#2D5016] text-white text-xs px-3 py-1 rounded-full shadow-lg group-active:scale-95 transition-transform">
                    VIEW →
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-20">
          <h2 className="text-3xl lg:text-4xl font-serif text-[#2D5016] mb-8 tracking-tight">
            Contribution Activity
          </h2>

          <div className="bg-white/40 backdrop-blur-sm rounded-3xl p-8 border border-[#2D5016]/10">
            <div className="grid grid-cols-12 gap-2">
              {contributions.map((intensity, index) => (
                <div
                  key={index}
                  className="aspect-square rounded-md transition-all duration-300 hover:scale-125 cursor-pointer group relative"
                  style={{
                    backgroundColor:
                      intensity > 0.7
                        ? "#2D5016"
                        : intensity > 0.4
                        ? "#4D7028"
                        : intensity > 0.2
                        ? "#7DA651"
                        : "#E8E6E1",
                    opacity: 0.8,
                  }}
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#2D5016] text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    {Math.floor(intensity * 10)} contributions
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-4 mt-6 text-xs text-[#2D5016]/60">
              <span>Less</span>
              <div className="flex gap-1">
                <div className="w-4 h-4 rounded-sm bg-[#E8E6E1]"></div>
                <div className="w-4 h-4 rounded-sm bg-[#7DA651]"></div>
                <div className="w-4 h-4 rounded-sm bg-[#4D7028]"></div>
                <div className="w-4 h-4 rounded-sm bg-[#2D5016]"></div>
              </div>
              <span>More</span>
            </div>
          </div>
        </div>

        <div className="mt-20 text-center">
          <button
            onClick={() =>
              githubData && window.open(githubData.html_url, "_blank", "noopener,noreferrer")
            }
            className="group relative inline-block"
          >
            <div className="absolute inset-0 bg-[#2D5016] rounded-full blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
            <div className="relative bg-[#2D5016] text-white px-12 py-5 rounded-full font-semibold text-lg shadow-[0_10px_40px_rgb(45,80,22,0.3)] group-hover:shadow-[0_15px_50px_rgb(45,80,22,0.4)] transition-all duration-500 group-active:scale-95 group-hover:scale-105 transform">
              <span className="flex items-center gap-3">
                View Full GitHub Profile
                <span className="group-hover:translate-x-1 transition-transform duration-300">
                  →
                </span>
              </span>
            </div>
          </button>
        </div>
      </div>
    </section>
  );
}

