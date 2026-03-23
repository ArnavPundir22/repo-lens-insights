/**
 * AnalyzeForm — Input form for GitHub repository URL
 *
 * Accepts a GitHub URL and triggers the analysis.
 * 
 * TODO: Add URL validation with visual feedback
 * TODO: Add recent searches history
 * TODO: Add paste-from-clipboard button
 */

import { useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";

interface AnalyzeFormProps {
  onAnalyze: (url: string) => void;
  isLoading: boolean;
}

const AnalyzeForm = ({ onAnalyze, isLoading }: AnalyzeFormProps) => {
  const [url, setUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onAnalyze(url.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="flex flex-col sm:flex-row gap-3">
        {/* URL Input */}
        <div className="flex-1 relative">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://github.com/owner/repo"
            className="w-full h-12 px-4 rounded-lg border border-input bg-surface-elevated text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/40 transition-shadow duration-200 font-mono text-sm"
            disabled={isLoading}
            required
          />
        </div>

        {/* Analyze Button */}
        <button
          type="submit"
          disabled={isLoading || !url.trim()}
          className="h-12 px-6 rounded-lg bg-primary text-primary-foreground font-medium text-sm flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.97] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Analyzing…
            </>
          ) : (
            <>
              Analyze
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>

      {/* Helper text */}
      <p className="text-xs text-muted-foreground mt-3 text-center">
        Paste any public GitHub repository URL to get started
      </p>
    </form>
  );
};

export default AnalyzeForm;
