import type { ReactNode } from "react";

type AppSubbarProps = {
  left?: ReactNode;
  right?: ReactNode;
};

export function AppSubbar({ left, right }: AppSubbarProps) {
  return (
    <div className="mb-4 flex flex-wrap items-center gap-2">
      <div className="flex flex-wrap items-center gap-2">{left}</div>
      <div className="ml-auto flex flex-wrap items-center justify-end gap-2">
        {right}
      </div>
    </div>
  );
}
