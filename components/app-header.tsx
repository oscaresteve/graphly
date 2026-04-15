"use client";

import type { ReactNode } from "react";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { getActiveNavigationItem } from "@/config/app-navigation";
import { usePathname } from "next/navigation";

type AppHeaderProps = {
  actions?: ReactNode;
};

export function AppHeader({ actions }: AppHeaderProps) {
  const pathname = usePathname();
  const title = getActiveNavigationItem(pathname)?.title ?? "Graphly";

  return (
    <header className="flex items-center gap-2 border-b p-2">
      <SidebarTrigger />
      <Separator orientation="vertical" className="my-auto h-4" />

      <h1 className="flex-1 truncate text-lg font-medium">{title}</h1>

      {actions ? <div className="shrink-0">{actions}</div> : null}
    </header>
  );
}
