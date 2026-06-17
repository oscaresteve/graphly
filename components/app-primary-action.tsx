import type { ReactNode } from "react";

type AppPrimaryActionProps = {
  children: ReactNode;
};

export function AppPrimaryAction({ children }: AppPrimaryActionProps) {
  return <div className="fixed right-6 bottom-6 z-50">{children}</div>;
}
