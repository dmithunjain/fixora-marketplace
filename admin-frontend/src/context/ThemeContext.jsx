import React, { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check localStorage first, then check system preference
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setIsDark(savedTheme === "dark");
    } else {
      // Use system preference
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setIsDark(prefersDark);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark ? "dark" : "light";
    setIsDark(!isDark);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  useEffect(() => {
    const theme = isDark ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", theme);
  }, [isDark]);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
};
