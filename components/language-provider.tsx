"use client";
import { createContext, useContext, useState, useCallback } from "react";
import { setCookie } from "@/lib/cookies";

type Ctx = { language: string; setLanguage: (lang: string) => void };
const LanguageContext = createContext<Ctx | undefined>(undefined);

export function LanguageProvider({
  children,
  initialLanguage,
}: {
  children: React.ReactNode;
  initialLanguage: string;
}) {
  const [language, setLanguageState] = useState<string>(initialLanguage);

  const setLanguage = useCallback((lang: string) => {
    setLanguageState(lang);
    setCookie("locale", lang);
  }, []);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx)
    throw new Error("useLanguage debe usarse dentro de LanguageProvider");
  return ctx;
}
