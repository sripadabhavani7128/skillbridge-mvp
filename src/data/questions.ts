import type { CareerRole, Question, QuestionDifficulty, QuestionType } from "@/lib/types";
import { getRole } from "./roles";

/**
 * Prototype question bank (mock data).
 *
 * Two questions per skill, deliberately mixed in style — conceptual,
 * scenario-based, code/output and problem-solving — so the assessment reads
 * understanding instead of memorization. In the full product this is served
 * by an item bank / assessment service.
 */

function q(
  id: string,
  skillId: string,
  type: QuestionType,
  difficulty: QuestionDifficulty,
  prompt: string,
  options: string[],
  correctIndex: number,
  explanation: string,
  code?: string,
): Question {
  return {
    id,
    skillId,
    type,
    difficulty,
    prompt,
    options,
    correctIndex,
    explanation,
    ...(code ? { code } : {}),
  };
}

export const QUESTIONS: Question[] = [
  // ── HTML ────────────────────────────────────────────────────────────────
  q(
    "html-1", "html", "concept", "basic",
    "Which element is the most meaningful way to mark the main navigation block of a page?",
    ["<div id=\"nav\">", "<nav>", "<header>", "<menu>"],
    1,
    "<nav> is the semantic landmark for navigation links. Screen readers and search engines can identify it without guessing.",
  ),
  q(
    "html-2", "html", "scenario", "intermediate",
    "A blog lists full posts on its home page. Which element best represents each self-contained post?",
    ["<section>", "<div>", "<article>", "<aside>"],
    2,
    "<article> marks self-contained content that could stand alone — exactly what a blog post is.",
  ),

  // ── CSS ─────────────────────────────────────────────────────────────────
  q(
    "css-1", "css", "problem-solving", "basic",
    "Which selector has the highest specificity?",
    ["p", ".intro", "#app", "[data-role=\"card\"]"],
    2,
    "ID selectors (#app) outweigh classes, attributes and elements in CSS specificity.",
  ),
  q(
    "css-2", "css", "code", "intermediate",
    "You have a two-column card area. Which CSS makes both columns equal width no matter how much text each contains?",
    [
      "display: block; width: 50%; margin: auto;",
      "display: grid; grid-template-columns: 1fr 1fr;",
      "display: inline; font-size: 1rem;",
      "position: absolute; left: 0; right: 50%;",
    ],
    1,
    "Grid's two 1fr tracks split available space evenly, so both columns stay equal regardless of content length.",
    ".cards {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 1rem;\n}",
  ),

  // ── JavaScript ──────────────────────────────────────────────────────────
  q(
    "js-1", "javascript", "code", "basic",
    "What does this code log?",
    ["2", "3", "4", "5"],
    1,
    "filter keeps only even numbers ([2, 4]); .length counts them — the result is 2.",
    "const nums = [1, 2, 3, 4];\nconsole.log(nums.filter((n) => n % 2 === 0).length);",
  ),
  q(
    "js-2", "javascript", "code", "intermediate",
    "What is logged first in this snippet?",
    ["console.log(\"first\")", "setTimeout callback", "Depends on the device", "Nothing runs"],
    0,
    "Synchronous code runs before the event loop processes the setTimeout callback, even when the delay is 0ms.",
    "console.log(\"first\");\nsetTimeout(() => console.log(\"second\"), 0);\nconsole.log(\"third\");",
  ),

  // ── Git ─────────────────────────────────────────────────────────────────
  q(
    "git-1", "git", "concept", "basic",
    "Which command creates a brand-new Git repository in the current folder?",
    ["git clone", "git init", "git start", "git new"],
    1,
    "git init initializes a new repository; git clone copies an existing one.",
  ),
  q(
    "git-2", "git", "scenario", "intermediate",
    "Your teammate pushed a feature branch and wants feedback before it merges. What is the standard next step?",
    [
      "Force-push to main so the change is reviewed there",
      "Open a pull request for the branch",
      "Ask everyone to delete the branch",
      "Commit directly to main on their behalf",
    ],
    1,
    "A pull request is the review gate: it shows exactly what changed and lets reviewers discuss before merge.",
  ),

  // ── Responsive design ───────────────────────────────────────────────────
  q(
    "responsive-1", "responsive-design", "concept", "basic",
    "What does the viewport meta tag do on a mobile device?",
    [
      "Tells the browser the page should be rendered at the device width",
      "Compresses images automatically",
      "Enables browser dark mode",
      "Hides the address bar permanently",
    ],
    0,
    "Without a viewport meta tag, mobile browsers render pages at a desktop width and zoom out.",
  ),
  q(
    "responsive-2", "responsive-design", "problem-solving", "intermediate",
    "A card grid must fit 1, 2, 3 or more columns fluidly. Which approach adapts most gracefully?",
    [
      "Fixed widths with horizontal scroll",
      "CSS Grid with auto-fit and minmax()",
      "A single column at every size",
      "Hardcoded breakpoints changing widths",
    ],
    1,
    "grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)) lets the browser choose column counts from available space.",
  ),

  // ── React ───────────────────────────────────────────────────────────────
  q(
    "react-1", "react", "concept", "basic",
    "What do props do in React?",
    [
      "Store local component state",
      "Pass data from a parent component to a child",
      "Directly change the DOM",
      "Handle HTTP requests",
    ],
    1,
    "Props flow one way — parent to child — and are read-only inside the child.",
  ),
  q(
    "react-2", "react", "code", "intermediate",
    "In this component, when does the effect run?",
    ["On every render", "Only when `user` changes", "Only on first mount", "When the component unmounts"],
    1,
    "The dependency array [user] means the effect runs after the first render and then only when `user` changes.",
    "useEffect(() => {\n  loadProfile(user.id);\n}, [user]);",
  ),

  // ── REST APIs ───────────────────────────────────────────────────────────
  q(
    "rest-api-1", "rest-api", "concept", "basic",
    "A POST request successfully creates a new resource. Which status code should the server return?",
    ["200 OK", "201 Created", "204 No Content", "404 Not Found"],
    1,
    "201 Created signals that a resource was created — more precise than a generic 200.",
  ),
  q(
    "rest-api-2", "rest-api", "scenario", "intermediate",
    "You need to fully replace an existing resource (name and email) at /users/42. Which method fits REST conventions?",
    ["POST /users/42", "PUT /users/42", "PATCH /users/42", "GET /users/42"],
    1,
    "PUT replaces the whole resource; PATCH is for partial updates.",
  ),

  // ── State management ────────────────────────────────────────────────────
  q(
    "state-management-1", "state-management", "concept", "intermediate",
    "Why is state \"lifted up\" to a shared parent component?",
    [
      "To make components render faster",
      "So sibling components can read and update the same state",
      "To move state into the URL",
      "To prevent components from re-rendering",
    ],
    1,
    "Lifting state puts the source of truth where every component that needs it can reach it.",
  ),
  q(
    "state-management-2", "state-management", "scenario", "intermediate",
    "A search box and a results grid both need the same filter value, and typing must update both. What is the simplest correct first step?",
    [
      "Copy the filter into both components with local state",
      "Lift the filter state to their common parent and pass it down as props",
      "Store the filter in a global constant",
      "Write the filter directly into the DOM",
    ],
    1,
    "Lifting state to the common parent makes one source of truth that drives both children.",
  ),

  // ── SQL ─────────────────────────────────────────────────────────────────
  q(
    "sql-1", "sql", "concept", "intermediate",
    "Which clause filters grouped results after aggregation?",
    ["WHERE", "HAVING", "ORDER BY", "LIMIT"],
    1,
    "WHERE filters rows before grouping; HAVING filters groups after aggregation.",
  ),
  q(
    "sql-2", "sql", "concept", "basic",
    "What is a primary key for in a relational table?",
    [
      "The fastest column to search",
      "A unique identifier for each row",
      "A column that may contain duplicates",
      "A reference to another table",
    ],
    1,
    "A primary key uniquely identifies every row — no duplicates, no nulls.",
  ),

  // ── Data modeling ───────────────────────────────────────────────────────
  q(
    "data-modeling-1", "data-modeling", "scenario", "intermediate",
    "One user can place many orders, and each order belongs to one user. How should you model this?",
    [
      "Store all orders in a single text field on the user",
      "Add a user_id foreign key on the orders table",
      "Create one table per order",
      "Store orders in the users table as rows",
    ],
    1,
    "A foreign key on the \"many\" side (orders.user_id) records the one-to-many relationship.",
  ),
  q(
    "data-modeling-2", "data-modeling", "problem-solving", "intermediate",
    "Supplier names are repeated across thousands of product rows, and renaming a supplier means updating them all. What fixes this?",
    [
      "Store supplier as a separate table with an id, reference it from products",
      "Add a comment column to products",
      "Use a larger text column for names",
      "Accept the duplication — it's fast to query",
    ],
    0,
    "Normalizing supplier into its own table removes duplication and makes updates single-point.",
  ),

  // ── Auth & security (backend) ───────────────────────────────────────────
  q(
    "auth-security-1", "auth-security", "concept", "basic",
    "How should passwords be stored in a database?",
    [
      "Plain text for fast lookups",
      "Encrypted with a reversible algorithm",
      "Hashed with a slow, salted algorithm like bcrypt",
      "Base64-encoded",
    ],
    2,
    "Passwords must be salted hashes — never reversible and never plain text.",
  ),
  q(
    "auth-security-2", "auth-security", "scenario", "intermediate",
    "An attacker stole a user's session cookie. Which combination best reduces the damage?",
    [
      "HttpOnly and Secure cookie flags, short expiry, and logout/rotation",
      "Storing the cookie in localStorage",
      "Disabling cookies entirely",
      "Sending the cookie over plain HTTP for testing",
    ],
    0,
    "HttpOnly blocks script access, Secure forces HTTPS, and rotation/expiry limits how long a stolen cookie works.",
  ),

  // ── Python ──────────────────────────────────────────────────────────────
  q(
    "python-1", "python", "code", "basic",
    "What does this snippet print?",
    ["3", "2", "1", "Error"],
    0,
    "nums[-1] indexes from the end of the list, so it returns the last element: 3.",
    "nums = [1, 2, 3]\nprint(nums[-1])",
  ),
  q(
    "python-2", "python", "concept", "basic",
    "What is the key difference between a list and a tuple in Python?",
    [
      "Lists hold numbers only; tuples hold text only",
      "Tuples are immutable; lists are mutable",
      "Tuples are faster at iteration but lists are slower",
      "There is no difference",
    ],
    1,
    "Lists can change in place; tuples are fixed once created — which makes tuples safe as dictionary keys.",
  ),

  // ── Statistics ──────────────────────────────────────────────────────────
  q(
    "statistics-1", "statistics", "scenario", "intermediate",
    "A team's salaries are mostly 3–6L, but one executive earns 50L. Which measure best summarizes a \"typical\" salary?",
    ["Mean", "Median", "Range", "Mode only"],
    1,
    "The median is robust to the single extreme value that drags the mean upward.",
  ),
  q(
    "statistics-2", "statistics", "concept", "basic",
    "Ice-cream sales rise and drowning incidents rise together in summer. Which statement is correct?",
    [
      "Ice cream causes drowning",
      "Correlation does not prove causation — a third factor (heat) drives both",
      "The correlation is spurious, so ignore both datasets",
      "Drowning causes ice-cream sales",
    ],
    1,
    "Confounding variables (hot weather) can create correlation without causation.",
  ),

  // ── Data visualization ──────────────────────────────────────────────────
  q(
    "data-viz-1", "data-viz", "scenario", "intermediate",
    "You must show how monthly active users changed over two years. Which chart communicates the trend best?",
    ["Pie chart", "Line chart", "Stacked donut", "Word cloud"],
    1,
    "Line charts make change over time visible; pies are for parts of a whole at a moment.",
  ),
  q(
    "data-viz-2", "data-viz", "problem-solving", "intermediate",
    "A bar chart comparing totals looks dramatic because bars are cut off. What is the honest fix?",
    [
      "Start the value axis at zero",
      "Zoom into the tallest bar only",
      "Remove the axis labels",
      "Use 3D bars for effect",
    ],
    0,
    "Truncated axes exaggerate differences; starting bars at zero keeps the comparison truthful.",
  ),

  // ── Data cleaning ───────────────────────────────────────────────────────
  q(
    "data-cleaning-1", "data-cleaning", "problem-solving", "intermediate",
    "A CSV has missing values written as \"N/A\", \"-\", \"null\" and blanks. What is the right first step?",
    [
      "Delete every row containing any of them",
      "Standardize all of them to one missing marker, then decide handling per column",
      "Replace everything with 0",
      "Leave them — analysis tools handle it",
    ],
    1,
    "You must normalize missing markers first, then choose imputation or removal deliberately per column.",
  ),
  q(
    "data-cleaning-2", "data-cleaning", "concept", "basic",
    "What does deduplication do to a dataset?",
    [
      "Adds rows so totals are larger",
      "Removes repeated rows that represent the same record",
      "Sorts rows alphabetically",
      "Merges all columns into one",
    ],
    1,
    "Dedup removes duplicate records — often needed after merging data from several sources.",
  ),

  // ── Machine learning ────────────────────────────────────────────────────
  q(
    "machine-learning-1", "machine-learning", "concept", "intermediate",
    "A model scores 99% on training data but 60% on new data. What is happening?",
    [
      "The model is underfitting",
      "The model is overfitting — it memorized the training set",
      "The data is perfectly clean",
      "The model needs more features, always",
    ],
    1,
    "The train/eval gap is the classic overfitting signal: memorizing instead of generalizing.",
  ),
  q(
    "machine-learning-2", "machine-learning", "scenario", "intermediate",
    "You train a spam classifier and want an honest estimate of how it will perform. What must you do first?",
    [
      "Evaluate on the same data it trained on",
      "Hold out a test set the model never sees during training",
      "Add more features until training accuracy is 100%",
      "Deploy immediately and monitor in production",
    ],
    1,
    "A held-out test set measures generalization; evaluating on training data overstates quality.",
  ),

  // ── UX research ─────────────────────────────────────────────────────────
  q(
    "ux-research-1", "ux-research", "concept", "basic",
    "What does a usability test involve?",
    [
      "Asking users which design they prefer in a survey",
      "Observing real users attempt realistic tasks and noting where they struggle",
      "Reading competitor reviews",
      "Showing the design to your team",
    ],
    1,
    "Usability testing is about observed behavior on tasks — not stated preference.",
  ),
  q(
    "ux-research-2", "ux-research", "scenario", "intermediate",
    "A new checkout flow converts worse than expected, and you don't know why users drop off. Which method reveals the reason best?",
    [
      "Moderated sessions where users think aloud while checking out",
      "A larger logo",
      "A post-launch email asking \"did you like it?\"",
      "Removing the checkout entirely",
    ],
    0,
    "Think-aloud observation surfaces the moment users get confused — analytics alone show where, not why.",
  ),

  // ── Visual design ───────────────────────────────────────────────────────
  q(
    "visual-design-1", "visual-design", "concept", "basic",
    "Why is visual hierarchy important in an interface?",
    [
      "It makes pages look colorful",
      "It guides the eye to the most important content first",
      "It increases page load speed",
      "It is only for decorative screens",
    ],
    1,
    "Size, weight, spacing and contrast create a reading order that matches user goals.",
  ),
  q(
    "visual-design-2", "visual-design", "problem-solving", "basic",
    "White text on a pale-yellow button is hard to read. What is the best fix?",
    [
      "Make the text italic",
      "Increase the contrast — darker button or darker text",
      "Add a drop shadow to the text",
      "Increase font weight only slightly",
    ],
    1,
    "Readability starts with sufficient contrast between text and its background.",
  ),

  // ── Prototyping ─────────────────────────────────────────────────────────
  q(
    "prototyping-1", "prototyping", "concept", "basic",
    "A low-fidelity prototype is best described as:",
    [
      "A pixel-perfect visual of the final screen",
      "A quick, rough representation of layout and flow used early",
      "Production code ready to deploy",
      "A fully branded marketing page",
    ],
    1,
    "Low fidelity = fast and cheap to change, perfect for testing structure before visual polish.",
  ),
  q(
    "prototyping-2", "prototyping", "scenario", "intermediate",
    "Before any code is written, you want to check that users understand the onboarding flow. What do you do?",
    [
      "Build the full app and test after launch",
      "Create a clickable prototype and run usability sessions on it",
      "Send a PDF of screens",
      "Ask the developers what they think",
    ],
    1,
    "Clickable prototypes let users experience the flow so you can fix problems before engineering cost.",
  ),

  // ── Accessibility ───────────────────────────────────────────────────────
  q(
    "accessibility-1", "accessibility", "concept", "basic",
    "What is the purpose of alt text on an image?",
    [
      "To improve SEO only",
      "To describe the image for screen-reader users and when images fail to load",
      "To make the image load faster",
      "To show a tooltip on hover",
    ],
    1,
    "Alt text conveys the image's meaning to assistive technology and when it can't be displayed.",
  ),
  q(
    "accessibility-2", "accessibility", "problem-solving", "intermediate",
    "Keyboard-only users cannot open a custom dropdown menu in your app. What is the core requirement you missed?",
    [
      "The menu needs more color",
      "Every interactive control must be reachable and operable with the keyboard, with visible focus",
      "The menu should auto-open on hover only",
      "Users should use a mouse instead",
    ],
    1,
    "Custom widgets must support full keyboard operation and a visible focus indicator — WCAG's core keyboard requirement.",
  ),

  // ── Networking ──────────────────────────────────────────────────────────
  q(
    "networking-1", "networking", "concept", "basic",
    "What is the DNS used for?",
    [
      "Encrypting web traffic",
      "Translating domain names into IP addresses",
      "Routing emails to spam folders",
      "Compressing video streams",
    ],
    1,
    "DNS resolves human-friendly names like example.com to the IP addresses computers connect to.",
  ),
  q(
    "networking-2", "networking", "concept", "intermediate",
    "Which statement about TCP versus UDP is correct?",
    [
      "UDP guarantees ordered delivery; TCP does not",
      "TCP provides reliable, ordered delivery; UDP is lightweight with no guarantees",
      "TCP is faster than UDP in all cases",
      "UDP is used only for email",
    ],
    1,
    "TCP handles reliability and ordering; UDP trades those for low latency (e.g. video, DNS).",
  ),

  // ── Linux ───────────────────────────────────────────────────────────────
  q(
    "linux-1", "linux", "concept", "basic",
    "Which command lists files and folders in the current directory?",
    ["cat", "ls", "cd", "echo"],
    1,
    "ls lists directory contents; cat prints file contents, cd changes directories.",
  ),
  q(
    "linux-2", "linux", "scenario", "intermediate",
    "A service keeps failing and the log file is growing. Which command streams the newest log lines live?",
    ["tail -f app.log", "head -n 100 app.log", "rm app.log", "ls -la app.log"],
    0,
    "tail -f follows the file and prints new lines as they are appended — the standard way to watch logs.",
  ),

  // ── Web security ────────────────────────────────────────────────────────
  q(
    "web-security-1", "web-security", "concept", "intermediate",
    "What is a cross-site scripting (XSS) attack?",
    [
      "Injecting malicious script that runs in a victim's browser",
      "Guessing passwords faster with GPUs",
      "Flooding a server with traffic",
      "Reading another user's database password",
    ],
    0,
    "XSS happens when untrusted input is rendered as code; output must be escaped and input validated.",
  ),
  q(
    "web-security-2", "web-security", "problem-solving", "intermediate",
    "A login form is vulnerable to SQL injection via the username field. Which fix removes the vulnerability class?",
    [
      "Blocking the word \"OR\" in usernames",
      "Using parameterized queries / prepared statements",
      "Storing usernames in uppercase",
      "Adding a CAPTCHA",
    ],
    1,
    "Parameterized queries separate SQL structure from data, so input can never become executable SQL.",
  ),

  // ── Security fundamentals ───────────────────────────────────────────────
  q(
    "security-basics-1", "security-basics", "concept", "basic",
    "What is a phishing attack?",
    [
      "A malicious email or message tricking someone into revealing credentials",
      "Physically stealing a laptop",
      "A hardware failure",
      "Spamming social media posts",
    ],
    0,
    "Phishing exploits trust — fake messages that look legitimate to harvest passwords or install malware.",
  ),
  q(
    "security-basics-2", "security-basics", "scenario", "basic",
    "Why does multi-factor authentication (MFA) protect an account even after a password leaks?",
    [
      "It changes the password automatically",
      "The attacker still needs a second factor they don't have",
      "It hides the password from the attacker",
      "It slows the login page down",
    ],
    1,
    "MFA requires something you know plus something you have — a leaked password alone is not enough.",
  ),
];

const bySkill = new Map<string, Question[]>();
for (const question of QUESTIONS) {
  const list = bySkill.get(question.skillId) ?? [];
  list.push(question);
  bySkill.set(question.skillId, list);
}

/** Ordered questions for a role: role's skill order, core before advanced. */
export function questionsForRole(role: CareerRole): Question[] {
  const ordered: Question[] = [];
  const pushFor = (skillId: string) => {
    const list = bySkill.get(skillId) ?? [];
    ordered.push(...list);
  };
  role.roleSkills
    .filter((rs) => rs.group === "core")
    .forEach((rs) => pushFor(rs.skillId));
  role.roleSkills
    .filter((rs) => rs.group === "advanced")
    .forEach((rs) => pushFor(rs.skillId));
  return ordered;
}

/** All questions for a role id (fallback: any role with that id). */
export function questionsForRoleId(roleId: string): Question[] {
  const role = getRole(roleId);
  return role ? questionsForRole(role) : [];
}

export function getQuestion(id: string): Question | undefined {
  return QUESTIONS.find((question) => question.id === id);
}
