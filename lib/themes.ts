export const THEMES = ["graphite", "claude", "supabase", "vercel"] as const;
export type Theme = (typeof THEMES)[number];

export function isValidTheme(value: unknown): value is Theme {
  return THEMES.includes(value as Theme);
}
