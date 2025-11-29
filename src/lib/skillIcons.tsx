import React from "react";
import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiTailwindcss,
  SiNodedotjs,
  SiExpress,
  SiMongodb,
  SiPostgresql,
  SiGit,
  SiGithub,
  SiVercel,
  SiPostman,
  SiFigma,
  SiDocker,
  SiJavascript,
  SiPython,
  SiHtml5,
  SiCss3,
  SiRedux,
  SiAmazon,
  SiStripe,
} from "react-icons/si";

// Map skill names to their icon components
export const skillIconMap: Record<string, React.ReactNode> = {
  // Frontend
  'React.js': <SiReact />,
  'React': <SiReact />,
  'Next.js': <SiNextdotjs />,
  'TypeScript': <SiTypescript />,
  'JavaScript': <SiJavascript />,
  'HTML': <SiHtml5 />,
  'CSS': <SiCss3 />,
  'Tailwind CSS': <SiTailwindcss />,
  'TailwindCSS': <SiTailwindcss />,
  'Redux': <SiRedux />,
  'GSAP': <img src="https://gsap.com/community/uploads/monthly_2020_03/tweenmax.png.cf27916e926fbb328ff214f66b4c8429.png" alt="GSAP" className="h-[48px] w-auto object-contain" />,
  'Framer Motion': (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 140" className="h-[48px] w-auto">
      <path d="M 44.65 33.992 L 95.35 33.992 L 95.35 59.341 L 70 59.341 Z M 44.65 59.341 L 70 59.341 L 95.35 84.691 L 44.65 84.691 Z M 44.65 84.691 L 70 84.691 L 70 110.041 Z" fill="rgb(0, 0, 0)"></path>
    </svg>
  ),
  // Backend
  'Node.js': <SiNodedotjs />,
  'Express.js': <SiExpress />,
  'Express': <SiExpress />,
  'Python': <SiPython />,
  // Tools
  'Git': <SiGit />,
  'GitHub': <SiGithub />,
  'Docker': <SiDocker />,
  'Postman': <SiPostman />,
  'MongoDB': <SiMongodb />,
  'PostgreSQL': <SiPostgresql />,
  'Drizzle ORM': <img src="https://pbs.twimg.com/media/F7V2rLQWUAAgaLh.jpg" alt="Drizzle ORM" className="h-[48px] w-auto object-contain" />,
  'AWS': <SiAmazon />,
  'Stripe': <SiStripe />,
  'Clerk': <img src="https://assets.streamlinehq.com/image/private/w_300,h_300,ar_1/f_auto/v1/icons/logos/clerk-uvna1mxd54k50cohb8o2i.png/clerk-nzr7956knokwjx841f6yye.png?_a=DATAg1AAZAA0" alt="Clerk" className="h-[48px] w-auto object-contain" />,
  'Vercel': <SiVercel />,
  'Figma': <SiFigma />,
};

// List of skills that use image-based icons (including SVGs)
export const imageBasedSkills = ['GSAP', 'Framer Motion', 'Drizzle ORM', 'Clerk'];

// Helper function to get icon for a skill
export const getSkillIcon = (skillName: string): React.ReactNode => {
  return skillIconMap[skillName] || <span className="font-bold text-[#1a1a1a]">{skillName}</span>;
};

// Helper function to get icon for LogoLoop (with different color scheme)
export const getSkillIconForLoop = (skillName: string): React.ReactNode => {
  const icon = skillIconMap[skillName];
  if (icon) {
    return icon;
  }
  return <span className="font-bold text-[#2D5016]">{skillName}</span>;
};

