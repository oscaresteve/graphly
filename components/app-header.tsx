"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { getActiveNavigationItem } from "@/config/app-navigation";
import { usePathname } from "next/navigation";

export function AppHeader() {
  const pathname = usePathname();
  const activeItem = getActiveNavigationItem(pathname);
  const title = activeItem?.title ?? "Graphly";

  return (
    <header className="relative flex h-12 items-center border-b p-2">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="cursor-pointer" />
        <Separator orientation="vertical" className="my-auto h-4" />
      </div>

      <h1 className="absolute left-1/2 -translate-x-1/2 text-center text-lg">
        {title}
      </h1>
    </header>
  );
}
