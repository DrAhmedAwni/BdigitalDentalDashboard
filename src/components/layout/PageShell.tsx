import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { ReactNode, HTMLAttributes } from "react";

export const PageShell = ({ children }: { children: ReactNode }) => (
  <div className="space-y-6 animate-fade-in">
    {children}
  </div>
);

type CardShellProps = HTMLAttributes<HTMLDivElement> & {
  className?: string;
  children: ReactNode;
};

export const CardShell = ({ className, children, ...rest }: CardShellProps) => (
  <Card className={cn("hover-scale transition-shadow duration-200 hover:shadow-lg", className)} {...rest}>
    {children}
  </Card>
);

export const TableSkeleton = () => (
  <Card>
    <CardContent className="space-y-2 py-4">
      <Skeleton className="h-4 w-1/3" />
      {Array.from({ length: 5 }).map((_, idx) => (
        <Skeleton key={idx} className="h-9 w-full" />
      ))}
    </CardContent>
  </Card>
);
