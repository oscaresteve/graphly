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
  const theme: Theme = isValidTheme(rawTheme) ? rawTheme : "graphite";

  return (
    <html
      lang="en"
      className={cn("font-sans", geist.variable)}
      data-theme={theme}
      suppressHydrationWarning
    >
      <body>
        <ColorSchemeProvider
          attribute="class"
          defaultTheme={colorScheme ?? "system"}
          enableSystem
          disableTransitionOnChange
        >
          <ThemeProvider initialTheme={theme}>
            <ClerkProvider appearance={{ theme: shadcn }}>
              <TooltipProvider>{children}</TooltipProvider>
            </ClerkProvider>
          </ThemeProvider>
        </ColorSchemeProvider>
      </body>
    </html>
  );
}
