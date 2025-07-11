import { useEffect, useState } from "react";

type Theme = "light" | "dark";

export const usePreferredTheme = () => {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    // Function to update theme based on system preference
    const updateTheme = () => {
      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const newTheme: Theme = isDark ? "dark" : "light";
      setTheme(newTheme);

      // Set data-theme attribute on html element
      const html = document.documentElement;
      html.setAttribute("data-theme", newTheme);
    };

    // Only run on client side
    if (typeof window !== "undefined") {
      // Set initial theme
      updateTheme();

      // Listen for theme changes
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      mediaQuery.addEventListener("change", updateTheme);

      // Cleanup
      return () => {
        mediaQuery.removeEventListener("change", updateTheme);
      };
    }
  }, []);

  return theme;
};
