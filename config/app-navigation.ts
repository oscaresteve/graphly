import type { LucideIcon } from "lucide-react";
import { LayoutDashboard, LineChart, Plus } from "lucide-react";

export type AppHeaderAction = {
  title: string;
  href: string;
  icon: LucideIcon;
};

export type AppNavigationItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  headerAction?: AppHeaderAction;
};

export const appNavigation: AppNavigationItem[] = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Metrics",
    href: "/metrics",
    icon: LineChart,
    headerAction: {
      title: "New Metric",
      href: "/metrics/new",
      icon: Plus,
    },
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
