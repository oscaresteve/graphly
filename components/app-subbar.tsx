import { Children, type ReactNode } from "react";

type AppSubbarSlot = ReactNode | ReactNode[];

type AppSubbarProps = {
  left?: AppSubbarSlot;
  right?: AppSubbarSlot;
};

export function AppSubbar({ left, right }: AppSubbarProps) {
  const leftItems = Children.toArray(left);
  const rightItems = Children.toArray(right);

  return (
    <div className="flex items-center gap-4">
      {leftItems.length ? (
        <div className="flex items-center gap-1">{leftItems}</div>
      ) : null}
      {rightItems.length ? (
        <div className="ml-auto flex items-center gap-1">{rightItems}</div>
      ) : null}
    </div>
  );
}
