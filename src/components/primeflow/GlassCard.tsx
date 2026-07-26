import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

type Props = HTMLAttributes<HTMLDivElement> & {
  strong?: boolean;
  delay?: number;
};

export function GlassCard({ className, strong, delay = 0, style, ...props }: Props) {
  return (
    <div
      className={cn(
        strong ? "glass-strong" : "glass",
        "animate-rise rounded-[28px] p-5",
        className,
      )}
      style={{ animationDelay: `${delay}ms`, ...style }}
      {...props}
    />
  );
}