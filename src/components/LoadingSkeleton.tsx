/**
 * LoadingSkeleton — Placeholder UI while analysis is in progress
 *
 * Matches the layout of AnalysisResults: header, tags, tech stack,
 * summary, activity/contributors, and contribution ideas.
 */

const LoadingSkeleton = () => {
  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 reveal">
      {/* Header skeleton */}
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-muted animate-pulse shrink-0" />
        <div className="space-y-2 flex-1">
          <div className="h-5 w-48 bg-muted rounded-md animate-pulse" />
          <div className="h-3 w-64 bg-muted rounded-md animate-pulse" />
          <div className="h-3 w-32 bg-muted rounded-md animate-pulse" />
        </div>
      </div>

      {/* Tags skeleton */}
      <div className="flex gap-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-6 w-20 bg-muted rounded-md animate-pulse" />
        ))}
      </div>

      {/* Tech stack skeleton */}
      <div className="rounded-xl border border-border bg-surface-elevated p-5 space-y-3">
        <div className="h-4 w-24 bg-muted rounded-md animate-pulse" />
        {[1, 2].map((i) => (
          <div key={i} className="flex gap-2 items-center">
            <div className="h-3 w-20 bg-muted rounded-md animate-pulse shrink-0" />
            <div className="flex gap-1.5">
              {[1, 2, 3].map((j) => (
                <div key={j} className="h-5 w-16 bg-muted rounded-full animate-pulse" />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Summary skeleton */}
      <div className="rounded-xl border border-border bg-surface-elevated p-5 space-y-3">
        <div className="h-4 w-24 bg-muted rounded-md animate-pulse" />
        <div className="space-y-2">
          <div className="h-3 w-full bg-muted rounded-md animate-pulse" />
          <div className="h-3 w-5/6 bg-muted rounded-md animate-pulse" />
          <div className="h-3 w-4/6 bg-muted rounded-md animate-pulse" />
          <div className="h-3 w-full bg-muted rounded-md animate-pulse" />
          <div className="h-3 w-3/6 bg-muted rounded-md animate-pulse" />
        </div>
      </div>

      {/* Activity & contributors skeleton */}
      <div className="rounded-xl border border-border bg-surface-elevated p-5 space-y-4">
        <div className="h-4 w-40 bg-muted rounded-md animate-pulse" />
        <div className="flex gap-4">
          <div className="h-5 w-16 bg-muted rounded-full animate-pulse" />
          <div className="h-3 w-36 bg-muted rounded-md animate-pulse self-center" />
          <div className="h-3 w-44 bg-muted rounded-md animate-pulse self-center" />
        </div>
        <div className="flex gap-3 pt-1">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-muted animate-pulse shrink-0" />
              <div className="hidden sm:block space-y-1">
                <div className="h-3 w-16 bg-muted rounded-md animate-pulse" />
                <div className="h-2 w-12 bg-muted rounded-md animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Issues skeleton */}
      <div className="rounded-xl border border-border bg-surface-elevated p-5 space-y-4">
        <div className="h-4 w-48 bg-muted rounded-md animate-pulse" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-full bg-muted animate-pulse shrink-0" />
            <div className="h-3 flex-1 bg-muted rounded-md animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoadingSkeleton;
