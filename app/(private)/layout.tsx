import { auth } from "@clerk/nextjs/server";

import { AppHeader } from "@/components/app-header";
import { AppSidebar } from "@/components/app-sidebar";
import { TimeZoneInitializer } from "@/components/time-zone-initializer";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { findUserTimeZone } from "@/lib/db/user-preferences.repository";

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { userId } = await auth.protect();
  const timeZone = await findUserTimeZone(userId);

  return (
    <SidebarProvider>
      <TimeZoneInitializer initialized={timeZone !== null} />
      <AppSidebar />
      <SidebarInset>
        <AppHeader />
        <main className="w-full px-4 py-4">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
