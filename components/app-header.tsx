"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { MetricNavigationItem } from "@/lib/metrics/types";
import {
  appNavigationItems,
  getActiveNavigationItem,
} from "@/config/app-navigation";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

type AppHeaderProps = {
  metricNavigationItems: MetricNavigationItem[];
};

export function AppHeader({ metricNavigationItems }: AppHeaderProps) {
  const pathname = usePathname();
  const t = useTranslations();

  return (
    <header className="bg-background sticky z-60 top-0 flex h-12 items-center rounded-t-xl border-b p-2">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="cursor-pointer" />
        <Separator orientation="vertical" className="my-auto h-4" />
      </div>

      <h1 className="absolute left-1/2 max-w-1/2 -translate-x-1/2 truncate text-center text-lg">
        {t(
          getHeaderTitle({
            pathname,
            metricNavigationItems,
          }),
        )}
      </h1>
    </header>
  );
}

function getHeaderTitle({
  pathname,
  metricNavigationItems,
}: {
  pathname: string;
  metricNavigationItems: MetricNavigationItem[];
}): string {
  const allNavigationItems = [...appNavigationItems, ...metricNavigationItems];

  const activeItem = getActiveNavigationItem({
    pathname,
    items: allNavigationItems,
  });

  return activeItem?.titleKey || "app-navigation.graphly";
}
