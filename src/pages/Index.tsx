/**
 * Index Page — Main page for RepoLens AI
 *
 * This is the entry point of the application.
 * Users paste a GitHub URL and receive an AI-generated analysis.
 *
 * TODO: Add error toast notifications
 * TODO: Add history of analyzed repos
 * TODO: Add sharing functionality
 */

import { useState } from "react";
import Header from "@/components/Header";
import AnalyzeForm from "@/components/AnalyzeForm";
import AnalysisResults from "@/components/AnalysisResults";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import { analyzeRepo, type AnalysisResult } from "@/lib/analyze";

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  /**
   * Handles the analysis request.
   * TODO: Add proper error handling with user-friendly messages
   */
  const handleAnalyze = async (url: string) => {
    setIsLoading(true);
    setResult(null);
    setError(null);

    try {
      const analysis = await analyzeRepo(url);
      setResult(analysis);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-16 sm:py-24">
        {/* Hero Section */}
        <div className="text-center mb-12 reveal">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground leading-tight mb-3" style={{ lineHeight: '1.1' }}>
            Understand any repo
            <br />
            <span className="text-primary">in seconds</span>
          </h1>
          <p className="text-muted-foreground text-base max-w-md mx-auto leading-relaxed">
            Paste a GitHub URL and get an AI-powered summary with beginner-friendly contribution suggestions.
          </p>
        </div>

        {/* Form */}
        <div className="mb-12 reveal reveal-delay-1">
          <AnalyzeForm onAnalyze={handleAnalyze} isLoading={isLoading} />
        </div>

        {/* Error message */}
        {error && (
          <div className="w-full max-w-2xl mx-auto mb-8 reveal">
            <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
              {error}
            </div>
          </div>
        )}

        {/* Loading state */}
        {isLoading && <LoadingSkeleton />}

        {/* Results */}
        {result && !isLoading && <AnalysisResults result={result} />}

        {/* Empty state — shown before first analysis */}
        {!result && !isLoading && !error && (
          <div className="text-center text-muted-foreground text-sm mt-16 reveal reveal-delay-2">
            <p>Try analyzing a popular repo like</p>
            <button
              onClick={() => handleAnalyze("https://github.com/facebook/react")}
              className="font-mono text-primary hover:underline mt-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded active:scale-[0.97] transition-transform"
            >
              github.com/facebook/react
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        <p>
          RepoLens AI — Open source &amp; beginner-friendly.{" "}
          {/* TODO: Link to actual GitHub repo */}
          <a href="#" className="text-primary hover:underline">
            Contribute on GitHub
          </a>
        </p>
      </footer>
    </div>
  );
};

export default Index;
