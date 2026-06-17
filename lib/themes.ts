export const THEMES = ["default", "claude"] as const;
export type Theme = (typeof THEMES)[number];

export function isValidTheme(value: unknown): value is Theme {
  return THEMES.includes(value as Theme);
}
