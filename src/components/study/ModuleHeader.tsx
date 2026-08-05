import { Link } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";

export function ModuleHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <header className="animate-rise mb-6">
      <Link
        to="/study"
        className="mb-3 inline-flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors duration-300 hover:text-primary"
      >
        <ChevronLeft className="size-3.5" />
        Study Hub
      </Link>
      <h1 className="font-display text-[28px] leading-tight font-semibold">{title}</h1>
      {subtitle ? <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p> : null}
    </header>
  );
}

export const inputClass =
  "glass w-full rounded-2xl px-4 py-3 text-sm outline-none placeholder:text-muted-foreground/70 focus:ring-2 focus:ring-primary/40";

export const primaryButtonClass =
  "accent-gradient rounded-2xl px-4 py-3 font-display text-sm font-semibold text-primary-foreground shadow-[0_16px_40px_-16px_var(--primary)] transition-transform duration-300 active:scale-[0.98]";
