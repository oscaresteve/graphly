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
    <div className="flex flex-wrap items-center gap-2">
      {leftItems.length ? (
        <div className="flex flex-wrap items-center gap-2">{leftItems}</div>
      ) : null}
      {rightItems.length ? (
        <div className="ml-auto flex flex-wrap items-center justify-end gap-2">
          {rightItems}
        </div>
      ) : null}
    </div>
  );
}
