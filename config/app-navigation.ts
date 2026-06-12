import type { LucideIcon } from "lucide-react";
import { LayoutDashboard, Settings } from "lucide-react";

export type AppNavigationItem = {
  title: string;
  href: string;
  icon: LucideIcon;
};

export const appNavigation: AppNavigationItem[] = [
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

export function getActiveNavigationItem(pathname: string) {
  return appNavigation.find((item) => {
    if (item.href === "/") {
      return pathname === "/";
    }

    return pathname === item.href || pathname.startsWith(`${item.href}/`);
  });
}
