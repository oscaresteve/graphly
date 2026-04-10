import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { shadcn } from "@clerk/ui/themes";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Graphly",
  description:
    "Visualiza tus datos con Graphly, la herramienta de gráficos de tu dia a dia.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body>
        <ClerkProvider appearance={{ theme: shadcn }}>{children}</ClerkProvider>
      </body>
    </html>
  );
}
