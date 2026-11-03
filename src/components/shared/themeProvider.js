"use client";

import { createContext, useContext, useEffect, useMemo, useSyncExternalStore } from "react";

const themes = {
  light: {
    "--color-page": "#ffffff",
    "--color-page-soft": "#f4f7fb",
    "--color-surface": "#ffffff",
    "--color-surface-raised": "rgba(255, 255, 255, 0.9)",
    "--color-surface-glass": "rgba(244, 247, 251, 0.55)",
    "--color-table-surface": "rgba(255, 255, 255, 0.9)",
    "--color-text": "#071827",
    "--color-text-muted": "#27384a",
    "--color-text-soft": "#617084",
    "--color-border": "#d7dde6",
    "--color-border-strong": "#b7c2d1",
    "--color-primary": "#075fd8",
    "--color-primary-strong": "#034daf",
    "--color-primary-soft": "#dceaff",
    "--color-accent": "#1581ff",
    "--color-accent-red": "#ed1c24",
    "--color-accent-red-soft": "#fff0f0",
    "--color-accent-green": "#13884a",
    "--color-accent-green-soft": "#eefaf3",
    "--color-shadow": "rgba(10, 26, 43, 0.16)",
    "--color-hero-overlay": "rgba(255, 255, 255, 0.72)",
    "--color-hero-fade": "rgba(255, 255, 255, 0.96)",
    "--color-navbar": "rgba(255, 255, 255, 0.96)",
    "--color-glass-border": "rgba(0, 0, 0, 0.1)",
    "--color-glass-shadow": "rgba(0, 0, 0, 0.06)",
    "--color-chrome": "#a9bdd8",
    "--color-chrome-strong": "#6f8fbf",
    "--color-chrome-bright": "#075fd8",
    "--color-chrome-soft": "rgba(7, 95, 216, 0.1)",
    "--color-cta-bg": "#075fd8",
    "--color-cta-text": "#ffffff",
    "--color-btn-hover": "rgba(0, 0, 0, 0.15)",
    "--color-btn-hover-text": "#ffffff",
    // Variant page palette (navy + blue, from the variant reference designs).
    "--color-v-page": "#ffffff",
    "--color-v-band": "#f4f7fc",
    "--color-v-panel": "#ffffff",
    "--color-v-panel-soft": "#f2f6fd",
    "--color-v-border": "#dce3ee",
    "--color-v-border-strong": "#c5d1e4",
    "--color-v-navy": "#0a1c4b",
    "--color-v-navy-line": "rgba(255, 255, 255, 0.18)",
    "--color-v-tile": "#0b2466",
    "--color-v-blue": "#0a4bd1",
    "--color-v-blue-btn": "#0a47c9",
    "--color-v-blue-soft": "#e9f0fc",
    "--color-v-text": "#0a1630",
    "--color-v-muted": "#364258",
    "--color-v-soft": "#68758b",
    "--color-v-green": "#16834a",
    "--color-v-green-btn": "#1b8a4c",
    "--color-v-green-soft": "#f1faf4",
    "--color-v-red": "#d7272f",
    "--color-v-red-soft": "#fff4f4",
    "--color-v-orange": "#ee7b0e",
    "--color-v-yellow": "#f2b200",
    "--color-v-star-green": "#1c9a52",
    "--color-v-star-amber": "#f4a51c",
    "--color-v-shadow": "rgba(16, 36, 80, 0.08)",
    "--color-v-banner": "#0a1a42",
    "--color-v-map-1": "#dfe7f7",
    "--color-v-map-2": "#b9c9ec",
    "--color-v-map-3": "#8aa5e0",
    "--color-v-map-4": "#3f6fde",
    "--color-v-map-5": "#0c2f9e",
  },
  dark: {
    "--color-page": "#02070b",
    "--color-page-soft": "#07121d",
    "--color-surface": "#0a1520",
    "--color-surface-raised": "rgba(10, 21, 32, 0.88)",
    "--color-surface-glass": "rgba(9, 21, 33, 0.5)",
    "--color-table-surface": "rgba(14, 28, 51, 0.96)",
    "--color-text": "#f6f8fb",
    "--color-text-muted": "#d7dce3",
    "--color-text-soft": "#9da8b5",
    "--color-border": "#223343",
    "--color-border-strong": "#375067",
    "--color-primary": "#0b67dc",
    "--color-primary-strong": "#054aa9",
    "--color-primary-soft": "#0c2748",
    "--color-accent": "#2484ff",
    "--color-accent-red": "#ff2d35",
    "--color-accent-red-soft": "rgba(255, 45, 53, 0.15)",
    "--color-accent-green": "#3dd68c",
    "--color-accent-green-soft": "rgba(24, 148, 84, 0.16)",
    "--color-shadow": "rgba(0, 0, 0, 0.5)",
    "--color-hero-overlay": "rgba(2, 7, 11, 0.74)",
    "--color-hero-fade": "rgba(2, 7, 11, 0.97)",
    "--color-navbar": "rgba(2, 7, 11, 0.92)",
    "--color-glass-border": "rgba(255, 255, 255, 0.15)",
    "--color-glass-shadow": "rgba(0, 0, 0, 0.35)",
    "--color-chrome": "#3c5a82",
    "--color-chrome-strong": "#8fb4ea",
    "--color-chrome-bright": "#4f9bff",
    "--color-chrome-soft": "rgba(79, 155, 255, 0.14)",
    "--color-cta-bg": "#0b67dc",
    "--color-cta-text": "#ffffff",
    "--color-btn-hover": "rgba(0, 0, 0, 0.2)",
    "--color-btn-hover-text": "#ffffff",
    "--color-v-page": "#050b17",
    "--color-v-band": "#060e1f",
    "--color-v-panel": "#0a1429",
    "--color-v-panel-soft": "#0d1a33",
    "--color-v-border": "#1c2a45",
    "--color-v-border-strong": "#2b3d60",
    "--color-v-navy": "#0d1b3a",
    "--color-v-navy-line": "rgba(255, 255, 255, 0.12)",
    "--color-v-tile": "#14307a",
    "--color-v-blue": "#4b8cf7",
    "--color-v-blue-btn": "#1a4fd6",
    "--color-v-blue-soft": "rgba(75, 140, 247, 0.14)",
    "--color-v-text": "#f2f5fa",
    "--color-v-muted": "#c4cddc",
    "--color-v-soft": "#8e9aaf",
    "--color-v-green": "#2fbf6a",
    "--color-v-green-btn": "#17803f",
    "--color-v-green-soft": "rgba(47, 191, 106, 0.08)",
    "--color-v-red": "#f0555a",
    "--color-v-red-soft": "rgba(240, 85, 90, 0.08)",
    "--color-v-orange": "#f28a1e",
    "--color-v-yellow": "#f5b80b",
    "--color-v-star-green": "#25b05f",
    "--color-v-star-amber": "#f5a524",
    "--color-v-shadow": "rgba(0, 0, 0, 0.35)",
    "--color-v-banner": "#0a1736",
    "--color-v-map-1": "#1a2a4d",
    "--color-v-map-2": "#253f78",
    "--color-v-map-3": "#3a5fb0",
    "--color-v-map-4": "#3f7ae8",
    "--color-v-map-5": "#7aa6ff",
  },
};

const ThemeContext = createContext(null);

function getStoredTheme() {
  if (typeof window === "undefined") {
    return "light";
  }

  const storedTheme = window.localStorage.getItem("site-theme");
  if (storedTheme === "light" || storedTheme === "dark") {
    return storedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function subscribeToThemeChange(callback) {
  window.addEventListener("storage", callback);
  window.addEventListener("site-theme-change", callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("site-theme-change", callback);
  };
}

function saveTheme(theme) {
  window.localStorage.setItem("site-theme", theme);
  window.dispatchEvent(new Event("site-theme-change"));
}

export function ThemeProvider({ children }) {
  const theme = useSyncExternalStore(subscribeToThemeChange, getStoredTheme, () => "light");

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const value = useMemo(
    () => ({
      theme,
      setTheme: saveTheme,
      toggleTheme: () => saveTheme(theme === "dark" ? "light" : "dark"),
    }),
    [theme],
  );

  return (
    <ThemeContext.Provider value={value}>
      <div style={themes[theme]}>{children}</div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }

  return context;
}
