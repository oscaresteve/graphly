import type { LucideIcon } from "lucide-react";
import { LayoutDashboard, Settings } from "lucide-react";

export type NavigationItem = {
  titleKey: string;
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
    titleKey: "app-navigation.dashboard",
    href: "/",
    icon: LayoutDashboard,
    visibleInSidebar: true,
  },
  {
    titleKey: "app-navigation.settings",
    href: "/settings",
    icon: Settings,
    visibleInSidebar: true,
  },
  {
    titleKey: "app-navigation.newMetric",
    href: "/metrics/new",
    visibleInSidebar: false,
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
