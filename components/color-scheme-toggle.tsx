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
import { useTranslations } from "next-intl";

export function ColorSchemeToggle() {
  const { colorScheme, setColorScheme } = useColorScheme();
  const mounted = useHasMounted();
  const t = useTranslations("color-scheme-toggle");

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent>
        {mounted ? (
          <ToggleGroup
            type="single"
            variant="outline"
            value={colorScheme}
            onValueChange={(value) => value && setColorScheme(value)}
          >
            <ToggleGroupItem aria-label={t("light")} value="light">
              <Sun />
              {t("light")}
            </ToggleGroupItem>
            <ToggleGroupItem aria-label={t("dark")} value="dark">
              <Moon />
              {t("dark")}
            </ToggleGroupItem>
            <ToggleGroupItem aria-label={t("system")} value="system">
              <Monitor />
              {t("system")}
            </ToggleGroupItem>
          </ToggleGroup>
        ) : (
          <ToggleGroup type="single" variant="outline">
            <ToggleGroupItem aria-label={t("light")} value="light">
              <Sun />
              {t("light")}
            </ToggleGroupItem>
            <ToggleGroupItem aria-label={t("dark")} value="dark">
              <Moon />
              {t("dark")}
            </ToggleGroupItem>
            <ToggleGroupItem aria-label={t("system")} value="system">
              <Monitor />
              {t("system")}
            </ToggleGroupItem>
          </ToggleGroup>
        )}
      </CardContent>
      <CardFooter>
        <FieldDescription>{t("helperText")}</FieldDescription>
      </CardFooter>
    </Card>
  );
}
