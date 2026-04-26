/**
 * ContributorInsights — Commit activity and top contributor display
 *
 * Shows:
 *  - Active / stale repository status
 *  - Time since last commit
 *  - Number of commits in the last 30 days
 *  - Top contributors with avatars and contribution counts
 */

import { Users, GitCommitHorizontal, Clock, Zap, AlertCircle } from "lucide-react";
import type { CommitActivity, Contributor } from "@/lib/analyze";

interface ContributorInsightsProps {
  commitActivity: CommitActivity;
  contributors: Contributor[];
}

function formatDate(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "today";
  if (diffDays === 1) return "yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? "s" : ""} ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) > 1 ? "s" : ""} ago`;
  return `${Math.floor(diffDays / 365)} year${Math.floor(diffDays / 365) > 1 ? "s" : ""} ago`;
}

const ContributorInsights = ({ commitActivity, contributors }: ContributorInsightsProps) => {
  const { isActive, lastCommitDate, commitCount30Days } = commitActivity;

  return (
    <div className="rounded-xl border border-border bg-surface-elevated p-5 space-y-5 reveal reveal-delay-2">
      {/* Section header */}
      <div className="flex items-center gap-2">
        <Users className="w-4 h-4 text-primary" />
        <h3 className="font-medium text-sm text-foreground">Activity &amp; Contributors</h3>
      </div>

      {/* Commit activity row */}
      <div className="flex flex-wrap gap-4">
        {/* Active / stale badge */}
        <div className="flex items-center gap-2">
          {isActive ? (
            <Zap className="w-4 h-4 text-green-600" />
          ) : (
            <AlertCircle className="w-4 h-4 text-amber-500" />
          )}
          <span
            className="text-xs font-medium px-2 py-0.5 rounded-full"
            style={
              isActive
                ? { background: "#f0fdf4", color: "#166534", border: "1px solid #bbf7d0" }
                : { background: "#fffbeb", color: "#92400e", border: "1px solid #fde68a" }
            }
          >
            {isActive ? "Active" : "Low activity"}
          </span>
        </div>

        {/* Last commit */}
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock className="w-3.5 h-3.5" />
          <span>Last commit {formatDate(lastCommitDate)}</span>
        </div>

        {/* 30-day commits */}
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <GitCommitHorizontal className="w-3.5 h-3.5" />
          <span>
            {commitCount30Days === 0
              ? "No commits in the last 30 days"
              : `${commitCount30Days} commit${commitCount30Days > 1 ? "s" : ""} in the last 30 days`}
          </span>
        </div>
      </div>

      {/* Top contributors */}
      {contributors.length > 0 && (
        <div>
          <p className="text-xs text-muted-foreground mb-3">Top contributors</p>
          <div className="flex flex-wrap gap-3">
            {contributors.map((contributor) => (
              <a
                key={contributor.login}
                href={contributor.profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 group"
                title={`${contributor.login} — ${contributor.contributions} contributions`}
              >
                <img
                  src={`${contributor.avatarUrl}&s=40`}
                  alt={contributor.login}
                  className="w-7 h-7 rounded-full border border-border group-hover:border-primary transition-colors duration-200"
                  loading="lazy"
                />
                <div className="hidden sm:block">
                  <p className="text-xs font-medium text-foreground group-hover:text-primary transition-colors duration-200 leading-none">
                    {contributor.login}
                  </p>
                  <p className="text-xs text-muted-foreground leading-none mt-0.5">
                    {contributor.contributions.toLocaleString()} commits
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ContributorInsights;
