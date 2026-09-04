import type { CareerRole, RoleId, RoleSkill } from "@/lib/types";

/**
 * Career role definitions (mock data).
 *
 * Each role carries the *skills required for the job* and how important each
 * one is. The assessment, gap analysis, and learning plan all derive from
 * these maps — add a new role here and the whole journey works.
 *
 * Later this module is replaced by a role/taxonomy API.
 */

export const ROLES: CareerRole[] = [
  {
    id: "frontend-developer",
    name: "Frontend Developer",
    tagline: "Build what people see — with HTML, CSS and JavaScript.",
    description:
      "Frontend developers turn designs into fast, accessible interfaces users interact with every day — from a landing page to a full web app.",
    accent: "#6366f1",
    roleSkills: [
      { skillId: "html", group: "core", importance: 5, note: "Semantic, accessible structure is the foundation of every page you ship." },
      { skillId: "css", group: "core", importance: 5, note: "Layout, styling and responsive behavior that match the design." },
      { skillId: "javascript", group: "core", importance: 5, note: "Interactivity, data handling and the language of the browser." },
      { skillId: "git", group: "core", importance: 4, note: "Version control is expected on day one of any frontend team." },
      { skillId: "responsive-design", group: "core", importance: 4, note: "Interfaces must work from a phone to an ultrawide monitor." },
      { skillId: "react", group: "advanced", importance: 5, note: "The most-requested framework skill in frontend job postings." },
      { skillId: "rest-api", group: "advanced", importance: 4, note: "Fetching and wiring real data into components." },
      { skillId: "state-management", group: "advanced", importance: 3, note: "Keeping shared UI state predictable as apps grow." },
    ],
  },
  {
    id: "backend-developer",
    name: "Backend Developer",
    tagline: "Build the servers, APIs and databases products run on.",
    description:
      "Backend developers design the APIs, business logic and data layer that power web and mobile apps — reliably and securely.",
    accent: "#0ea5e9",
    roleSkills: [
      { skillId: "javascript", group: "core", importance: 5, note: "Node.js is a primary language for backend services." },
      { skillId: "rest-api", group: "core", importance: 5, note: "Designing clean HTTP APIs is the core of the job." },
      { skillId: "sql", group: "core", importance: 5, note: "Storing and querying relational data correctly." },
      { skillId: "git", group: "core", importance: 4, note: "Collaborating on shared codebases safely." },
      { skillId: "data-modeling", group: "advanced", importance: 4, note: "Schemas and relationships that scale with the product." },
      { skillId: "auth-security", group: "advanced", importance: 4, note: "Sessions, passwords and access control done safely." },
    ],
  },
  {
    id: "data-analyst",
    name: "Data Analyst",
    tagline: "Turn raw data into decisions people can act on.",
    description:
      "Data analysts collect, clean and analyze data, then communicate findings through charts and stories that guide business decisions.",
    accent: "#14b8a6",
    roleSkills: [
      { skillId: "python", group: "core", importance: 5, note: "The workhorse language for analysis and automation." },
      { skillId: "sql", group: "core", importance: 5, note: "Pulling exactly the data you need from databases." },
      { skillId: "statistics", group: "core", importance: 5, note: "Summaries, distributions and avoiding false conclusions." },
      { skillId: "data-viz", group: "core", importance: 4, note: "Charts that communicate insight honestly." },
      { skillId: "data-cleaning", group: "advanced", importance: 4, note: "Real data is messy; analysts make it usable." },
      { skillId: "git", group: "advanced", importance: 2, note: "Versioning analysis code and notebooks." },
    ],
  },
  {
    id: "ai-ml-engineer",
    name: "AI/ML Engineer",
    tagline: "Build systems that learn from data.",
    description:
      "AI/ML engineers train, evaluate and deploy models — translating data science into products that make predictions.",
    accent: "#8b5cf6",
    roleSkills: [
      { skillId: "python", group: "core", importance: 5, note: "The ecosystem for ML: NumPy, pandas, scikit-learn." },
      { skillId: "statistics", group: "core", importance: 5, note: "Probability and evaluation underpin every model." },
      { skillId: "machine-learning", group: "core", importance: 5, note: "Features, training, overfitting and evaluation." },
      { skillId: "data-cleaning", group: "core", importance: 4, note: "Garbage in, garbage out — data prep is most of the work." },
      { skillId: "sql", group: "advanced", importance: 3, note: "Sourcing data at scale from real systems." },
      { skillId: "git", group: "advanced", importance: 3, note: "Reproducible, versioned experimentation." },
    ],
  },
  {
    id: "ui-ux-designer",
    name: "UI/UX Designer",
    tagline: "Design experiences users understand and enjoy.",
    description:
      "UI/UX designers research users, shape flows and craft interfaces — balancing usability, aesthetics and business goals.",
    accent: "#f472b6",
    roleSkills: [
      { skillId: "visual-design", group: "core", importance: 5, note: "Hierarchy, spacing, typography and color that feel intentional." },
      { skillId: "ux-research", group: "core", importance: 5, note: "Testing and evidence instead of opinions." },
      { skillId: "html", group: "core", importance: 4, note: "Knowing the medium keeps designs feasible." },
      { skillId: "css", group: "core", importance: 4, note: "Understanding layout constraints behind the canvas." },
      { skillId: "prototyping", group: "advanced", importance: 4, note: "Rapidly validating flows before build." },
      { skillId: "accessibility", group: "advanced", importance: 4, note: "Designing for everyone is non-negotiable." },
    ],
  },
  {
    id: "cybersecurity-analyst",
    name: "Cybersecurity Analyst",
    tagline: "Protect systems, find weaknesses, respond to threats.",
    description:
      "Security analysts monitor systems for threats, investigate incidents and harden applications against real-world attacks.",
    accent: "#f59e0b",
    roleSkills: [
      { skillId: "security-basics", group: "core", importance: 5, note: "Threat modeling and the defender mindset." },
      { skillId: "networking", group: "core", importance: 5, note: "You can't secure traffic you don't understand." },
      { skillId: "web-security", group: "core", importance: 5, note: "The OWASP-class attacks found in real applications." },
      { skillId: "linux", group: "advanced", importance: 4, note: "Terminal fluency for log analysis and tooling." },
      { skillId: "python", group: "advanced", importance: 3, note: "Scripting analysis and automation." },
    ],
  },
];

const catalog = Object.fromEntries(ROLES.map((r) => [r.id, r])) as Record<
  RoleId,
  CareerRole
>;

export function getRole(id: RoleId | undefined | null): CareerRole | undefined {
  if (!id) return undefined;
  return catalog[id];
}

export function getRoleSkill(role: CareerRole, skillId: string): RoleSkill | undefined {
  return role.roleSkills.find((rs) => rs.skillId === skillId);
}
