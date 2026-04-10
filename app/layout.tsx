import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
