"use client";
import { useLanguage } from "@/components/language-provider";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenu,
} from "@/components/ui/dropdown-menu";
import { FieldDescription } from "@/components/ui/field";
import { LANGUAGES } from "@/lib/languages";
import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const t = useTranslations("language-toggle");

  function handleApply() {
    setPending(true);
    router.refresh();
    setPending(false);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="group w-full justify-between gap-2 px-3 font-normal sm:w-56"
            >
              <div className="flex items-center gap-2">
                <span>{LANGUAGES.find((l) => l.code === language)?.flag}</span>
                <span>
                  {t(
                    LANGUAGES.find((l) => l.code === language)?.labelKey ||
                      "unknown",
                  )}
                </span>
              </div>

              <ChevronDown className="h-4 w-4 shrink-0 opacity-50 transition-transform group-data-[state=open]:rotate-180" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="flex w-(--radix-dropdown-menu-trigger-width) flex-col gap-1 p-1.5"
          >
            {LANGUAGES.map((lang) => (
              <DropdownMenuItem
                key={lang.code}
                className="cursor-pointer gap-2 rounded-md py-2"
                onClick={() => setLanguage(lang.code)}
              >
                <div className="flex items-center gap-2">
                  <span>{lang.flag}</span>
                  <span>{t(lang.labelKey)}</span>
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </CardContent>
      <CardFooter className="justify-between gap-4">
        <FieldDescription>{t("helperText")}</FieldDescription>
        <Button onClick={handleApply} disabled={pending}>
          {pending ? t("applying") : t("apply")}
        </Button>
      </CardFooter>
    </Card>
  );
}
