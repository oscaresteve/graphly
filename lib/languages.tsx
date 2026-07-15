export type LanguageOption = {
  code: string;
  labelKey: string;
  flag: string;
};

export const LANGUAGES: LanguageOption[] = [
  { code: "en", labelKey: "english", flag: "🇺🇸" },
  { code: "es", labelKey: "spanish", flag: "🇪🇸" },
];
