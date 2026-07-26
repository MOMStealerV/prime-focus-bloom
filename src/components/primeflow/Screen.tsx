import type { ReactNode } from "react";

export function Screen({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* soft ambient blur backdrop */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div
          className="animate-float-slow absolute -top-32 -left-24 size-[420px] rounded-full blur-[110px]"
          style={{ background: "var(--backdrop-1)" }}
        />
        <div
          className="animate-float-slow absolute -right-28 bottom-10 size-[380px] rounded-full blur-[120px]"
          style={{ background: "var(--backdrop-2)", animationDelay: "-6s" }}
        />
      </div>
      <div className="mx-auto w-full max-w-[430px] px-5 pt-8 pb-32">{children}</div>
    </div>
  );
}

export function ScreenTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <header className="animate-rise mb-6">
      <h1 className="font-display text-[28px] leading-tight font-semibold">{title}</h1>
      {subtitle ? <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p> : null}
    </header>
  );
}