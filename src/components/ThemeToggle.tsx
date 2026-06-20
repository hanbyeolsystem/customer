"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Icon } from "./Icon";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <button
      type="button"
      aria-label="다크모드 전환"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-[var(--line)] text-[var(--ink)] hover:bg-[var(--panel)] transition"
    >
      <span suppressHydrationWarning className="inline-flex">
        <Icon name={isDark ? "sun" : "moon"} className="w-[18px] h-[18px]" strokeWidth={2} />
      </span>
    </button>
  );
}
