"use client";

import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { getActiveNavigationItem } from "@/config/app-navigation";
import Link from "next/link";
import { usePathname } from "next/navigation";

type AppHeaderProps = {
  actions?: ReactNode;
};

export function AppHeader({ actions }: AppHeaderProps) {
  const pathname = usePathname();
  const activeItem = getActiveNavigationItem(pathname);
  const title = activeItem?.title ?? "Graphly";
  const headerActions = actions ?? getHeaderActions(pathname, activeItem);

  return (
    <header className="flex items-center gap-2 border-b p-2">
      <SidebarTrigger />
      <Separator orientation="vertical" className="my-auto h-4" />

      <h1 className="flex-1 truncate text-lg font-medium">{title}</h1>

      {headerActions ? <div className="shrink-0">{headerActions}</div> : null}
    </header>
  );
}

function getHeaderActions(
  pathname: string,
  activeItem: ReturnType<typeof getActiveNavigationItem>,
): ReactNode {
  const action = activeItem?.headerAction;

  if (!action || pathname === action.href) {
    return null;
  }

  const Icon = action.icon;

  return (
    <Button asChild>
      <Link href={action.href}>
        <Icon data-icon="inline-start" />
        {action.title}
      </Link>
    </Button>
  );
}
