import type { Project, Skill, Experience } from '@/types/types';

// Navigation items
export const NAV_ITEMS = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Skills', href: '#skills' },
  { label: 'Experience', href: '#experience' },
  { label: 'Contact', href: '#contact' },
] as const;

// Personal info
export const PERSONAL_INFO = {
  name: 'Harshaas Verma',
  title: 'Full Stack Developer',
  email: 'harshbuildweb@gmail.com',
  phone: '+917742054087',
  location: 'India',
  bio: 'Proactive and results-driven Full Stack Developer with hands-on experience in designing and developing scalable, secure, and high-performance web applications using the MERN stack. Strong in API development, UI/UX optimization, and cloud integration.',
} as const;

// Work experience
export const EXPERIENCES: Experience[] = [
  {
    id: '1',
    title: 'Full Stack Developer',
    company: '1StopKyc',
    location: 'Mumbai, India',
    startDate: '2025-01',
    endDate: 'Present',
    description: [
      'Built a modular web portal using React and TypeScript from scratch, increasing maintainability by 35%',
      'Implemented secure role-based authentication and authorization, reducing unauthorized access incidents',
      'Partnered with cross-functional teams to deliver production-ready features within 2-week sprint cycles',
      'Designed and integrated RESTful APIs, boosting system efficiency and front-end data handling by 25%',
    ],
    technologies: ['React', 'TypeScript', 'RESTful APIs', 'Authentication', 'Authorization'],
  },
  {
    id: '2',
    title: 'Frontend Developer',
    company: 'Skepsi',
    location: 'Chennai, India',
    startDate: '2024-02',
    endDate: '2024-05',
    description: [
      'Developed reusable and responsive UI components, decreasing front-end development time by 20%',
      'Conducted performance audits and usability tests, improving website load speed by 30%',
      'Enhanced conversion rates by 30% through performance tuning and UX enhancements',
      'Integrated modern frontend libraries and tools to streamline codebase and accelerate release cycles',
    ],
    technologies: ['React', 'UI/UX', 'Performance Optimization', 'Frontend Libraries'],
  },
];

// Projects
export const PROJECTS: Project[] = [
  {
    id: '1',
    title: 'SocialMyze AI',
    description: 'AI-Powered Social Media Content Generation Platform. Built an AI-based content generation app using Next.js, TypeScript, and Google Generative AI. Reduced content creation time by 40% through automation across Twitter, Instagram, and LinkedIn. Integrated Clerk for auth, Drizzle ORM for DB handling, and Stripe for seamless payments. Achieved 30% increase in user retention via tailored content workflows and optimized UI/UX.',
    technologies: [
      'Next.js',
      'TypeScript',
      'Google Generative AI',
      'Clerk',
      'Drizzle ORM',
      'Stripe',
      'Tailwind CSS',
    ],
    featured: true,
    liveUrl: '', // Add your project link here
    githubUrl: '', // Add your GitHub link here
  },
  {
    id: '2',
    title: 'TalkIn',
    description: 'Real-Time Communication Web Application. Engineered a real-time group chat platform using MERN Stack. Integrated Stream for low-latency messaging and calling, supporting up to 100 concurrent users. Implemented admin tools for group control (add/remove users, initiate calls), enhancing app governance. Deployed a fully responsive UI using Tailwind CSS, ensuring optimal mobile and desktop experience.',
    technologies: [
      'MongoDB',
      'Express.js',
      'React',
      'Node.js',
      'Stream',
      'Tailwind CSS',
      'WebSocket',
    ],
    featured: true,
    liveUrl: '', // Add your project link here
    githubUrl: '', // Add your GitHub link here
  },
];

// Skills
export const SKILLS: Skill[] = [
  // Languages
  { name: 'JavaScript', category: 'frontend', level: 'advanced' },
  { name: 'TypeScript', category: 'frontend', level: 'advanced' },
  { name: 'Python', category: 'backend', level: 'intermediate' },
  { name: 'HTML', category: 'frontend', level: 'advanced' },
  { name: 'CSS', category: 'frontend', level: 'advanced' },
  // Frontend Frameworks/Libraries
  { name: 'React.js', category: 'frontend', level: 'advanced' },
  { name: 'Next.js', category: 'frontend', level: 'advanced' },
  { name: 'Redux', category: 'frontend', level: 'intermediate' },
  { name: 'Tailwind CSS', category: 'frontend', level: 'advanced' },
  { name: 'GSAP', category: 'frontend', level: 'intermediate' },
  { name: 'Framer Motion', category: 'frontend', level: 'intermediate' },
  // Backend
  { name: 'Node.js', category: 'backend', level: 'advanced' },
  { name: 'Express.js', category: 'backend', level: 'advanced' },
  // Tools & Platforms
  { name: 'Git', category: 'tool', level: 'advanced' },
  { name: 'Docker', category: 'tool', level: 'intermediate' },
  { name: 'Postman', category: 'tool', level: 'advanced' },
  { name: 'MongoDB', category: 'tool', level: 'advanced' },
  { name: 'Drizzle ORM', category: 'tool', level: 'intermediate' },
  { name: 'AWS', category: 'tool', level: 'intermediate' },
  { name: 'Stripe', category: 'tool', level: 'intermediate' },
  { name: 'Clerk', category: 'tool', level: 'intermediate' },
];



