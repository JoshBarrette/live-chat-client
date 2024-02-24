import { forwardRef } from "react";
import { cn } from "../lib/utils";

export const Button = forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
  return (
    <button
      className={cn(
        "rounded bg-blue-300 py-2 px-4 transition-all hover:bg-blue-400 disabled:text-white",
        className,
      )}
      {...props}
      ref={ref}
    />
  );
});
Button.displayName = "Button";
