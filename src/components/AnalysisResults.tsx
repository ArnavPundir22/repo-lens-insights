/**
 * AnalysisResults — Displays the full deep-repository analysis
 *
 * Sections:
 *  1. Repo header (name, stars, forks, open issues, primary language)
 *  2. Tags
 *  3. Tech stack badges
 *  4. README-derived summary
 *  5. Contributor activity & top contributors
 *  6. Beginner-friendly contribution ideas
 */

import { BookOpen, Star, Code2, Lightbulb, GitFork, CircleDot, ExternalLink } from "lucide-react";
import type { AnalysisResult } from "@/lib/analyze";
import TechStackBadges from "./TechStackBadges";
import ContributorInsights from "./ContributorInsights";

interface AnalysisResultsProps {
  result: AnalysisResult;
}

const AnalysisResults = ({ result }: AnalysisResultsProps) => {
  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 reveal">
      {/* Repo header */}
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
          <Code2 className="w-5 h-5 text-primary" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-xl font-semibold text-foreground leading-tight">
              {result.owner}/{result.repoName}
            </h2>
            <a
              href={result.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors duration-200"
              aria-label="Open on GitHub"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
          {result.description && (
            <p className="text-sm text-muted-foreground mt-1 leading-snug">
              {result.description}
            </p>
          )}
          <div className="flex items-center flex-wrap gap-3 mt-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5" />
              {result.stars.toLocaleString()}
            </span>
            <span className="flex items-center gap-1">
              <GitFork className="w-3.5 h-3.5" />
              {result.forks.toLocaleString()}
            </span>
            {result.openIssues > 0 && (
              <span className="flex items-center gap-1">
                <CircleDot className="w-3.5 h-3.5" />
                {result.openIssues.toLocaleString()} open
              </span>
            )}
            <span>{result.language}</span>
          </div>
        </div>
      </div>

      {/* Tags */}
      {result.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {result.tags.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-1 rounded-md bg-tag-bg text-tag-text text-xs font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Tech stack */}
      <TechStackBadges techStack={result.techStack} />

      {/* Summary card */}
      <div className="rounded-xl border border-border bg-surface-elevated p-5 reveal reveal-delay-1">
        <div className="flex items-center gap-2 mb-3">
          <BookOpen className="w-4 h-4 text-primary" />
          <h3 className="font-medium text-sm text-foreground">Summary</h3>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
          {result.summary}
        </p>
      </div>

      {/* Activity & contributors */}
      <ContributorInsights
        commitActivity={result.commitActivity}
        contributors={result.contributors}
      />

      {/* Good first issues */}
      <div className="rounded-xl border border-border bg-surface-elevated p-5 reveal reveal-delay-2">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="w-4 h-4 text-primary" />
          <h3 className="font-medium text-sm text-foreground">
            Beginner-Friendly Contributions
          </h3>
        </div>
        <ul className="space-y-3">
          {result.goodFirstIssues.map((issue, index) => (
            <li
              key={index}
              className="flex items-start gap-3 text-sm text-muted-foreground group"
            >
              <span className="w-5 h-5 rounded-full bg-tag-bg text-tag-text text-xs font-medium flex items-center justify-center shrink-0 mt-0.5">
                {index + 1}
              </span>
              <span className="group-hover:text-foreground transition-colors duration-200">
                {issue}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AnalysisResults;
