// useResolvedTheme.ts
import { useColorScheme } from "react-native";
import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "@/context/ThemeContext";

export const useResolvedTheme = () => {
  const context = useContext(ThemeContext);
  const system = useColorScheme(); // fallback si jamais
  const [resolvedTheme, setResolvedTheme] = useState(system ?? "light");

  useEffect(() => {
    if (context?.theme === "system") {
      setResolvedTheme(system ?? "light");
    } else if (context?.theme) {
      setResolvedTheme(context.theme);
    }
  }, [context?.theme, system]);

  return resolvedTheme;
};
