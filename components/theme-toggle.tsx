"use client";
import { Check, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/components/theme-provider";
import { THEMES, type Theme } from "@/lib/themes";

const PREVIEW: Record<Theme, string> = {
  default: "oklch(0.5 0 0)",
  claude: "oklch(0.62 0.19 35)",
};

const LABEL: Record<Theme, string> = {
  default: "Default",
  claude: "Claude",
};

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Palette className="h-4 w-4" />
          <span className="sr-only">Cambiar paleta</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {THEMES.map((t) => (
          <DropdownMenuItem key={t} onClick={() => setTheme(t)}>
            <span
              className="mr-2 inline-block h-3 w-3 rounded-full border"
              style={{ backgroundColor: PREVIEW[t] }}
            />
            {LABEL[t]}
            {theme === t && <Check className="ml-auto h-4 w-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
