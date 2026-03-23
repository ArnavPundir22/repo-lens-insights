/**
 * analyzeRepo — Mock AI analysis function
 *
 * This simulates what the AI backend would return.
 * In a real setup, this would call a FastAPI endpoint.
 *
 * TODO: Replace with actual API call to backend
 * TODO: Add error handling for invalid URLs
 * TODO: Add caching to avoid re-analyzing the same repo
 */

export interface AnalysisResult {
  repoName: string;
  owner: string;
  summary: string;
  language: string;
  stars: number;
  goodFirstIssues: string[];
  tags: string[];
}

/**
 * Parses a GitHub URL to extract owner and repo name.
 * TODO: Handle edge cases like trailing slashes, .git suffix, etc.
 */
function parseGitHubUrl(url: string): { owner: string; repo: string } | null {
  const match = url.match(/github\.com\/([^/]+)\/([^/]+)/);
  if (!match) return null;
  return { owner: match[1], repo: match[2].replace(/\.git$/, "") };
}

/**
 * Main analysis function — currently returns mock data.
 *
 * TODO: Integrate GitHub API to fetch real repo metadata
 * TODO: Add LLM integration for intelligent summarization
 * TODO: Use embeddings for deeper repo understanding
 */
export async function analyzeRepo(repoUrl: string): Promise<AnalysisResult> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1800));

  const parsed = parseGitHubUrl(repoUrl);
  if (!parsed) {
    throw new Error("Invalid GitHub URL. Please use format: https://github.com/owner/repo");
  }

  // TODO: Replace this mock data with real API responses
  return {
    repoName: parsed.repo,
    owner: parsed.owner,
    summary: `${parsed.repo} is a project by ${parsed.owner}. This repository appears to be actively maintained and welcomes contributions from developers of all experience levels. The codebase follows modern development practices and includes comprehensive documentation to help new contributors get started quickly.`,
    language: "TypeScript",
    stars: 1247,
    goodFirstIssues: [
      "Add input validation for edge cases in the URL parser",
      "Improve error messages to be more user-friendly",
      "Write unit tests for the analysis module",
      "Add a loading skeleton to the results section",
      "Update the README with better setup instructions",
    ],
    tags: ["open-source", "beginner-friendly", "well-documented"],
  };
}
