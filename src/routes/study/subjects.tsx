import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";

import { GlassCard } from "@/components/primeflow/GlassCard";
import { Screen } from "@/components/primeflow/Screen";
import { AnimatedBar } from "@/components/primeflow/AnimatedBar";
import { ModuleHeader, inputClass, primaryButtonClass } from "@/components/study/ModuleHeader";
import { addSubject, logSubjectHours, removeSubject, useStudy } from "@/lib/study-store";

export const Route = createFileRoute("/study/subjects")({
  head: () => ({
    meta: [
      { title: "Subjects — PrimeFlow Study Hub" },
      { name: "description", content: "Create subjects, set weekly hour targets and log study time." },
      { property: "og:title", content: "Subjects — PrimeFlow Study Hub" },
      { property: "og:description", content: "Create subjects, set targets and log study time." },
    ],
  }),
  component: Subjects,
});

function Subjects() {
  const { subjects } = useStudy();
  const [name, setName] = useState("");
  const [target, setTarget] = useState("4");

  return (
    <Screen>
      <ModuleHeader title="Subjects" subtitle={`${subjects.length} subjects in rotation`} />

      <GlassCard delay={40}>
        <h2 className="font-display text-base font-semibold">Add a subject</h2>
        <div className="mt-3 space-y-2">
          <input
            className={inputClass}
            placeholder="Subject name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <div className="flex gap-2">
            <input
              className={inputClass}
              type="number"
              min="1"
              placeholder="Weekly hours"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
            />
            <button
              className={primaryButtonClass}
              onClick={() => {
                addSubject(name, Number(target) || 4);
                setName("");
              }}
            >
              Add
            </button>
          </div>
        </div>
      </GlassCard>

      <div className="mt-4 space-y-3">
        {subjects.map((subject, i) => {
          const pct = Math.min(100, Math.round((subject.loggedHours / subject.targetHours) * 100));
          return (
            <GlassCard key={subject.id} delay={100 + i * 60} className="rounded-3xl p-4">
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium">{subject.name}</div>
                  <div className="mt-0.5 text-[11px] text-muted-foreground">
                    {subject.loggedHours} / {subject.targetHours}h this week
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    aria-label={`Log 30 minutes less for ${subject.name}`}
                    onClick={() => logSubjectHours(subject.id, -0.5)}
                    className="grid size-9 place-items-center rounded-xl bg-muted/60 text-muted-foreground transition-transform duration-300 active:scale-90"
                  >
                    <Minus className="size-4" />
                  </button>
                  <button
                    aria-label={`Log 30 minutes for ${subject.name}`}
                    onClick={() => logSubjectHours(subject.id, 0.5)}
                    className="accent-gradient grid size-9 place-items-center rounded-xl text-primary-foreground transition-transform duration-300 active:scale-90"
                  >
                    <Plus className="size-4" />
                  </button>
                  <button
                    aria-label={`Remove ${subject.name}`}
                    onClick={() => removeSubject(subject.id)}
                    className="grid size-9 place-items-center rounded-xl bg-muted/60 text-muted-foreground transition-transform duration-300 active:scale-90"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
              <div className="mt-3">
                <AnimatedBar value={pct} delay={i * 100} />
              </div>
            </GlassCard>
          );
        })}
      </div>
    </Screen>
  );
}
