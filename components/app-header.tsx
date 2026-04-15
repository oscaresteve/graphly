import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

export function AppHeader() {
  return (
    <header className="flex items-center gap-2 border-b p-2">
      <SidebarTrigger />
      <Separator orientation="vertical" className="my-auto h-4" />
      <h1 className="ml-2 text-base font-medium">Dashboard</h1>
    </header>
  );
}
