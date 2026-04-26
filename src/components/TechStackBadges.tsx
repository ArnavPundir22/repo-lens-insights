/**
 * TechStackBadges — Displays detected technologies as colored badges
 *
 * Each badge is colored by category:
 *  language → blue   |  framework → green  |  database → orange
 *  tool     → purple |  testing   → yellow
 */

import { Cpu } from "lucide-react";
import type { TechBadge, TechCategory } from "@/lib/analyze";

interface TechStackBadgesProps {
  techStack: TechBadge[];
}

// Inline styles so Tailwind's purge doesn't strip the colors
const CATEGORY_STYLE: Record<TechCategory, { background: string; color: string; border: string }> = {
  language:  { background: "#eff6ff", color: "#1e40af", border: "#bfdbfe" },
  framework: { background: "#f0fdf4", color: "#166534", border: "#bbf7d0" },
  database:  { background: "#fff7ed", color: "#9a3412", border: "#fed7aa" },
  tool:      { background: "#faf5ff", color: "#6b21a8", border: "#e9d5ff" },
  testing:   { background: "#fefce8", color: "#713f12", border: "#fef08a" },
};

const CATEGORY_LABEL: Record<TechCategory, string> = {
  language:  "Languages",
  framework: "Frameworks",
  database:  "Databases",
  tool:      "Tools",
  testing:   "Testing",
};

const CATEGORY_ORDER: TechCategory[] = [
  "language",
  "framework",
  "database",
  "tool",
  "testing",
];

const TechStackBadges = ({ techStack }: TechStackBadgesProps) => {
  if (techStack.length === 0) return null;

  // Group badges by category, preserving the order items were detected
  const grouped: Partial<Record<TechCategory, TechBadge[]>> = {};
  for (const badge of techStack) {
    if (!grouped[badge.category]) grouped[badge.category] = [];
    grouped[badge.category]!.push(badge);
  }

  const presentCategories = CATEGORY_ORDER.filter((c) => grouped[c]?.length);

  return (
    <div className="rounded-xl border border-border bg-surface-elevated p-5 reveal reveal-delay-1">
      <div className="flex items-center gap-2 mb-4">
        <Cpu className="w-4 h-4 text-primary" />
        <h3 className="font-medium text-sm text-foreground">Tech Stack</h3>
      </div>

      <div className="space-y-3">
        {presentCategories.map((category) => (
          <div key={category} className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-muted-foreground w-20 shrink-0">
              {CATEGORY_LABEL[category]}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {grouped[category]!.map((badge) => (
                <span
                  key={badge.name}
                  style={CATEGORY_STYLE[badge.category]}
                  className="px-2.5 py-0.5 rounded-full text-xs font-medium border"
                >
                  {badge.name}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TechStackBadges;
