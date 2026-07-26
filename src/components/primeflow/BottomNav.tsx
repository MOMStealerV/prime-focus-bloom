import { Link } from "@tanstack/react-router";
import { BarChart3, Home, Repeat, Settings, Timer } from "lucide-react";

const TABS = [
  { to: "/", label: "Home", icon: Home },
  { to: "/focus", label: "Focus", icon: Timer },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/habits", label: "Habits", icon: Repeat },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function BottomNav() {
  return (
    <nav className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center pb-5">
      <div className="glass-strong pointer-events-auto flex w-[min(430px,calc(100%-2rem))] items-center justify-between rounded-[26px] px-2 py-2 shadow-[0_20px_50px_-20px_oklch(0_0_0/50%)]">
        {TABS.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            activeOptions={{ exact: to === "/" }}
            className="group relative flex flex-1 flex-col items-center gap-1 rounded-[20px] px-1 py-2 text-muted-foreground transition-colors duration-300 data-[status=active]:text-primary-foreground"
          >
            {({ isActive }) => (
              <>
                <span
                  className={`accent-gradient absolute inset-0 rounded-[20px] transition-all duration-500 ${
                    isActive ? "scale-100 opacity-100" : "scale-90 opacity-0"
                  }`}
                />
                <Icon className="relative size-[18px]" strokeWidth={2} />
                <span className="relative text-[10px] font-medium tracking-wide">{label}</span>
              </>
            )}
          </Link>
        ))}
      </div>
    </nav>
  );
}