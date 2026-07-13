import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { shadcn } from "@clerk/ui/themes";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cookies } from "next/headers";
import { ColorSchemeProvider } from "@/components/color-scheme-provider";
import { isValidTheme, type Theme } from "@/lib/themes";
import { Toaster } from "@/components/ui/sonner";
import { NextIntlClientProvider } from "next-intl";
import { LanguageProvider } from "@/components/language-provider";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Graphly",
  description: "Visualize your data with Graphly, the everyday charting tool.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const store = await cookies();
  const colorScheme = store.get("color-scheme")?.value;
  const rawTheme = store.get("theme")?.value;
  const language = store.get("language")?.value ?? "en";
  const theme: Theme = isValidTheme(rawTheme) ? rawTheme : "graphite";

  return (
    <html
      lang="en"
      className={cn("font-sans", geist.variable)}
      data-theme={theme}
      suppressHydrationWarning
    >
      <body>
        <NextIntlClientProvider>
          <ColorSchemeProvider
            attribute="class"
            defaultTheme={colorScheme ?? "system"}
            enableSystem
            disableTransitionOnChange
          >
            <ThemeProvider initialTheme={theme}>
              <LanguageProvider initialLanguage={language}>
                <ClerkProvider appearance={{ theme: shadcn }}>
                  <TooltipProvider>{children}</TooltipProvider>
                </ClerkProvider>
              </LanguageProvider>
            </ThemeProvider>
          </ColorSchemeProvider>
          <Toaster closeButton />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
