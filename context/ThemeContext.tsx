import React, { createContext, useContext, useState, useEffect } from "react";
import { Appearance } from "react-native";

type ThemeContextType = {
  theme: "light" | "dark" | "system";
  setTheme: React.Dispatch<React.SetStateAction<"light" | "dark" | "system">>;
  resolvedTheme: "light" | "dark";
};

export const ThemeContext = createContext<ThemeContextType>({
  theme: "system",
  setTheme: () => {},
  resolvedTheme: "light",
});

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const systemTheme = Appearance.getColorScheme(); // 'light' | 'dark'
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system");

  const resolvedTheme = theme === "system" ? systemTheme ?? "light" : theme;

  useEffect(() => {
    const listener = Appearance.addChangeListener(({ colorScheme }) => {
      if (theme === "system") {
        setTheme("system"); // Rerun effect to get new system theme
      }
    });

    return () => listener.remove();
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
