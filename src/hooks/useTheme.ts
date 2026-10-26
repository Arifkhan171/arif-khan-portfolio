import { useSyncExternalStore } from "react";
import { getTheme, setTheme, subscribe, toggleTheme, type Theme } from "@/lib/theme";

export function useTheme(): {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
} {
  const theme = useSyncExternalStore(subscribe, getTheme);
  return { theme, toggleTheme, setTheme: (next) => setTheme(next) };
}
