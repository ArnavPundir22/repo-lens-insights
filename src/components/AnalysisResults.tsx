/**
 * AnalysisResults — Displays the AI-generated repo summary
 *
 * Shows the repo summary, metadata tags, and beginner-friendly issues.
 *
 * TODO: Add copy-to-clipboard for individual issues
 * TODO: Add link to actual GitHub issues
 * TODO: Add "share results" functionality
 */

import { BookOpen, Star, Code2, Lightbulb } from "lucide-react";
import type { AnalysisResult } from "@/lib/analyze";

interface AnalysisResultsProps {
  result: AnalysisResult;
}

const AnalysisResults = ({ result }: AnalysisResultsProps) => {
  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 reveal">
      {/* Repo header */}
      <div className="flex items-start gap-3 reveal">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
          <Code2 className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground leading-tight">
            {result.owner}/{result.repoName}
          </h2>
          <div className="flex items-center gap-3 mt-1.5 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5" />
              {result.stars.toLocaleString()}
            </span>
            <span>{result.language}</span>
          </div>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 reveal reveal-delay-1">
        {result.tags.map((tag) => (
          <span
            key={tag}
            className="px-2.5 py-1 rounded-md bg-tag-bg text-tag-text text-xs font-medium"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Summary card */}
      <div className="rounded-xl border border-border bg-surface-elevated p-5 reveal reveal-delay-1">
        <div className="flex items-center gap-2 mb-3">
          <BookOpen className="w-4 h-4 text-primary" />
          <h3 className="font-medium text-sm text-foreground">Summary</h3>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {result.summary}
        </p>
      </div>

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

      {/* TODO: Add section for detailed file analysis */}
      {/* TODO: Add section for dependency overview */}
    </div>
  );
};

export default AnalysisResults;
