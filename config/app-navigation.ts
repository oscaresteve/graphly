import type { LucideIcon } from "lucide-react";
import { LayoutDashboard, Settings } from "lucide-react";

export type NavigationItem = {
  title: string;
  href: string;
};

export type AppNavigationItem = NavigationItem & { icon: LucideIcon };

export const appNavigationItems: AppNavigationItem[] = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export function isNavigationItemActive({
  pathname,
  href,
}: {
  pathname: string;
  href: string;
}) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function getActiveNavigationItem({
  pathname,
  items,
}: {
  pathname: string;
  items: NavigationItem[];
}): NavigationItem | undefined {
  return items.find((item) =>
    isNavigationItemActive({ pathname, href: item.href }),
  );
}
