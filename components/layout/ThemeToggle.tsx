"use client";

import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  function toggle() {
    const isDark = document.documentElement.classList.toggle("dark");
    try {
      localStorage.setItem("theme", isDark ? "dark" : "light");
    } catch {
      // Storage can be blocked; the toggle still works for this visit.
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Switch between light and dark theme"
      className="rounded p-2 text-muted transition-colors hover:text-fg"
    >
      <Moon className="h-[18px] w-[18px] dark:hidden" aria-hidden="true" />
      <Sun className="hidden h-[18px] w-[18px] dark:block" aria-hidden="true" />
    </button>
  );
}