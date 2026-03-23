/**
 * Header — Simple navigation bar for RepoLens AI
 *
 * TODO: Add mobile responsive menu
 * TODO: Add link to GitHub repo
 */

import { Search } from "lucide-react";

const Header = () => {
  return (
    <header className="border-b border-border bg-surface-elevated/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between h-14 px-4">
        {/* Logo / Brand */}
        <div className="flex items-center gap-2">
          <Search className="w-5 h-5 text-primary" />
          <span className="font-semibold text-lg tracking-tight text-foreground">
            RepoLens <span className="text-primary">AI</span>
          </span>
        </div>

        {/* TODO: Add navigation links here */}
        <nav className="flex items-center gap-6 text-sm text-muted-foreground">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors duration-200"
          >
            GitHub
          </a>
          {/* TODO: Add docs link */}
        </nav>
      </div>
    </header>
  );
};

export default Header;
