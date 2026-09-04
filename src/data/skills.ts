import type { SkillDef, SkillId } from "@/lib/types";

/**
 * Global skill catalog (mock data).
 *
 * In the full product this list would come from a skill taxonomy service.
 * Keep adding skills here to make new roles/assessments possible.
 */

export const SKILLS: SkillDef[] = [
  {
    id: "html",
    name: "HTML",
    category: "Web foundations",
    description: "Semantic structure and content markup for the web.",
  },
  {
    id: "css",
    name: "CSS",
    category: "Web foundations",
    description: "Styling, layout and visual presentation on the web.",
  },
  {
    id: "javascript",
    name: "JavaScript",
    category: "Programming",
    description: "The language of the browser — values, functions, DOM, async.",
  },
  {
    id: "git",
    name: "Git & GitHub",
    category: "Tools",
    description: "Version control, branches, commits and collaboration.",
  },
  {
    id: "responsive-design",
    name: "Responsive Design",
    category: "Frontend",
    description: "Layouts that adapt fluidly across screens and devices.",
  },
  {
    id: "react",
    name: "React",
    category: "Frontend",
    description: "Component-based UI development with props, state and hooks.",
  },
  {
    id: "rest-api",
    name: "REST APIs",
    category: "Backend & APIs",
    description: "Designing and consuming HTTP APIs with JSON.",
  },
  {
    id: "state-management",
    name: "State Management",
    category: "Frontend",
    description: "Organizing and sharing state across a frontend app.",
  },
  {
    id: "sql",
    name: "SQL",
    category: "Data",
    description: "Querying and shaping relational data.",
  },
  {
    id: "data-modeling",
    name: "Data Modeling",
    category: "Backend & APIs",
    description: "Designing database schemas and relationships.",
  },
  {
    id: "auth-security",
    name: "Auth & Security",
    category: "Backend & APIs",
    description: "Authentication, authorization and protecting user data.",
  },
  {
    id: "python",
    name: "Python",
    category: "Programming",
    description: "Readable general-purpose programming for scripts and data.",
  },
  {
    id: "statistics",
    name: "Statistics",
    category: "Data",
    description: "Describing data and reasoning with probability.",
  },
  {
    id: "data-viz",
    name: "Data Visualization",
    category: "Data",
    description: "Turning numbers into clear charts and dashboards.",
  },
  {
    id: "data-cleaning",
    name: "Data Cleaning & Wrangling",
    category: "Data",
    description: "Preparing messy, raw data for analysis.",
  },
  {
    id: "machine-learning",
    name: "Machine Learning",
    category: "Data",
    description: "Core ML concepts: models, features, training and evaluation.",
  },
  {
    id: "ux-research",
    name: "UX Research",
    category: "Design",
    description: "Understanding users through interviews, testing and data.",
  },
  {
    id: "visual-design",
    name: "Visual Design",
    category: "Design",
    description: "Hierarchy, typography, color and layout craft.",
  },
  {
    id: "prototyping",
    name: "Prototyping & Tools",
    category: "Design",
    description: "Turning ideas into testable flows and wireframes.",
  },
  {
    id: "accessibility",
    name: "Accessibility",
    category: "Design",
    description: "Designing and building for all users, including assistive tech.",
  },
  {
    id: "networking",
    name: "Networking",
    category: "Security",
    description: "IP, DNS, TCP and how traffic moves across networks.",
  },
  {
    id: "linux",
    name: "Linux & CLI",
    category: "Security",
    description: "Working confidently in a terminal environment.",
  },
  {
    id: "web-security",
    name: "Web Security",
    category: "Security",
    description: "Attacks like XSS/SQLi and how to defend against them.",
  },
  {
    id: "security-basics",
    name: "Security Fundamentals",
    category: "Security",
    description: "Threats, risk thinking, and core security hygiene.",
  },
];

const catalog = Object.fromEntries(SKILLS.map((s) => [s.id, s])) as Record<
  SkillId,
  SkillDef
>;

export function getSkill(id: SkillId): SkillDef {
  const skill = catalog[id];
  if (!skill) throw new Error(`Unknown skill id: ${id}`);
  return skill;
}

export function skillName(id: SkillId): string {
  return getSkill(id).name;
}
