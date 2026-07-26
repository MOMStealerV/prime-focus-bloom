import { useEffect, useState } from "react";

export function AnimatedBar({
  value,
  delay = 0,
  className,
}: {
  value: number;
  delay?: number;
  className?: string;
}) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const id = window.setTimeout(() => setWidth(value), 100 + delay);
    return () => window.clearTimeout(id);
  }, [value, delay]);

  return (
    <div className={`h-2.5 w-full overflow-hidden rounded-full bg-muted/60 ${className ?? ""}`}>
      <div
        className="accent-gradient h-full rounded-full"
        style={{
          width: `${width}%`,
          transition: "width 1.2s cubic-bezier(0.22,1,0.36,1)",
        }}
      />
    </div>
  );
}