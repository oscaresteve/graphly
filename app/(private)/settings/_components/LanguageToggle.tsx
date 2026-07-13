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
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();
  const router = useRouter();
  const [pending, setPending] = useState(false);

  function handleApply() {
    setPending(true);
    router.refresh();
    // si tu i18n también depende de estado de cliente (contexto),
    // resetéalo aquí para que no quede desincronizado con el server
    setPending(false);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Language</CardTitle>
        <CardDescription>
          Select your preferred language for the application interface.
        </CardDescription>
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
                <span>{LANGUAGES.find((l) => l.code === language)?.label}</span>
              </div>

              <ChevronDown className="h-4 w-4 shrink-0 opacity-50 transition-transform group-data-[state=open]:rotate-180" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-(--radix-dropdown-menu-trigger-width) flex flex-col gap-1 p-1.5"
          >
            {LANGUAGES.map((lang) => (
              <DropdownMenuItem
                key={lang.code}
                className="cursor-pointer gap-2 rounded-md py-2"
                onClick={() => setLanguage(lang.code)}
              >
                <div className="flex items-center gap-2">
                  <span>{lang.flag}</span>
                  <span>{lang.label}</span>
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </CardContent>
      <CardFooter className="justify-between gap-4">
        <FieldDescription>Some changes will take effect after clicking Apply.</FieldDescription>
        <Button onClick={handleApply} disabled={pending}>
          {pending ? "Applying..." : "Apply"}
        </Button>
      </CardFooter>
    </Card>
  );
}
