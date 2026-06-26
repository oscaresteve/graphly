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
    <div className="w-full flex items-center gap-4">
      {leftItems.length ? (
        <div className="flex w-max items-center gap-1">{leftItems}</div>
      ) : null}
      {rightItems.length ? (
        <div className="flex w-max ml-auto items-center gap-1">{rightItems}</div>
      ) : null}
    </div>
  );
}
