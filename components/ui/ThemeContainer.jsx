"use client";

export default function ThemeContainer() {
  if (typeof window !== "undefined") {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches)
      document.documentElement.classList.add("dark");
  }
}
