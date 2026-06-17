"use client";
import { Monitor, Moon, Sun } from "lucide-react";
import { useColorScheme } from "@/components/color-scheme-provider";
import { useHasMounted } from "@/lib/hooks/use-has-mounted";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";

export function ColorSchemeToggle() {
  const { colorScheme, setColorScheme } = useColorScheme();
  const mounted = useHasMounted();

  if (!mounted) {
    return (
      <ToggleGroup type="single" variant="outline">
        <ToggleGroupItem aria-label="Light" value="light">
          <Sun />
          Light
        </ToggleGroupItem>
        <ToggleGroupItem aria-label="Dark" value="dark">
          <Moon />
          Dark
        </ToggleGroupItem>
        <ToggleGroupItem aria-label="System" value="system">
          <Monitor />
          System
        </ToggleGroupItem>
      </ToggleGroup>
    );
  }

  return (
    <ToggleGroup
      type="single"
      variant="outline"
      value={colorScheme}
      onValueChange={(value) => value && setColorScheme(value)}
    >
      <ToggleGroupItem aria-label="Light" value="light">
        <Sun />
        Light
      </ToggleGroupItem>
      <ToggleGroupItem aria-label="Dark" value="dark">
        <Moon />
        Dark
      </ToggleGroupItem>
      <ToggleGroupItem aria-label="System" value="system">
        <Monitor />
        System
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
