import { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ScrollFloat from "@/bits/ScrollFloat";
import { useScrollCardReveal } from "@/bits/useScrollCardReveal";
import Skills from "../Skill/Skills";

gsap.registerPlugin(ScrollTrigger);

const GITHUB_USERNAME = "harsHdokyc";
const CURRENT_YEAR = new Date().getFullYear();
const DEFAULT_YEAR_OPTIONS = Array.from({ length: 5 }, (_, index) => CURRENT_YEAR - index);

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

interface ContributionDay {
  date: string;
  count: number;
}

const CONTRIBUTIONS_QUERY = `
  query ($login: String!, $from: DateTime!, $to: DateTime!) {
    user(login: $login) {
      contributionsCollection(from: $from, to: $to) {
        contributionYears
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
            }
          }
        }
      }
    }
  }
`;

export default function Projects() {
  const [githubData, setGithubData] = useState<GitHubProfile | null>(null);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [profileLoading, setProfileLoading] = useState(true);
  const [availableYears, setAvailableYears] = useState<number[]>(DEFAULT_YEAR_OPTIONS);
  const [selectedYear, setSelectedYear] = useState<number>(DEFAULT_YEAR_OPTIONS[0]);
  const [contributions, setContributions] = useState<ContributionDay[]>([]);
  const [contributionsLoading, setContributionsLoading] = useState(true);
  const [contributionError, setContributionError] = useState<string | null>(null);
  const [contributionTotal, setContributionTotal] = useState(0);

  const sectionRef = useRef<HTMLElement | null>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const statsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    let isMounted = true;

    const fetchGithubData = async () => {
      try {
        const token = import.meta.env.VITE_GITHUB_TOKEN as string | undefined;
        const restHeaders: Record<string, string> = token
          ? { Authorization: `Bearer ${token}` } 
          : {};
        
        const [userRes, reposRes] = await Promise.all([
          fetch(`https://api.github.com/users/${GITHUB_USERNAME}`, { headers: restHeaders }),
          fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=6`, {
            headers: restHeaders,
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
          setProfileLoading(false);
      }
    }
    };

    fetchGithubData();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchContributions = async () => {
      const token = import.meta.env.VITE_GITHUB_TOKEN as string | undefined;
      
      if (!token || token.trim() === "") {
        if (isMounted) {
          setContributions([]);
          setContributionTotal(0);
          setContributionError(
            "Add VITE_GITHUB_TOKEN to .env.local and restart the dev server."
          );
          setContributionsLoading(false);
        }
        return;
      }

      setContributionsLoading(true);
      setContributionError(null);

      const from = new Date(Date.UTC(selectedYear, 0, 1)).toISOString();
      const to = new Date(Date.UTC(selectedYear, 11, 31, 23, 59, 59)).toISOString();

      try {
        const response = await fetch("https://api.github.com/graphql", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: CONTRIBUTIONS_QUERY,
            variables: { login: GITHUB_USERNAME, from, to },
          }),
        });

        const json = await response.json();

        if (!response.ok) {
          const errorMsg = json.message || `HTTP ${response.status}: ${response.statusText}`;
          console.error("GitHub API Error:", errorMsg);
          throw new Error(errorMsg);
        }

        if (json.errors) {
          const errorMsg = json.errors[0]?.message || "GraphQL query error";
          console.error("GraphQL Error:", errorMsg);
          throw new Error(errorMsg);
        }

        if (!json.data?.user) {
          console.error("User not found:", GITHUB_USERNAME);
          throw new Error(`User "${GITHUB_USERNAME}" not found`);
        }

        const collection = json.data.user.contributionsCollection;
        if (!collection) {
          throw new Error("No contribution data available");
        }

        const calendar = collection.contributionCalendar;
        const weeks = calendar?.weeks ?? [];
        const totalFromCalendar = calendar?.totalContributions;

        const contributionDays: ContributionDay[] = weeks.flatMap(
          (week: { contributionDays: { date: string; contributionCount: number }[] }) =>
            week.contributionDays.map((day) => ({
              date: day.date,
              count: day.contributionCount,
            }))
        );

        const calculatedTotal = contributionDays.reduce((acc, day) => acc + day.count, 0);

        if (!isMounted) return;

        const contributionYears: number[] = collection.contributionYears ?? [];
        if (contributionYears.length) {
          const sortedYears = Array.from(new Set(contributionYears)).sort((a, b) => b - a);
          setAvailableYears(sortedYears);
        }

        setContributions(contributionDays);
        setContributionTotal(totalFromCalendar ?? calculatedTotal);
        setContributionError(null);
      } catch (error) {
        console.error("Error fetching contribution data:", error);
        if (isMounted) {
          setContributions([]);
          setContributionTotal(0);
          const errorMessage = error instanceof Error ? error.message : "Unknown error";
          setContributionError(
            errorMessage.includes("401") || errorMessage.includes("Bad credentials")
              ? "Invalid GitHub token. Please check your VITE_GITHUB_TOKEN."
              : errorMessage.includes("403") || errorMessage.includes("rate limit")
              ? "Rate limit exceeded. Please try again later."
              : errorMessage.includes("not found")
              ? `User "${GITHUB_USERNAME}" not found.`
              : `Unable to load contributions: ${errorMessage}`
          );
        }
      } finally {
        if (isMounted) {
          setContributionsLoading(false);
        }
      }
    };

    fetchContributions();

    return () => {
      isMounted = false;
    };
  }, [selectedYear]);

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
    enabled: !profileLoading && repos.length > 0,
  });

  useEffect(() => {
    if (profileLoading) return;

    const triggers: ScrollTrigger[] = [];
    const tweens: gsap.core.Tween[] = [];

    // Small delay to ensure ScrollTrigger is ready after loader
    const timeoutId = setTimeout(() => {
      statsRef.current.forEach((stat, index) => {
        if (!stat) return;

        // Check if element is already in viewport
        const rect = stat.getBoundingClientRect();
        const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;

        // If already in viewport, make it visible immediately
        if (isInViewport) {
          gsap.set(stat, {
            opacity: 1,
            x: 0,
          });
        }

        const tween = gsap.fromTo(
          stat,
          {
            opacity: isInViewport ? 1 : 0,
            x: isInViewport ? 0 : (index % 2 === 0 ? -30 : 30),
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
              immediateRender: isInViewport,
            },
          }
        );

        tweens.push(tween);
        if (tween.scrollTrigger) {
          triggers.push(tween.scrollTrigger);
        }
      });
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      tweens.forEach((tween) => tween.kill());
      triggers.forEach((trigger) => trigger.kill());
    };
  }, [profileLoading, repos.length]);

  const handleRepoClick = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const stats = [
    { label: "Repos", value: githubData?.public_repos ?? 0, icon: "📦" },
    { label: "Followers", value: githubData?.followers ?? 0, icon: "👥" },
    { label: "Following", value: githubData?.following ?? 0, icon: "🔗" },
  ];

  const totalStars = useMemo(() => {
    return repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
  }, [repos]);

  const displayedContributions = useMemo<ContributionDay[]>(() => {
    if (contributions.length === 0) {
      return Array.from({ length: 84 }, (_, index) => ({
        date: `placeholder-${index}`,
        count: 0,
      }));
    }
    return contributions.slice(-84);
  }, [contributions]);

  const maxContribution = useMemo(
    () =>
      displayedContributions.reduce((max, day) => Math.max(max, day.count), 0) || 1,
    [displayedContributions]
  );

  const getContributionColor = (count: number) => {
    const ratio = maxContribution ? count / maxContribution : 0;
    if (ratio > 0.75) return "#2D5016";
    if (ratio > 0.5) return "#4D7028";
    if (ratio > 0.25) return "#7DA651";
    if (ratio > 0) return "#A9C987";
    return "#E8E6E1";
  };

  const formatDate = (dateString: string): string => {
    if (dateString.startsWith("placeholder")) return "";
    try {
      const date = new Date(dateString);
      const day = date.getDate();
      const month = date.getMonth() + 1; // getMonth() returns 0-11
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    } catch {
      return dateString;
    }
  };

  if (profileLoading) {
    return (
      <section className="min-h-screen bg-[#F5F3EE] flex items-center justify-center">
        <div className="text-[#2D5016] text-2xl font-light animate-pulse">
          Loading projects...
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="pt-12 pb-24 px-4 sm:px-6 lg:px-8 min-h-screen bg-[#F5F3EE] relative overflow-hidden scroll-mt-[70px]"
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
          <div className="lg:flex lg:items-start lg:gap-16">
            <div className="relative mb-8 lg:mb-0 lg:sticky lg:top-24 shrink-0">
              <div
                className="relative group cursor-pointer"
                onClick={() =>
                  githubData && window.open(githubData.html_url, "_blank", "noopener,noreferrer")
                }
              >
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

            <div className="flex-1">
              {/* Modern Stats Bar */}
              <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-8 border border-[#2D5016]/10 mb-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                  {stats.map((stat, index) => (
                    <div
                      key={stat.label}
                      ref={(el) => {
                        statsRef.current[index] = el;
                      }}
                      className="group text-center lg:text-left"
                    >
                      <div className="flex items-center justify-center lg:justify-start gap-2 mb-2">
                        <span className="text-2xl group-hover:scale-110 transition-transform duration-300">
                          {stat.icon}
                        </span>
                        <span className="text-4xl lg:text-5xl font-black text-[#2D5016] tracking-tight">
                          {stat.value}
                  </span>
              </div>
                      <div className="text-xs font-bold text-[#2D5016]/50 tracking-[0.2em] uppercase">
                        {stat.label}
            </div>
          </div>
                  ))}
                  {/* Star on GitHub Button */}
                  <div className="col-span-2 lg:col-span-1 flex items-center justify-center lg:justify-start">
                    <a
                      href={githubData?.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex overflow-hidden items-center text-sm font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-black text-white shadow hover:bg-black/90 h-9 px-4 py-2 max-w-52 whitespace-pre md:flex group relative w-full justify-center gap-2 rounded-md transition-all duration-300 ease-out hover:ring-2 hover:ring-black hover:ring-offset-2"
                    >
                      <span className="absolute right-0 -mt-12 h-32 w-8 translate-x-12 rotate-12 bg-white opacity-10 transition-all duration-1000 ease-out group-hover:-translate-x-40" />
                      <div className="flex items-center">
                        <svg
                          className="w-4 h-4 fill-current"
                          viewBox="0 0 438.549 438.549"
                        >
                          <path d="M409.132 114.573c-19.608-33.596-46.205-60.194-79.798-79.8-33.598-19.607-70.277-29.408-110.063-29.408-39.781 0-76.472 9.804-110.063 29.408-33.596 19.605-60.192 46.204-79.8 79.8C9.803 148.168 0 184.854 0 224.63c0 47.78 13.94 90.745 41.827 128.906 27.884 38.164 63.906 64.572 108.063 79.227 5.14.954 8.945.283 11.419-1.996 2.475-2.282 3.711-5.14 3.711-8.562 0-.571-.049-5.708-.144-15.417a2549.81 2549.81 0 01-.144-25.406l-6.567 1.136c-4.187.767-9.469 1.092-15.846 1-6.374-.089-12.991-.757-19.842-1.999-6.854-1.231-13.229-4.086-19.13-8.559-5.898-4.473-10.085-10.328-12.56-17.556l-2.855-6.57c-1.903-4.374-4.899-9.233-8.992-14.559-4.093-5.331-8.232-8.945-12.419-10.848l-1.999-1.431c-1.332-.951-2.568-2.098-3.711-3.429-1.142-1.331-1.997-2.663-2.568-3.997-.572-1.335-.098-2.43 1.427-3.289 1.525-.859 4.281-1.276 8.28-1.276l5.708.853c3.807.763 8.516 3.042 14.133 6.851 5.614 3.806 10.229 8.754 13.846 14.842 4.38 7.806 9.657 13.754 15.846 17.847 6.184 4.093 12.419 6.136 18.699 6.136 6.28 0 11.704-.476 16.274-1.423 4.565-.952 8.848-2.383 12.847-4.285 1.713-12.758 6.377-22.559 13.988-29.41-10.848-1.14-20.601-2.857-29.264-5.14-8.658-2.286-17.605-5.996-26.835-11.14-9.235-5.137-16.896-11.516-22.985-19.126-6.09-7.614-11.088-17.61-14.987-29.979-3.901-12.374-5.852-26.648-5.852-42.826 0-23.035 7.52-42.637 22.557-58.817-7.044-17.318-6.379-36.732 1.997-58.24 5.52-1.715 13.706-.428 24.554 3.853 10.85 4.283 18.794 7.952 23.84 10.994 5.046 3.041 9.089 5.618 12.135 7.708 17.705-4.947 35.976-7.421 54.818-7.421s37.117 2.474 54.823 7.421l10.849-6.849c7.419-4.57 16.18-8.758 26.262-12.565 10.088-3.805 17.802-4.853 23.134-3.138 8.562 21.509 9.325 40.922 2.279 58.24 15.036 16.18 22.559 35.787 22.559 58.817 0 16.178-1.958 30.497-5.853 42.966-3.9 12.471-8.941 22.457-15.125 29.979-6.191 7.521-13.901 13.85-23.131 18.986-9.232 5.14-18.182 8.85-26.84 11.136-8.662 2.286-18.415 4.004-29.263 5.146 9.894 8.562 14.842 22.077 14.842 40.539v60.237c0 3.422 1.19 6.279 3.572 8.562 2.379 2.279 6.136 2.95 11.276 1.995 44.163-14.653 80.185-41.062 108.068-79.226 27.88-38.161 41.825-81.126 41.825-128.906-.01-39.771-9.818-76.454-29.414-110.049z" />
                        </svg>
                        <span className="ml-1 text-white">Star on GitHub</span>
              </div>
                      <div className="ml-2 flex items-center gap-1 text-sm md:flex">
                        <svg
                          className="w-4 h-4 text-gray-500 transition-all duration-300 group-hover:text-yellow-300"
                          data-slot="icon"
                          aria-hidden="true"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            clipRule="evenodd"
                            d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                            fillRule="evenodd"
                          />
                        </svg>
                        <span className="inline-block tabular-nums tracking-wider font-display font-medium text-white">
                          {totalStars}
                        </span>
                </div>
                    </a>
                </div>
                </div>
              </div>

              {/* Bio Section */}
              {githubData?.bio && (
                <div className="bg-white/30 backdrop-blur-sm rounded-2xl p-6 border border-[#2D5016]/10">
                  <p className="text-[#2D5016] text-base font-light leading-relaxed">
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {repos.map((repo, index) => (
              <div
                key={repo.id}
                ref={(el) => {
                  cardsRef.current[index] = el;
                }}
                className="repo-card-inner font-mono translate-x-[-6px] translate-y-[-6px] bg-[#ff66a3] border-[3px] border-black shadow-[12px_12px_0_#000000] overflow-hidden transition-all duration-300 hover:translate-x-[-6px] hover:translate-y-0"
              >
                <div className="w-full h-8 bg-white border-b-[3px] border-black flex items-center px-3">
                  <h3 className="text-sm font-black text-black line-clamp-1">
                      {repo.name}
                    </h3>
                </div>
                <div className="p-3 text-sm font-semibold text-black">
                  <p className="mb-3 line-clamp-2 min-h-[40px]">
                      {repo.description || "No description available"}
                    </p>

                  <div className="flex items-center gap-3 text-xs mb-3">
                    {repo.language && (
                      <div className="flex items-center gap-1">
                        <span className="w-2 h-2 bg-black"></span>
                        <span className="font-bold">{repo.language}</span>
                      </div>
                    )}
                    <span className="font-bold">⭐ {repo.stargazers_count}</span>
                    <span className="font-bold">🔱 {repo.forks_count}</span>
                  </div>

                  <div className="mb-3 pt-3 border-t-2 border-black">
                    <span className="text-xs font-bold">
                      Updated {new Date(repo.updated_at).toLocaleDateString()}
                    </span>
                  </div>

                  <button
                    onClick={() => handleRepoClick(repo.html_url)}
                    className="px-3 py-2 border-[3px] border-black shadow-[3px_3px_0_#000000] font-bold bg-[#4ade80] transition-all duration-300 cursor-pointer hover:translate-x-[1.5px] hover:translate-y-[1.5px] hover:shadow-[1.5px_1.5px_0_#000000] hover:bg-[#1ac2ff] active:translate-x-[3px] active:translate-y-[3px] active:shadow-[0_0_0_#000000]"
                  >
                    VIEW REPO
                  </button>
                </div>
              </div>
            ))}
          </div>
          </div>

        <div className="mt-20">
          <h2 className="text-3xl lg:text-4xl font-serif text-[#2D5016] mb-8 tracking-tight">
            Contribution Activity
          </h2>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
            <div className="text-sm text-[#2D5016]/80">
              Total contributions in {selectedYear}:{" "}
              <span className="font-semibold text-[#2D5016]">
                {contributionsLoading ? "…" : contributionTotal.toLocaleString()}
              </span>
            </div>
            <label className="text-sm text-[#2D5016]/70 flex items-center gap-2">
              Year
              <select
                value={selectedYear}
                onChange={(event) => setSelectedYear(Number(event.target.value))}
                className="border border-[#2D5016]/20 rounded-lg bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D5016]/40"
              >
                {availableYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="bg-white/40 backdrop-blur-sm rounded-3xl p-8 border border-[#2D5016]/10">
            {contributionError ? (
              <div className="text-center text-sm text-[#2D5016]/70 py-6">{contributionError}</div>
            ) : contributionsLoading ? (
              <div className="text-center text-sm text-[#2D5016]/70 py-6">
                Fetching contribution data…
              </div>
            ) : (
              <div className="grid grid-cols-12 gap-2">
                {displayedContributions.map((day, index) => (
                  <div
                    key={`${day.date}-${index}`}
                    className="aspect-square rounded-md transition-all duration-300 hover:scale-125 cursor-pointer group relative"
                    style={{
                      backgroundColor: getContributionColor(day.count),
                      opacity: 0.9,
                    }}
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#2D5016] text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                      {day.count} contribution{day.count === 1 ? "" : "s"}
                      {formatDate(day.date) ? ` on ${formatDate(day.date)}` : ""}
                    </div>
                  </div>
                ))}
              </div>
            )}

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

        <p className="mt-10 text-center text-sm italic text-[#2D5016]/70">
          ps: my og repo ammmmmmm, i dont have access any more 😭
        </p>

        <Skills />

      </div>
    </section>
);
}

