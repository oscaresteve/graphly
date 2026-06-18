"use client";
import { Check, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/components/theme-provider";
import { THEMES, type Theme } from "@/lib/themes";

const LABEL: Record<Theme, string> = {
  graphite: "Graphite",
  claude: "Claude",
  supabase: "Supabase",
  vercel: "Vercel",
};

function ThemePreview({ theme }: { theme: Theme }) {
  return (
    <div
      data-theme={theme}
      className="bg-background flex shrink-0 items-center justify-center gap-1 rounded-md border p-1.5"
    >
      <span className="bg-primary h-4 w-1.5 rounded-sm" />
      <span className="bg-secondary h-4 w-1.5 rounded-sm" />
      <span className="bg-accent h-4 w-1.5 rounded-sm" />
    </div>
  );
}

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="group h-11 w-full justify-between gap-2 px-3 font-normal sm:w-56"
        >
          <span className="flex items-center gap-2">
            <ThemePreview theme={theme} />
            {LABEL[theme]}
          </span>
          <ChevronDown className="h-4 w-4 shrink-0 opacity-50 transition-transform group-data-[state=open]:rotate-180" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-(--radix-dropdown-menu-trigger-width flex flex-col gap-1 p-1.5"
      >
        {THEMES.map((t) => (
          <DropdownMenuItem
            key={t}
            onClick={() => setTheme(t)}
            className="min-h-11 cursor-pointer gap-2 rounded-md py-2"
          >
            <ThemePreview theme={t} />
            <span className="flex-1">{LABEL[t]}</span>
            {theme === t && <Check className="h-4 w-4 shrink-0" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
