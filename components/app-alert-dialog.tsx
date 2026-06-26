import { LucideIcon } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { type ReactNode } from "react";

type AppAlertDialogProps = {
  trigger: ReactNode;
  title: ReactNode;
  description: ReactNode;
  handleAction: () => void;
  isPending?: boolean;
  actionLabel: string;
  Icon?: LucideIcon;
  destructive?: boolean;
};

export function AppAlertDialog({
  trigger,
  title,
  description,
  handleAction,
  isPending,
  actionLabel,
  Icon,
  destructive,
}: AppAlertDialogProps) {
  return (
    <AlertDialog>
      {trigger ? (
        <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      ) : null}
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          {Icon ? (
            <AlertDialogMedia
              className={
                destructive
                  ? "bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive"
                  : ""
              }
            >
              <Icon />
            </AlertDialogMedia>
          ) : null}
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant="outline" disabled={isPending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            variant={destructive ? "destructive" : "default"}
            onClick={handleAction}
            disabled={isPending}
          >
            {actionLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
