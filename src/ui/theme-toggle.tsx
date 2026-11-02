import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

type ThemeToggleProps = {
  className?: string;
};

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={isDark}
      className={cn(
        "inline-flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full",
        "border border-folio-ink/25 text-folio-ink",
        "hover:bg-folio-ink hover:text-folio-surface",
        "transition-all duration-300",
        className
      )}
    >
      {isDark ? (
        <Sun className="h-3.5 w-3.5 sm:h-4 sm:w-4" strokeWidth={1.75} />
      ) : (
        <Moon className="h-3.5 w-3.5 sm:h-4 sm:w-4" strokeWidth={1.75} />
      )}
    </button>
  );
}
