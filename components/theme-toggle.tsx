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
      className="bg-background flex shrink-0 items-center justify-center gap-1 rounded-lg border p-2"
    >
      <span className="bg-primary h-5 w-1.5 rounded-sm" />
      <span className="bg-secondary h-5 w-1.5 rounded-sm" />
      <span className="bg-accent h-5 w-1.5 rounded-sm" />
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
          className="min-h-max w-50 justify-between p-1"
        >
          <span className="flex items-center gap-2">
            <ThemePreview theme={theme} />
            {LABEL[theme]}
          </span>
          <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent  align="end" className="flex w-50 flex-col gap-1 p-1">
        {THEMES.map((t) => (
          <DropdownMenuItem
            key={t}
            onClick={() => setTheme(t)}
            asChild
            className="p-0"
          >
            <Button
              variant="ghost"
              className="min-h-max w-full justify-start gap-2 p-1"
            >
              <ThemePreview theme={t} />
              {LABEL[t]}
              {theme === t && <Check className="ml-auto h-4 w-4 shrink-0" />}
            </Button>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
