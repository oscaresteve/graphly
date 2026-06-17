"use client";
import { useEffect } from "react";
import {
  ThemeProvider as NextThemesProvider,
  useTheme as useNextTheme,
} from "next-themes";
import { setCookie } from "@/lib/cookies";

export function ColorSchemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider {...props}>
      <CookieSync />
      {children}
    </NextThemesProvider>
  );
}

function CookieSync() {
  const { theme } = useNextTheme();
  useEffect(() => {
    if (theme) setCookie("color-scheme", theme);
  }, [theme]);
  return null;
}

export function useColorScheme() {
  const { theme, setTheme, resolvedTheme, systemTheme } = useNextTheme();
  return {
    colorScheme: theme as "light" | "dark" | "system" | undefined,
    setColorScheme: setTheme,
    resolvedColorScheme: resolvedTheme as "light" | "dark" | undefined,
    systemColorScheme: systemTheme as "light" | "dark" | undefined,
  };
}
