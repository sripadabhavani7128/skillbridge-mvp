import type { LearningResource, SkillId } from "@/lib/types";

/**
 * Learning content knowledge base (mock data).
 *
 * Each skill maps to a short "course": why it matters for the role, the
 * concrete outcome, a topic checklist the student can tick off, and free
 * starting resources. The plan engine assembles weeks from this catalog.
 *
 * In the full product a recommendation service (LLM or curated catalog)
 * supplies this per student.
 */

export interface SkillLearning {
  skillId: SkillId;
  why: string;
  outcome: string;
  topics: string[];
  resources: LearningResource[];
}

export const LEARNING_CONTENT: Record<SkillId, SkillLearning> = {
  html: {
    skillId: "html",
    why: "Semantic HTML is how browsers, screen readers and search engines understand your pages.",
    outcome: "You can structure any page with the right landmarks and elements.",
    topics: [
      "Document structure and boilerplate",
      "Semantic elements: header, nav, main, article, section, footer",
      "Links, images and media",
      "Forms: inputs, labels and validation",
      "Tables and lists used correctly",
      "Basic accessibility in HTML",
    ],
    resources: [
      { label: "HTML: HyperText Markup Language — MDN", kind: "docs", href: "https://developer.mozilla.org/en-US/docs/Web/HTML" },
      { label: "Learn HTML — freeCodeCamp", kind: "course", href: "https://www.freecodecamp.org/learn/" },
    ],
  },
  css: {
    skillId: "css",
    why: "CSS turns structure into the designed, responsive interface users actually see.",
    outcome: "You can build layouts with flexbox/grid and style them consistently.",
    topics: [
      "Selectors, specificity and the cascade",
      "Box model: margin, padding, border",
      "Flexbox layout",
      "CSS Grid layout",
      "Colors, typography and spacing",
      "Pseudo-classes and transitions",
    ],
    resources: [
      { label: "CSS — MDN", kind: "docs", href: "https://developer.mozilla.org/en-US/docs/Web/CSS" },
      { label: "CSS Flexbox Froggy (game)", kind: "practice", href: "https://flexboxfroggy.com/" },
    ],
  },
  javascript: {
    skillId: "javascript",
    why: "JavaScript powers interactivity, data handling and every frontend framework.",
    outcome: "You can write small programs, read code confidently and use the DOM.",
    topics: [
      "Variables, types and operators",
      "Functions and scope",
      "Arrays and objects",
      "DOM manipulation basics",
      "Events and event handling",
      "Async JavaScript: promises and fetch",
    ],
    resources: [
      { label: "JavaScript — MDN", kind: "docs", href: "https://developer.mozilla.org/en-US/docs/Web/JavaScript" },
      { label: "JavaScript Algorithms and Data Structures — freeCodeCamp", kind: "course", href: "https://www.freecodecamp.org/learn/" },
    ],
  },
  git: {
    skillId: "git",
    why: "Version control is how professional teams collaborate — and it's expected on day one.",
    outcome: "You can commit, branch, merge and resolve basic conflicts safely.",
    topics: [
      "git init, status, add and commit",
      "Branches and switching",
      "Merging and pull requests",
      "Undoing changes safely",
      "Cloning and working with remotes",
      "Good commit messages",
    ],
    resources: [
      { label: "Git documentation", kind: "docs", href: "https://git-scm.com/doc" },
      { label: "GitHub Skills", kind: "course", href: "https://skills.github.com/" },
    ],
  },
  "responsive-design": {
    skillId: "responsive-design",
    why: "Most users arrive on phones; interfaces must work beautifully at every width.",
    outcome: "You can build layouts that adapt fluidly without breaking.",
    topics: [
      "Viewport and mobile-first thinking",
      "Fluid units: %, fr, rem, clamp",
      "Media queries and breakpoints",
      "Fluid images and aspect ratios",
      "Flexbox/grid that reflows",
      "Testing across device sizes",
    ],
    resources: [
      { label: "Responsive design — MDN", kind: "docs", href: "https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design" },
      { label: "web.dev Responsive Web Design Basics", kind: "docs", href: "https://web.dev/articles/responsive-web-design-basics" },
    ],
  },
  react: {
    skillId: "react",
    why: "React is the most requested frontend framework skill in job postings.",
    outcome: "You can build a small component-based app with props, state and hooks.",
    topics: [
      "Components and JSX",
      "Props and one-way data flow",
      "State with useState",
      "Effects with useEffect",
      "Lists and keys",
      "Thinking in components",
    ],
    resources: [
      { label: "React Docs", kind: "docs", href: "https://react.dev/learn" },
      { label: "The Beginner's Guide to React — egghead", kind: "course", href: "https://egghead.io/courses/the-beginner-s-guide-to-react" },
    ],
  },
  "rest-api": {
    skillId: "rest-api",
    why: "Products are built by connecting frontends to services over HTTP.",
    outcome: "You can call and design simple REST APIs with correct methods and status codes.",
    topics: [
      "HTTP methods and status codes",
      "Resources and URLs",
      "JSON payloads",
      "Headers: content-type, auth",
      "Fetching data from a frontend",
      "Error handling and loading states",
    ],
    resources: [
      { label: "HTTP basics — MDN", kind: "docs", href: "https://developer.mozilla.org/en-US/docs/Web/HTTP" },
      { label: "REST API tutorial — freeCodeCamp", kind: "course", href: "https://www.freecodecamp.org/news/rest-api-design-best-practices-build-a-rest-api/" },
    ],
  },
  "state-management": {
    skillId: "state-management",
    why: "Apps fail when shared state gets duplicated or tangled; predictable state is a senior skill.",
    outcome: "You can identify where state belongs and lift/shape it correctly.",
    topics: [
      "Local vs shared state",
      "Lifting state up",
      "Props and callbacks for sharing",
      "Derived state instead of duplicates",
      "Reducer patterns",
      "When to reach for a state library",
    ],
    resources: [
      { label: "Managing state — React Docs", kind: "docs", href: "https://react.dev/learn/managing-state" },
      { label: "State: a component's memory — React Docs", kind: "docs", href: "https://react.dev/learn/state-a-components-memory" },
    ],
  },
  sql: {
    skillId: "sql",
    why: "Almost every product stores data in a relational database — SQL is the common language.",
    outcome: "You can query, filter, aggregate and join tables confidently.",
    topics: [
      "SELECT, WHERE and ORDER BY",
      "Filtering and LIKE/IN",
      "GROUP BY and HAVING",
      "JOINs between tables",
      "INSERT/UPDATE/DELETE",
      "Indexes and query performance basics",
    ],
    resources: [
      { label: "SQL tutorial — W3Schools", kind: "course", href: "https://www.w3schools.com/sql/" },
      { label: "SQLBolt — interactive lessons", kind: "practice", href: "https://sqlbolt.com/" },
    ],
  },
  "data-modeling": {
    skillId: "data-modeling",
    why: "A schema that matches reality prevents bugs, duplication and slow queries later.",
    outcome: "You can design normalized tables with clear relationships.",
    topics: [
      "Tables, rows and columns",
      "Primary and foreign keys",
      "One-to-one, one-to-many, many-to-many",
      "Normalization basics",
      "Choosing data types",
      "Modeling common product entities",
    ],
    resources: [
      { label: "Database design basics — Microsoft Learn", kind: "docs", href: "https://learn.microsoft.com/en-us/sql/relational-databases/database-design/" },
      { label: "Database normalization explained", kind: "video", href: "https://www.youtube.com/results?search_query=database+normalization+explained" },
    ],
  },
  "auth-security": {
    skillId: "auth-security",
    why: "A single auth bug can expose every user's data — security is core backend work.",
    outcome: "You understand safe password, session and access-control practice.",
    topics: [
      "Hashing vs encryption",
      "Salts and slow hash functions",
      "Session cookies and flags",
      "Tokens and expiry",
      "Role-based access control",
      "Common auth attacks",
    ],
    resources: [
      { label: "OWASP Authentication Cheat Sheet", kind: "docs", href: "https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html" },
      { label: "OWASP Password Storage Cheat Sheet", kind: "docs", href: "https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html" },
    ],
  },
  python: {
    skillId: "python",
    why: "Python's readable syntax and rich ecosystem make it the default for data and scripting.",
    outcome: "You can write small scripts, loops, functions and simple data manipulation.",
    topics: [
      "Variables and data types",
      "Lists, tuples and dictionaries",
      "Conditionals and loops",
      "Functions and modules",
      "Reading and writing files",
      "Errors and debugging",
    ],
    resources: [
      { label: "Python.org tutorial", kind: "docs", href: "https://docs.python.org/3/tutorial/" },
      { label: "Scientific Computing with Python — freeCodeCamp", kind: "course", href: "https://www.freecodecamp.org/learn/" },
    ],
  },
  statistics: {
    skillId: "statistics",
    why: "Analysts and ML engineers make decisions under uncertainty — statistics is the toolkit.",
    outcome: "You can summarize data honestly and interpret results without fooling yourself.",
    topics: [
      "Mean, median, mode and spread",
      "Distributions and outliers",
      "Probability basics",
      "Correlation vs causation",
      "Sampling and bias",
      "Interpreting charts critically",
    ],
    resources: [
      { label: "Statistics — Khan Academy", kind: "course", href: "https://www.khanacademy.org/math/statistics-probability" },
      { label: "Seeing Theory — interactive statistics", kind: "practice", href: "https://seeing-theory.brown.edu/" },
    ],
  },
  "data-viz": {
    skillId: "data-viz",
    why: "Great analysis is useless if the chart misleads; visualization is how insight travels.",
    outcome: "You can pick the right chart and design it honestly.",
    topics: [
      "Choosing chart types by question",
      "Axes, baselines and scales",
      "Color use and labels",
      "Avoiding misleading charts",
      "Dashboards: hierarchy and narrative",
      "Tools: spreadsheets, Python, BI basics",
    ],
    resources: [
      { label: "Data Visualization — The Data Visualisation Catalogue", kind: "docs", href: "https://datavizcatalogue.com/" },
      { label: "Fundamentals of Data Visualization (book)", kind: "course", href: "https://clauswilke.com/dataviz/" },
    ],
  },
  "data-cleaning": {
    skillId: "data-cleaning",
    why: "Real datasets are messy — cleaning reliably is most of an analyst's job.",
    outcome: "You can audit, normalize and de-duplicate a raw dataset with Python/pandas.",
    topics: [
      "Profiling data and spotting issues",
      "Missing values: detect and decide",
      "Standardizing formats",
      "Removing duplicates",
      "Type coercion and parsing",
      "Joining and reshaping datasets",
    ],
    resources: [
      { label: "Pandas user guide", kind: "docs", href: "https://pandas.pydata.org/docs/user_guide/index.html" },
      { label: "Data Analysis with Python — freeCodeCamp", kind: "course", href: "https://www.freecodecamp.org/learn/" },
    ],
  },
  "machine-learning": {
    skillId: "machine-learning",
    why: "ML turns historical data into predictions — done right, it's an engineering discipline.",
    outcome: "You can run a small supervised learning project with honest evaluation.",
    topics: [
      "Supervised vs unsupervised learning",
      "Features and labels",
      "Train/test/validation splits",
      "Overfitting and regularization",
      "Evaluation metrics",
      "Simple model families: linear, trees",
    ],
    resources: [
      { label: "Machine Learning Crash Course — Google", kind: "course", href: "https://developers.google.com/machine-learning/crash-course" },
      { label: "scikit-learn user guide", kind: "docs", href: "https://scikit-learn.org/stable/user_guide.html" },
    ],
  },
  "ux-research": {
    skillId: "ux-research",
    why: "Research replaces guesswork — designs validated with users fail less often.",
    outcome: "You can plan and run a basic usability test and turn findings into fixes.",
    topics: [
      "Qualitative vs quantitative research",
      "Planning usability sessions",
      "Writing test tasks",
      "Moderating and think-aloud",
      "Synthesizing findings",
      "Prioritizing fixes",
    ],
    resources: [
      { label: "Nielsen Norman Group — Usability Testing 101", kind: "docs", href: "https://www.nngroup.com/articles/usability-testing-101/" },
      { label: "UsabilityHub", kind: "practice", href: "https://usabilityhub.com/" },
    ],
  },
  "visual-design": {
    skillId: "visual-design",
    why: "Users trust and understand interfaces that look intentional.",
    outcome: "You can compose clean layouts with clear hierarchy and consistent spacing.",
    topics: [
      "Hierarchy and reading order",
      "Typography pairing and scale",
      "Color systems and contrast",
      "Spacing and rhythm",
      "Alignment and grids",
      "States: hover, focus, disabled",
    ],
    resources: [
      { label: "Refactoring UI", kind: "course", href: "https://www.refactoringui.com/" },
      { label: "Material Design guidelines", kind: "docs", href: "https://m2.material.io/design/introduction" },
    ],
  },
  prototyping: {
    skillId: "prototyping",
    why: "Cheap, fast prototypes surface flow problems before expensive engineering.",
    outcome: "You can turn a concept into a testable clickable flow.",
    topics: [
      "Sketches and wireframes",
      "Fidelity levels and when to use them",
      "Building clickable flows",
      "Interactive states and transitions",
      "Testing prototypes with users",
      "Handoff basics to developers",
    ],
    resources: [
      { label: "Figma Learn", kind: "course", href: "https://www.figma.com/learn/" },
      { label: "Wireframing — UX Collective", kind: "docs", href: "https://uxdesign.cc/" },
    ],
  },
  accessibility: {
    skillId: "accessibility",
    why: "About 15% of people live with disability; excluding them is a product and legal risk.",
    outcome: "You can audit a screen for common WCAG failures and fix them.",
    topics: [
      "WCAG principles: perceivable, operable, understandable",
      "Semantic HTML and landmarks",
      "Keyboard support and focus",
      "Alt text and media alternatives",
      "Color contrast",
      "Testing with screen readers",
    ],
    resources: [
      { label: "WebAIM", kind: "docs", href: "https://webaim.org/" },
      { label: "Accessibility — MDN", kind: "docs", href: "https://developer.mozilla.org/en-US/docs/Web/Accessibility" },
    ],
  },
  networking: {
    skillId: "networking",
    why: "Security analysts trace attacks across networks — you must know how traffic moves.",
    outcome: "You can explain the path of a request and read basic network evidence.",
    topics: [
      "IP addressing and subnetting basics",
      "DNS and how names resolve",
      "TCP/UDP and ports",
      "HTTP on the wire",
      "Common network attacks",
      "Reading packet captures at a basic level",
    ],
    resources: [
      { label: "Networking — Khan Academy", kind: "course", href: "https://www.khanacademy.org/computing/computers-and-internet/xcae6f4a7ff015e7d:the-internet" },
      { label: "Professor Messer Network+ videos", kind: "video", href: "https://www.professormesser.com/network-plus/n10-008/" },
    ],
  },
  linux: {
    skillId: "linux",
    why: "Servers, logs and security tooling all live in the terminal — fluency is table stakes.",
    outcome: "You can navigate, inspect processes and follow logs from the command line.",
    topics: [
      "Navigation: pwd, ls, cd",
      "Reading files: cat, less, head, tail",
      "Processes and system state",
      "Permissions basics",
      "Pipes and redirection",
      "Grep for searching logs",
    ],
    resources: [
      { label: "The Linux Command Line (free book)", kind: "course", href: "https://linuxcommand.org/tlcl.php" },
      { label: "OverTheWire Bandit (game)", kind: "practice", href: "https://overthewire.org/wargames/bandit/" },
    ],
  },
  "web-security": {
    skillId: "web-security",
    why: "Web apps are the most attacked surface; OWASP-class flaws show up everywhere.",
    outcome: "You can recognize and explain the top web attacks and their defenses.",
    topics: [
      "OWASP Top 10 overview",
      "Cross-site scripting (XSS)",
      "SQL injection",
      "CSRF and clickjacking",
      "Security headers",
      "Secure session handling",
    ],
    resources: [
      { label: "OWASP Top 10", kind: "docs", href: "https://owasp.org/www-project-top-ten/" },
      { label: "PortSwigger Web Security Academy", kind: "practice", href: "https://portswigger.net/web-security" },
    ],
  },
  "security-basics": {
    skillId: "security-basics",
    why: "Every security decision starts from threat thinking — knowing how attackers operate.",
    outcome: "You can think like a defender: identify assets, threats and controls.",
    topics: [
      "CIA triad: confidentiality, integrity, availability",
      "Threat actors and motivations",
      "Phishing and social engineering",
      "Password hygiene and MFA",
      "Risk and controls basics",
      "Incident response mindset",
    ],
    resources: [
      { label: "TryHackMe — introductory paths", kind: "practice", href: "https://tryhackme.com/" },
      { label: "CISA cybersecurity resources", kind: "docs", href: "https://www.cisa.gov/topics/cybersecurity-best-practices" },
    ],
  },
};
