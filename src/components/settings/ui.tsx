import { Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ReactNode } from "react";

import { GlassCard } from "@/components/primeflow/GlassCard";
import { Screen } from "@/components/primeflow/Screen";

export function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button
      role="switch"
      aria-checked={on}
      onClick={onClick}
      className={`h-7 w-12 shrink-0 rounded-full p-1 transition-colors duration-300 ${
        on ? "accent-gradient" : "bg-muted"
      }`}
    >
      <span
        className="block size-5 rounded-full bg-background transition-transform duration-300"
        style={{ transform: on ? "translateX(20px)" : "translateX(0)" }}
      />
    </button>
  );
}

export function SettingsPage({
  title,
  subtitle,
  children,
  backTo = "/settings",
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  backTo?: string;
}) {
  return (
    <Screen>
      <header className="animate-rise mb-5 flex items-center gap-3">
        <Link
          to={backTo}
          aria-label="Back"
          className="glass grid size-10 shrink-0 place-items-center rounded-2xl transition-transform duration-300 active:scale-95"
        >
          <ChevronLeft className="size-[18px] text-primary" />
        </Link>
        <div className="min-w-0">
          <h1 className="font-display truncate text-[22px] leading-tight font-semibold">{title}</h1>
          {subtitle ? (
            <p className="truncate text-[11px] text-muted-foreground">{subtitle}</p>
          ) : null}
        </div>
      </header>
      <div className="space-y-4">{children}</div>
    </Screen>
  );
}

export function SettingsCard({
  title,
  icon,
  children,
  delay,
  footer,
}: {
  title?: string;
  icon?: ReactNode;
  children: ReactNode;
  delay?: number;
  footer?: ReactNode;
}) {
  return (
    <GlassCard delay={delay}>
      {title ? (
        <div className="mb-4 flex items-center gap-2">
          {icon}
          <h2 className="font-display text-base font-semibold">{title}</h2>
        </div>
      ) : null}
      <div className="space-y-4">{children}</div>
      {footer ? <div className="mt-4">{footer}</div> : null}
    </GlassCard>
  );
}

export function ToggleRow({
  title,
  detail,
  on,
  onToggle,
}: {
  title: string;
  detail?: string;
  on: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="min-w-0">
        <div className="text-sm font-medium">{title}</div>
        {detail ? <div className="text-[11px] text-muted-foreground">{detail}</div> : null}
      </div>
      <Toggle on={on} onClick={onToggle} />
    </div>
  );
}

export function OptionRow<T extends string>({
  title,
  detail,
  value,
  options,
  onChange,
}: {
  title: string;
  detail?: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
}) {
  return (
    <div>
      <div className="text-sm font-medium">{title}</div>
      {detail ? <div className="text-[11px] text-muted-foreground">{detail}</div> : null}
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={o.value}
            onClick={() => onChange(o.value)}
            className={`rounded-2xl px-3 py-2 text-xs font-medium transition-all duration-300 active:scale-95 ${
              o.value === value
                ? "accent-gradient text-primary-foreground"
                : "bg-primary/10 text-muted-foreground"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function StepperRow({
  title,
  detail,
  value,
  suffix,
  min = 1,
  max = 180,
  step = 1,
  onChange,
}: {
  title: string;
  detail?: string;
  value: number;
  suffix?: string;
  min?: number;
  max?: number;
  step?: number;
  onChange: (value: number) => void;
}) {
  const clamp = (v: number) => Math.min(max, Math.max(min, v));
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="min-w-0">
        <div className="text-sm font-medium">{title}</div>
        {detail ? <div className="text-[11px] text-muted-foreground">{detail}</div> : null}
      </div>
      <div className="glass flex shrink-0 items-center gap-1 rounded-2xl p-1">
        <button
          aria-label={`Decrease ${title}`}
          onClick={() => onChange(clamp(value - step))}
          className="grid size-8 place-items-center rounded-xl text-sm text-primary transition-transform active:scale-90"
        >
          −
        </button>
        <span className="font-display min-w-14 text-center text-sm font-semibold">
          {value}
          {suffix ? <span className="text-[10px] text-muted-foreground"> {suffix}</span> : null}
        </span>
        <button
          aria-label={`Increase ${title}`}
          onClick={() => onChange(clamp(value + step))}
          className="grid size-8 place-items-center rounded-xl text-sm text-primary transition-transform active:scale-90"
        >
          +
        </button>
      </div>
    </div>
  );
}

export function TextField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  multiline,
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  multiline?: boolean;
  autoComplete?: string;
}) {
  const shared =
    "mt-1.5 w-full rounded-2xl bg-primary/8 px-4 py-3 text-sm outline-none transition-colors duration-200 placeholder:text-muted-foreground focus:bg-primary/12";
  return (
    <label className="block">
      <span className="text-[11px] tracking-wide text-muted-foreground uppercase">{label}</span>
      {multiline ? (
        <textarea
          value={value}
          rows={3}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={`${shared} resize-none`}
        />
      ) : (
        <input
          type={type}
          value={value}
          placeholder={placeholder}
          autoComplete={autoComplete}
          onChange={(e) => onChange(e.target.value)}
          className={shared}
        />
      )}
    </label>
  );
}

export function ActionRow({
  title,
  detail,
  action,
  onClick,
  tone = "default",
  to,
}: {
  title: string;
  detail?: string;
  action?: string;
  onClick?: () => void;
  tone?: "default" | "danger";
  to?: string;
}) {
  const body = (
    <>
      <span className="min-w-0 flex-1">
        <span
          className={`block text-sm font-medium ${tone === "danger" ? "text-destructive" : ""}`}
        >
          {title}
        </span>
        {detail ? (
          <span className="block text-[11px] text-muted-foreground">{detail}</span>
        ) : null}
      </span>
      {action ? (
        <span className="shrink-0 rounded-xl bg-primary/12 px-3 py-1.5 text-[11px] font-medium text-primary">
          {action}
        </span>
      ) : (
        <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
      )}
    </>
  );
  const cls =
    "flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition-colors duration-200 hover:bg-primary/8 active:scale-[0.99]";
  if (to) {
    return (
      <Link to={to} className={cls}>
        {body}
      </Link>
    );
  }
  return (
    <button onClick={onClick} className={cls}>
      {body}
    </button>
  );
}

export function StatusPill({ tone, children }: { tone: "on" | "off"; children: ReactNode }) {
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[10px] font-medium tracking-wide uppercase ${
        tone === "on" ? "bg-primary/16 text-primary" : "bg-muted text-muted-foreground"
      }`}
    >
      {children}
    </span>
  );
}
