import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Trash2 } from "lucide-react";

import { GlassCard } from "@/components/primeflow/GlassCard";
import { Screen } from "@/components/primeflow/Screen";
import { ModuleHeader, inputClass, primaryButtonClass } from "@/components/study/ModuleHeader";
import { addAssignment, removeAssignment, toggleAssignment, useStudy } from "@/lib/study-store";

export const Route = createFileRoute("/study/assignments")({
  head: () => ({
    meta: [
      { title: "Assignments — PrimeFlow Study Hub" },
      { name: "description", content: "Track homework, deadlines and upcoming work without losing a due date." },
      { property: "og:title", content: "Assignments — PrimeFlow Study Hub" },
      { property: "og:description", content: "Track homework and deadlines in one place." },
    ],
  }),
  component: Assignments,
});

function Assignments() {
  const { assignments, subjects } = useStudy();
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState(subjects[0]?.name ?? "");
  const [due, setDue] = useState(() => new Date().toISOString().slice(0, 10));
  const today = new Date().toISOString().slice(0, 10);

  const sorted = [...assignments].sort(
    (a, b) => Number(a.done) - Number(b.done) || a.due.localeCompare(b.due),
  );

  return (
    <Screen>
      <ModuleHeader
        title="Assignments"
        subtitle={`${assignments.filter((a) => !a.done).length} still open`}
      />

      <GlassCard delay={40}>
        <h2 className="font-display text-base font-semibold">Add assignment</h2>
        <div className="mt-3 space-y-2">
          <input
            className={inputClass}
            placeholder="Assignment title"
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
          <input
            className={inputClass}
            type="date"
            value={due}
            onChange={(e) => setDue(e.target.value)}
          />
          <button
            className={`${primaryButtonClass} w-full`}
            onClick={() => {
              addAssignment({ title, subject, due });
              setTitle("");
            }}
          >
            Add assignment
          </button>
        </div>
      </GlassCard>

      <div className="mt-4 space-y-3">
        {sorted.map((item, i) => {
          const overdue = !item.done && item.due < today;
          return (
            <GlassCard key={item.id} delay={100 + i * 50} className="rounded-3xl p-4">
              <div className="flex items-center gap-3">
                <button
                  aria-label={`Toggle ${item.title}`}
                  onClick={() => toggleAssignment(item.id)}
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
                    {item.subject} · due {item.due}
                  </div>
                </div>
                {overdue ? (
                  <span className="rounded-full bg-primary/15 px-2.5 py-1 text-[10px] font-medium tracking-wide text-primary uppercase">
                    Overdue
                  </span>
                ) : null}
                <button
                  aria-label={`Remove ${item.title}`}
                  onClick={() => removeAssignment(item.id)}
                  className="grid size-9 place-items-center rounded-xl bg-muted/60 text-muted-foreground transition-transform duration-300 active:scale-90"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </GlassCard>
          );
        })}
      </div>
    </Screen>
  );
}
