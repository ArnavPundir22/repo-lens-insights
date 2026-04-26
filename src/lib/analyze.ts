/**
 * analyzeRepo — Deep Repository Intelligence
 *
 * Fetches real data from the GitHub API to produce:
 *  - Multi-file context analysis (repo tree + dependency manifests)
 *  - Tech stack detection (languages, frameworks, databases, tools)
 *  - Contributor activity insights (commits, contributors, staleness)
 */

const GITHUB_API = "https://api.github.com";

// ─── GitHub API shapes ───────────────────────────────────────────────────────

interface GitHubRepo {
  name: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  language: string | null;
  default_branch: string;
  pushed_at: string;
  html_url: string;
  topics: string[];
}

interface GitHubTreeItem {
  path: string;
  type: string;
}

interface GitHubContributor {
  login: string;
  avatar_url: string;
  html_url: string;
  contributions: number;
}

interface GitHubIssue {
  title: string;
}

// ─── Public types ─────────────────────────────────────────────────────────────

export type TechCategory = "language" | "framework" | "database" | "tool" | "testing";

export interface TechBadge {
  name: string;
  category: TechCategory;
}

export interface Contributor {
  login: string;
  avatarUrl: string;
  contributions: number;
  profileUrl: string;
}

export interface CommitActivity {
  lastCommitDate: string;
  commitCount30Days: number;
  isActive: boolean;
}

export interface AnalysisResult {
  repoName: string;
  owner: string;
  description: string;
  summary: string;
  language: string;
  stars: number;
  forks: number;
  openIssues: number;
  goodFirstIssues: string[];
  tags: string[];
  techStack: TechBadge[];
  contributors: Contributor[];
  commitActivity: CommitActivity;
  repoUrl: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function parseGitHubUrl(url: string): { owner: string; repo: string } | null {
  const match = url.match(/github\.com\/([^/]+)\/([^/?#]+)/);
  if (!match) return null;
  return { owner: match[1], repo: match[2].replace(/\.git$/, "") };
}

async function githubFetch(path: string): Promise<unknown> {
  const headers: HeadersInit = {
    Accept: "application/vnd.github.v3+json",
  };
  const token = (import.meta.env.VITE_GITHUB_TOKEN as string | undefined);
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${GITHUB_API}${path}`, { headers });

  if (!response.ok) {
    if (response.status === 403) {
      throw new Error(
        "GitHub API rate limit exceeded. Please try again in a few minutes."
      );
    }
    if (response.status === 404) {
      throw new Error(
        "Repository not found. Make sure it's a public GitHub repository."
      );
    }
    throw new Error(`GitHub API error (${response.status}). Please try again.`);
  }

  // 202 means GitHub is computing the data (e.g. large contributor lists)
  if (response.status === 202) return [];

  return response.json();
}

function decodeBase64Content(encoded: string): string {
  try {
    return atob(encoded.replace(/\n/g, ""));
  } catch {
    return "";
  }
}

function thirtyDaysAgo(): string {
  const d = new Date();
  d.setDate(d.getDate() - 30);
  return d.toISOString();
}

function isActiveRepo(pushedAt: string): boolean {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  return new Date(pushedAt) > sixMonthsAgo;
}

// ─── Tech stack detection ────────────────────────────────────────────────────

const PACKAGE_JSON_TECH_MAP: Record<string, TechBadge> = {
  react: { name: "React", category: "framework" },
  vue: { name: "Vue", category: "framework" },
  "@angular/core": { name: "Angular", category: "framework" },
  next: { name: "Next.js", category: "framework" },
  nuxt: { name: "Nuxt.js", category: "framework" },
  svelte: { name: "Svelte", category: "framework" },
  "@sveltejs/kit": { name: "SvelteKit", category: "framework" },
  express: { name: "Express", category: "framework" },
  fastify: { name: "Fastify", category: "framework" },
  "@nestjs/core": { name: "NestJS", category: "framework" },
  hono: { name: "Hono", category: "framework" },
  astro: { name: "Astro", category: "framework" },
  remix: { name: "Remix", category: "framework" },
  gatsby: { name: "Gatsby", category: "framework" },
  "react-native": { name: "React Native", category: "framework" },
  electron: { name: "Electron", category: "framework" },
  vite: { name: "Vite", category: "tool" },
  webpack: { name: "Webpack", category: "tool" },
  tailwindcss: { name: "Tailwind CSS", category: "framework" },
  graphql: { name: "GraphQL", category: "tool" },
  "@trpc/server": { name: "tRPC", category: "framework" },
  trpc: { name: "tRPC", category: "framework" },
  prisma: { name: "Prisma", category: "database" },
  "drizzle-orm": { name: "Drizzle ORM", category: "database" },
  mongoose: { name: "MongoDB", category: "database" },
  pg: { name: "PostgreSQL", category: "database" },
  mysql2: { name: "MySQL", category: "database" },
  redis: { name: "Redis", category: "database" },
  "@supabase/supabase-js": { name: "Supabase", category: "database" },
  firebase: { name: "Firebase", category: "database" },
  jest: { name: "Jest", category: "testing" },
  vitest: { name: "Vitest", category: "testing" },
  "@testing-library/react": { name: "Testing Library", category: "testing" },
  "@playwright/test": { name: "Playwright", category: "testing" },
  cypress: { name: "Cypress", category: "testing" },
  typescript: { name: "TypeScript", category: "language" },
};

const PYTHON_TECH_MAP: Record<string, TechBadge> = {
  django: { name: "Django", category: "framework" },
  flask: { name: "Flask", category: "framework" },
  fastapi: { name: "FastAPI", category: "framework" },
  numpy: { name: "NumPy", category: "tool" },
  pandas: { name: "Pandas", category: "tool" },
  tensorflow: { name: "TensorFlow", category: "tool" },
  torch: { name: "PyTorch", category: "tool" },
  "scikit-learn": { name: "scikit-learn", category: "tool" },
  sqlalchemy: { name: "SQLAlchemy", category: "database" },
  celery: { name: "Celery", category: "tool" },
  pydantic: { name: "Pydantic", category: "tool" },
  pytest: { name: "pytest", category: "testing" },
  transformers: { name: "HuggingFace", category: "tool" },
  langchain: { name: "LangChain", category: "tool" },
  "langchain-core": { name: "LangChain", category: "tool" },
};

const EXTENSION_LANGUAGE_MAP: Record<string, TechBadge> = {
  ts: { name: "TypeScript", category: "language" },
  tsx: { name: "TypeScript", category: "language" },
  js: { name: "JavaScript", category: "language" },
  jsx: { name: "JavaScript", category: "language" },
  py: { name: "Python", category: "language" },
  rs: { name: "Rust", category: "language" },
  go: { name: "Go", category: "language" },
  java: { name: "Java", category: "language" },
  kt: { name: "Kotlin", category: "language" },
  rb: { name: "Ruby", category: "language" },
  php: { name: "PHP", category: "language" },
  cs: { name: "C#", category: "language" },
  cpp: { name: "C++", category: "language" },
  cc: { name: "C++", category: "language" },
  c: { name: "C", category: "language" },
  swift: { name: "Swift", category: "language" },
  dart: { name: "Dart", category: "language" },
  scala: { name: "Scala", category: "language" },
  ex: { name: "Elixir", category: "language" },
  exs: { name: "Elixir", category: "language" },
  hs: { name: "Haskell", category: "language" },
  clj: { name: "Clojure", category: "language" },
};

// Patterns checked against each file path in the tree
const SPECIAL_FILE_PATTERNS: Array<{ test: (p: string) => boolean; badge: TechBadge }> = [
  {
    test: (p) => /^Dockerfile(\.[a-z]+)?$/.test(p) || /\/Dockerfile(\.[a-z]+)?$/.test(p),
    badge: { name: "Docker", category: "tool" },
  },
  {
    test: (p) => /docker-compose\.ya?ml$/.test(p),
    badge: { name: "Docker Compose", category: "tool" },
  },
  {
    test: (p) => p.startsWith(".github/workflows/") && /\.ya?ml$/.test(p),
    badge: { name: "GitHub Actions", category: "tool" },
  },
  {
    test: (p) => /\/(k8s|kubernetes)\//.test(p) || p.startsWith("k8s/") || p.startsWith("kubernetes/"),
    badge: { name: "Kubernetes", category: "tool" },
  },
  {
    test: (p) => p.endsWith(".tf"),
    badge: { name: "Terraform", category: "tool" },
  },
];

function detectLanguagesFromTree(files: string[]): TechBadge[] {
  const counts: Record<string, number> = {};
  for (const file of files) {
    // Only consider files that actually have an extension (contain a ".")
    if (!file.includes(".")) continue;
    const ext = file.split(".").pop()?.toLowerCase();
    if (ext && EXTENSION_LANGUAGE_MAP[ext]) {
      const name = EXTENSION_LANGUAGE_MAP[ext].name;
      counts[name] = (counts[name] ?? 0) + 1;
    }
  }
  return Object.entries(counts)
    .filter(([, n]) => n >= 2)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([name]) => {
      const key = Object.keys(EXTENSION_LANGUAGE_MAP).find(
        (k) => EXTENSION_LANGUAGE_MAP[k].name === name
      )!;
      return EXTENSION_LANGUAGE_MAP[key];
    });
}

function detectSpecialFiles(files: string[]): TechBadge[] {
  const badges: TechBadge[] = [];
  const seen = new Set<string>();
  for (const file of files) {
    for (const { test, badge } of SPECIAL_FILE_PATTERNS) {
      if (test(file) && !seen.has(badge.name)) {
        badges.push(badge);
        seen.add(badge.name);
      }
    }
  }
  return badges;
}

async function parsePackageJson(owner: string, repo: string): Promise<TechBadge[]> {
  try {
    const data = (await githubFetch(
      `/repos/${owner}/${repo}/contents/package.json`
    )) as { content?: string };
    const content = decodeBase64Content(data.content ?? "");
    const pkg = JSON.parse(content) as {
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
      peerDependencies?: Record<string, string>;
    };
    const allDeps = {
      ...pkg.dependencies,
      ...pkg.devDependencies,
      ...pkg.peerDependencies,
    };
    const badges: TechBadge[] = [];
    const seen = new Set<string>();
    for (const dep of Object.keys(allDeps)) {
      const badge = PACKAGE_JSON_TECH_MAP[dep];
      if (badge && !seen.has(badge.name)) {
        badges.push(badge);
        seen.add(badge.name);
      }
    }
    return badges;
  } catch {
    return [];
  }
}

async function parsePythonDeps(
  owner: string,
  repo: string,
  files: string[]
): Promise<TechBadge[]> {
  let content = "";

  if (files.includes("requirements.txt")) {
    try {
      const data = (await githubFetch(
        `/repos/${owner}/${repo}/contents/requirements.txt`
      )) as { content?: string };
      content = decodeBase64Content(data.content ?? "");
    } catch { /* ignore */ }
  }

  if (!content && files.some((f) => f === "pyproject.toml")) {
    try {
      const data = (await githubFetch(
        `/repos/${owner}/${repo}/contents/pyproject.toml`
      )) as { content?: string };
      content = decodeBase64Content(data.content ?? "");
    } catch { /* ignore */ }
  }

  if (!content) return [];

  const badges: TechBadge[] = [];
  const seen = new Set<string>();
  const lower = content.toLowerCase();
  for (const [key, badge] of Object.entries(PYTHON_TECH_MAP)) {
    if (lower.includes(key) && !seen.has(badge.name)) {
      badges.push(badge);
      seen.add(badge.name);
    }
  }
  return badges;
}

async function detectTechStack(
  owner: string,
  repo: string,
  files: string[],
  primaryLanguage: string | null
): Promise<TechBadge[]> {
  const seen = new Set<string>();
  const all: TechBadge[] = [];

  function add(badge: TechBadge) {
    if (!seen.has(badge.name)) {
      all.push(badge);
      seen.add(badge.name);
    }
  }

  // Primary language from GitHub metadata (most reliable)
  if (primaryLanguage) {
    add({ name: primaryLanguage, category: "language" });
  }

  // Additional languages detected from file extensions
  for (const b of detectLanguagesFromTree(files)) add(b);

  // DevOps / tooling from special file names
  for (const b of detectSpecialFiles(files)) add(b);

  // Parse root-level manifest files in parallel
  const manifestPromises: Promise<TechBadge[]>[] = [];
  if (files.includes("package.json")) {
    manifestPromises.push(parsePackageJson(owner, repo));
  }
  if (
    primaryLanguage === "Python" ||
    files.some((f) => f.endsWith(".py"))
  ) {
    manifestPromises.push(parsePythonDeps(owner, repo, files));
  }

  const manifestResults = await Promise.allSettled(manifestPromises);
  for (const result of manifestResults) {
    if (result.status === "fulfilled") {
      for (const b of result.value) add(b);
    }
  }

  return all;
}

// ─── Summary helpers ──────────────────────────────────────────────────────────

function extractSummaryFromReadme(content: string, maxLength: number): string {
  const text = content
    .replace(/<\/?[a-zA-Z][^>]*>?/g, "")        // HTML tags (complete and incomplete)
    .replace(/!\[.*?\]\(.*?\)/g, "")              // images
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")   // links (keep label)
    .replace(/^#{1,6}\s+.+$/gm, "")            // headers
    .replace(/^[-*_]{3,}$/gm, "")              // horizontal rules
    .replace(/```[\s\S]*?```/g, "")            // fenced code blocks
    .replace(/`[^`]+`/g, "")                   // inline code
    .replace(/[*_]{1,3}([^*_\n]+)[*_]{1,3}/g, "$1") // bold / italic
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  if (!text) return "";
  if (text.length <= maxLength) return text;

  const cut = text.slice(0, maxLength);
  const lastSentence = Math.max(
    cut.lastIndexOf(". "),
    cut.lastIndexOf(".\n"),
    cut.lastIndexOf("! "),
    cut.lastIndexOf("? ")
  );
  if (lastSentence !== -1 && lastSentence > maxLength * 0.5) {
    return cut.slice(0, lastSentence + 1).trim();
  }
  return cut.trim() + "…";
}

function generateFallbackSummary(
  repo: GitHubRepo,
  techStack: TechBadge[]
): string {
  let summary = repo.description
    ? `${repo.description}.`
    : `${repo.name} is an open-source project hosted on GitHub.`;

  const languages = techStack
    .filter((t) => t.category === "language")
    .slice(0, 2)
    .map((t) => t.name);
  const frameworks = techStack
    .filter((t) => t.category === "framework")
    .slice(0, 3)
    .map((t) => t.name);
  const techParts = [...languages, ...frameworks].join(", ");
  if (techParts) summary += ` Built with ${techParts}.`;

  if (repo.topics?.length > 0) {
    summary += ` Topics: ${repo.topics.slice(0, 5).join(", ")}.`;
  }
  return summary;
}

function generateContributionSuggestions(
  techStack: TechBadge[],
  repo: GitHubRepo
): string[] {
  const suggestions = [
    "Improve documentation and add more code examples",
    "Add or improve unit tests for better coverage",
    "Fix typos and improve error messages",
  ];
  if (techStack.some((t) => t.name === "TypeScript")) {
    suggestions.push("Add TypeScript type definitions where missing");
  }
  if (techStack.some((t) => t.name === "Python")) {
    suggestions.push("Add Python type hints for better code clarity");
  }
  if (!techStack.some((t) => t.category === "testing")) {
    suggestions.push("Set up a testing framework and write initial tests");
  }
  if (repo.open_issues_count > 0) {
    suggestions.push(
      `Triage and label the ${repo.open_issues_count} open issue${repo.open_issues_count > 1 ? "s" : ""}`
    );
  }
  return suggestions.slice(0, 5);
}

function generateTags(repo: GitHubRepo, techStack: TechBadge[]): string[] {
  const tags: string[] = [...(repo.topics ?? []).slice(0, 3)];
  if (!isActiveRepo(repo.pushed_at)) tags.push("low-activity");
  else if (repo.stargazers_count > 1000) tags.push("popular");
  if (repo.open_issues_count > 0) tags.push("has-open-issues");
  if (techStack.some((t) => t.category === "testing")) tags.push("tested");
  return [...new Set(tags)].slice(0, 5);
}

// ─── Main export ─────────────────────────────────────────────────────────────

export async function analyzeRepo(repoUrl: string): Promise<AnalysisResult> {
  const parsed = parseGitHubUrl(repoUrl);
  if (!parsed) {
    throw new Error(
      "Invalid GitHub URL. Please use format: https://github.com/owner/repo"
    );
  }
  const { owner, repo } = parsed;

  // Repo metadata — fetch first; errors bubble up immediately
  const repoData = (await githubFetch(`/repos/${owner}/${repo}`)) as GitHubRepo;

  // Parallel API calls
  const since30Days = thirtyDaysAgo();
  const [treeResult, readmeResult, commitsResult, contributorsResult, issuesResult] =
    await Promise.allSettled([
      githubFetch(
        `/repos/${owner}/${repo}/git/trees/${repoData.default_branch}?recursive=1`
      ),
      githubFetch(`/repos/${owner}/${repo}/readme`),
      githubFetch(
        `/repos/${owner}/${repo}/commits?per_page=30&since=${since30Days}`
      ),
      githubFetch(`/repos/${owner}/${repo}/contributors?per_page=5`),
      githubFetch(
        `/repos/${owner}/${repo}/issues?labels=good+first+issue&state=open&per_page=5`
      ),
    ]);

  // File list from repo tree
  const files: string[] =
    treeResult.status === "fulfilled"
      ? (
          (treeResult.value as { tree: GitHubTreeItem[] }).tree ?? []
        )
          .filter((item) => item.type === "blob")
          .map((item) => item.path)
      : [];

  // Tech stack (may fetch additional manifest files)
  const techStack = await detectTechStack(owner, repo, files, repoData.language);

  // Summary from README → fallback to generated text
  let summary = "";
  if (readmeResult.status === "fulfilled") {
    const raw = decodeBase64Content(
      ((readmeResult.value as { content?: string }).content) ?? ""
    );
    summary = extractSummaryFromReadme(raw, 700);
  }
  if (!summary) {
    summary = generateFallbackSummary(repoData, techStack);
  }

  // Commit activity
  const commits = commitsResult.status === "fulfilled"
    ? (commitsResult.value as unknown[])
    : [];
  const commitActivity: CommitActivity = {
    lastCommitDate: repoData.pushed_at,
    commitCount30Days: commits.length,
    isActive: isActiveRepo(repoData.pushed_at),
  };

  // Top contributors
  const contributorsData: GitHubContributor[] =
    contributorsResult.status === "fulfilled" && Array.isArray(contributorsResult.value)
      ? (contributorsResult.value as GitHubContributor[])
      : [];
  const contributors: Contributor[] = contributorsData.slice(0, 5).map((c) => ({
    login: c.login,
    avatarUrl: c.avatar_url,
    contributions: c.contributions,
    profileUrl: c.html_url,
  }));

  // Good first issues — real labels preferred, fallback to generated suggestions
  const issuesData: GitHubIssue[] =
    issuesResult.status === "fulfilled" && Array.isArray(issuesResult.value)
      ? (issuesResult.value as GitHubIssue[])
      : [];
  const goodFirstIssues =
    issuesData.length > 0
      ? issuesData.map((i) => i.title)
      : generateContributionSuggestions(techStack, repoData);

  return {
    repoName: repoData.name,
    owner,
    description: repoData.description ?? "",
    summary,
    language: repoData.language ?? "Unknown",
    stars: repoData.stargazers_count,
    forks: repoData.forks_count,
    openIssues: repoData.open_issues_count,
    goodFirstIssues,
    tags: generateTags(repoData, techStack),
    techStack,
    contributors,
    commitActivity,
    repoUrl: repoData.html_url,
  };
}
