import { AppHeader } from "@/components/app-header";
import { AppSidebar } from "@/components/app-sidebar";
import { TimeZoneInitializer } from "@/components/time-zone-initializer";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { loadLayoutData } from "./loader";

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { metricNavigationItems, timeZone } = await loadLayoutData();

  return (
    <SidebarProvider>
      <TimeZoneInitializer initialized={timeZone !== null} />
      <AppSidebar metricNavigationItems={metricNavigationItems} />
      <SidebarInset>
        <AppHeader />
        <main className="w-full px-4 py-4">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
