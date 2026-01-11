import * as React from "react";
import { cn } from "@/lib/utils";

type SimpleTooltipProps = Omit<React.HTMLAttributes<HTMLDivElement>, "content"> & {
  content: React.ReactNode;
  children: React.ReactNode;
};

export const SimpleTooltip: React.FC<SimpleTooltipProps> = ({ content, children, className, ...rest }) => {
  const [open, setOpen] = React.useState(false);

  return (
    <div
      className={cn("relative inline-flex", className)}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      {...rest}
    >
      {children}
      {open && (
        <div className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 rounded-md border bg-popover px-2 py-1 text-xs text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95">
          {content}
        </div>
      )}
    </div>
  );
};
