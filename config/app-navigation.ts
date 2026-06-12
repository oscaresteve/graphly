import type { LucideIcon } from "lucide-react";
import { LayoutDashboard, Settings } from "lucide-react";

export type AppNavigationItem = {
  title: string;
  href: string;
  icon: LucideIcon;
};

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
