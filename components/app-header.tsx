"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { MetricNavigationItem } from "@/lib/metrics/types";
import {
  appNavigationItems,
  getActiveNavigationItem,
} from "@/config/app-navigation";
import { usePathname } from "next/navigation";

type AppHeaderProps = {
  metricNavigationItems: MetricNavigationItem[];
};

export function AppHeader({ metricNavigationItems }: AppHeaderProps) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 bg-background rounded-t-xl flex h-12 items-center border-b p-2">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="cursor-pointer" />
        <Separator orientation="vertical" className="my-auto h-4" />
      </div>

      <h1 className="absolute left-1/2 -translate-x-1/2 text-center text-lg">
        {getHeaderTitle({
          pathname,
          metricNavigationItems,
        })}
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

  return activeItem?.title || "Graphly";
}
