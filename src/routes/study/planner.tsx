import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Trash2 } from "lucide-react";

import { GlassCard } from "@/components/primeflow/GlassCard";
import { Screen } from "@/components/primeflow/Screen";
import { ModuleHeader, inputClass, primaryButtonClass } from "@/components/study/ModuleHeader";
import { addPlannerItem, removePlannerItem, togglePlannerItem, useStudy } from "@/lib/study-store";

export const Route = createFileRoute("/study/planner")({
  head: () => ({
    meta: [
      { title: "Planner — PrimeFlow Study Hub" },
      { name: "description", content: "Plan study sessions, revision blocks and exam prep by date." },
      { property: "og:title", content: "Planner — PrimeFlow Study Hub" },
      { property: "og:description", content: "Plan study sessions and revision blocks by date." },
    ],
  }),
  component: Planner,
});

function Planner() {
  const { planner, subjects } = useStudy();
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState(subjects[0]?.name ?? "");
  const [minutes, setMinutes] = useState("45");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));

  const groups = [...planner].sort((a, b) => a.date.localeCompare(b.date));

  return (
    <Screen>
      <ModuleHeader
        title="Planner"
        subtitle={`${planner.filter((p) => !p.done).length} sessions still to run`}
      />

      <GlassCard delay={40}>
        <h2 className="font-display text-base font-semibold">Schedule a session</h2>
        <div className="mt-3 space-y-2">
          <input
            className={inputClass}
            placeholder="What are you studying?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <select className={inputClass} value={subject} onChange={(e) => setSubject(e.target.value)}>
            {subjects.map((s) => (
              <option key={s.id} value={s.name}>
                {s.name}
              </option>
            ))}
          </select>
          <div className="flex gap-2">
            <input
              className={inputClass}
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            <input
              className={inputClass}
              type="number"
              min="5"
              step="5"
              value={minutes}
              onChange={(e) => setMinutes(e.target.value)}
            />
          </div>
          <button
            className={`${primaryButtonClass} w-full`}
            onClick={() => {
              addPlannerItem({ title, subject, date, minutes: Number(minutes) || 45 });
              setTitle("");
            }}
          >
            Add to planner
          </button>
        </div>
      </GlassCard>

      <div className="mt-4 space-y-3">
        {groups.map((item, i) => (
          <GlassCard key={item.id} delay={100 + i * 50} className="rounded-3xl p-4">
            <div className="flex items-center gap-3">
              <button
                aria-label={`Toggle ${item.title}`}
                onClick={() => togglePlannerItem(item.id)}
                className={`grid size-11 shrink-0 place-items-center rounded-2xl transition-all duration-300 active:scale-90 ${
                  item.done ? "accent-gradient" : "bg-muted/60"
                }`}
              >
                <Check
                  className={`size-5 transition-opacity duration-300 ${
                    item.done
                      ? "text-primary-foreground opacity-100"
                      : "text-muted-foreground opacity-40"
                  }`}
                />
              </button>
              <div className="min-w-0 flex-1">
                <div className={`truncate text-sm font-medium ${item.done ? "line-through opacity-60" : ""}`}>
                  {item.title}
                </div>
                <div className="mt-0.5 text-[11px] text-muted-foreground">
                  {item.subject} · {item.date} · {item.minutes} min
                </div>
              </div>
              <button
                aria-label={`Remove ${item.title}`}
                onClick={() => removePlannerItem(item.id)}
                className="grid size-9 place-items-center rounded-xl bg-muted/60 text-muted-foreground transition-transform duration-300 active:scale-90"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          </GlassCard>
        ))}
      </div>
    </Screen>
  );
}
