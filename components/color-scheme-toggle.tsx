"use client";
import { Monitor, Moon, Sun } from "lucide-react";
import { useColorScheme } from "@/components/color-scheme-provider";
import { useHasMounted } from "@/lib/hooks/use-has-mounted";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FieldDescription } from "./ui/field";

export function ColorSchemeToggle() {
  const { colorScheme, setColorScheme } = useColorScheme();
  const mounted = useHasMounted();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Color scheme</CardTitle>
        <CardDescription>
          Choose how Graphly looks — light, dark, or match your system.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {mounted ? (
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
        ) : (
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
        )}
      </CardContent>
      <CardFooter>
        <FieldDescription>Changes are applied immediately.</FieldDescription>
      </CardFooter>
    </Card>
  );
}
