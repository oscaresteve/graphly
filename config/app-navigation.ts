import type { LucideIcon } from "lucide-react";
import { LayoutDashboard, Settings } from "lucide-react";

export type NavigationItem = {
  title: string;
  href: string;
};

type SidebarNavigationItem = NavigationItem & {
  visibleInSidebar: true;
  icon: LucideIcon;
};

type HiddenNavigationItem = NavigationItem & {
  visibleInSidebar: false;
};

type AppNavigationItem = SidebarNavigationItem | HiddenNavigationItem;

export const appNavigationItems: AppNavigationItem[] = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
    visibleInSidebar: true,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
    visibleInSidebar: true,
  },
  { title: "New metric", href: "/metrics/new", visibleInSidebar: false },
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
