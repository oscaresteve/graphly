"use client";

import { type ReactNode } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";

type ResponsiveDialogProps = {
  children: ReactNode;
  description?: ReactNode;
  footer?: ReactNode;
  onOpenChange: (open: boolean) => void;
  open: boolean;
  title: ReactNode;
  trigger?: ReactNode;
};

/**
 * Dialog en desktop, Drawer en mobile. El contenido central es scrolleable
 * y el footer queda fijo y siempre visible, así contenido largo (como un
 * calendario) nunca empuja los botones de acción fuera de la pantalla.
 */
export function ResponsiveDialog({
  children,
  description,
  footer,
  onOpenChange,
  open,
  title,
  trigger,
}: ResponsiveDialogProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        {trigger ? <DrawerTrigger asChild>{trigger}</DrawerTrigger> : null}
        <DrawerContent className="flex max-h-[85dvh] flex-col">
          <DrawerHeader className="shrink-0 text-left">
            <DrawerTitle>{title}</DrawerTitle>
            {description ? (
              <DrawerDescription>{description}</DrawerDescription>
            ) : null}
          </DrawerHeader>
          <div className="flex-1 overflow-y-auto px-4">{children}</div>
          {footer ? (
            <DrawerFooter className="shrink-0">{footer}</DrawerFooter>
          ) : null}
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : null}
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="flex max-h-[85vh] flex-col gap-4"
      >
        <DialogHeader className="shrink-0">
          <DialogTitle>{title}</DialogTitle>
          {description ? (
            <DialogDescription>{description}</DialogDescription>
          ) : null}
        </DialogHeader>
        <div className="flex-1 overflow-y-auto">{children}</div>
        {footer ? (
          <DialogFooter className="shrink-0">{footer}</DialogFooter>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
