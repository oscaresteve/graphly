import type { ReactNode } from "react";

type AppPrimaryActionProps = {
  children: ReactNode;
};

export function AppPrimaryAction({ children }: AppPrimaryActionProps) {
  return <div className="fixed right-4 bottom-4 z-50">{children}</div>;
}
