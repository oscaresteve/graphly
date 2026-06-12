"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useClerk, useUser } from "@clerk/nextjs";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { MetricNavigationItem } from "@/lib/metrics/types";
import {
  appNavigationItems,
  isNavigationItemActive,
} from "@/config/app-navigation";

type AppSidebarProps = {
  metricNavigationItems: MetricNavigationItem[];
};

export function AppSidebar({ metricNavigationItems }: AppSidebarProps) {
  const pathname = usePathname();
  const { user } = useUser();
  const { openUserProfile, signOut } = useClerk();
  const displayName = user?.fullName || user?.username || "User";
  const email = user?.primaryEmailAddress?.emailAddress;
  const imageUrl = user?.hasImage ? user.imageUrl : undefined;
  const initials = displayName.charAt(0).toUpperCase();

  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/" className="text-xl font-semibold">
                Graphly
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {appNavigationItems.map((item) => {
                const Icon = item.icon;

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isNavigationItemActive({
                        pathname,
                        href: item.href,
                      })}
                      tooltip={item.title}
                    >
                      <Link href={item.href}>
                        <Icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Metrics</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {metricNavigationItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={isNavigationItemActive({
                      pathname,
                      href: item.href,
                    })}
                    tooltip={item.title}
                  >
                    <Link href={item.href}>
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-sidebar-border border-t">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-1">
            <SidebarMenuButton
              size="lg"
              onClick={() => openUserProfile()}
              className="min-w-0 flex-1 cursor-pointer"
              tooltip={displayName}
            >
              <Avatar>
                {imageUrl ? (
                  <AvatarImage src={imageUrl} alt={displayName} />
                ) : null}
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>

              <div className="flex min-w-0 flex-1 flex-col text-left leading-tight">
                <span className="truncate text-sm font-medium">
                  {displayName}
                </span>
                {email ? (
                  <span className="text-muted-foreground truncate text-xs">
                    {email}
                  </span>
                ) : null}
              </div>
            </SidebarMenuButton>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="cursor-pointer"
              onClick={() => void signOut({ redirectUrl: "/auth/sign-in" })}
            >
              <LogOut />
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
