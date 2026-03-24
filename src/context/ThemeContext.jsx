import React, { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("gesturehub-theme");
      if (saved) return saved === "dark";
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.setAttribute("data-theme", "dark");
      localStorage.setItem("gesturehub-theme", "dark");
    } else {
      root.setAttribute("data-theme", "light");
      localStorage.setItem("gesturehub-theme", "light");
    }
  }, [isDark]);

  const toggle = () => setIsDark(prev => !prev);

  // Also expose old names for backward compatibility with App.jsx FloatingControls
  return (
    <ThemeContext.Provider value={{ isDark, toggle, isDarkMode: isDark, toggleDarkMode: toggle }}>
      {children}
    </ThemeContext.Provider>
  );
};
