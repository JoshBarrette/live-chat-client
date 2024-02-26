import { forwardRef } from "react";
import { cn } from "../lib/utils";

export const Button = forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
  return (
    <button
      className={cn(
        "rounded-md bg-slate-400 px-4 py-2 font-semibold ring-0 ring-slate-600 transition-all hover:bg-slate-500 focus:ring focus:ring-offset-1 active:bg-slate-700 disabled:text-white",
        className,
      )}
      {...props}
      ref={ref}
    />
  );
});
Button.displayName = "Button";
