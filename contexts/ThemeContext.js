import { createContext, useContext, useMemo, useState } from "react";

const themes = {
  light: {
    name: "Light",
    background: "#f4f7fb",
    card: "#ffffff",
    surface: "#eef4ff",
    text: "#172033",
    muted: "#637083",
    primary: "#2563eb",
    primaryText: "#ffffff",
    border: "#cbd5e1",
    danger: "#dc2626",
  },
  dark: {
    name: "Dark",
    background: "#111827",
    card: "#1f2937",
    surface: "#273449",
    text: "#f8fafc",
    muted: "#cbd5e1",
    primary: "#60a5fa",
    primaryText: "#111827",
    border: "#475569",
    danger: "#f87171",
  },
};

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [themeName, setThemeName] = useState("light");

  const value = useMemo(() => {
    const theme = themes[themeName];

    return {
      isDark: themeName === "dark",
      theme,
      themeName,
      toggleTheme: () => setThemeName((current) => (current === "light" ? "dark" : "light")),
    };
  }, [themeName]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const value = useContext(ThemeContext);

  if (!value) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }

  return value;
}
