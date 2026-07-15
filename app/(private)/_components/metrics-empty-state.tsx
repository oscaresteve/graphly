import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";

import Link from "next/link";

export default function MetricsEmptyState() {
  const t = useTranslations("metrics-empty-state");

  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Plus />
        </EmptyMedia>
        <EmptyTitle>{t("title")}</EmptyTitle>
        <EmptyDescription>{t("description")}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button asChild>
          <Link href="/metrics/new">{t("actionLabel")}</Link>
        </Button>
      </EmptyContent>
    </Empty>
  );
}
