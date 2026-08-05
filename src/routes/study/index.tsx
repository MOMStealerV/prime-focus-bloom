import { createFileRoute, Link } from "@tanstack/react-router";
import {
  BookOpen,
  CalendarClock,
  ChevronRight,
  ClipboardList,
  NotebookPen,
  Sparkles,
} from "lucide-react";

import { AnimatedBar } from "@/components/primeflow/AnimatedBar";
import { GlassCard } from "@/components/primeflow/GlassCard";
import { ProgressRing } from "@/components/primeflow/ProgressRing";
import { Screen, ScreenTitle } from "@/components/primeflow/Screen";
import { studySummary, useStudy } from "@/lib/study-store";

export const Route = createFileRoute("/study/")({
  head: () => ({
    meta: [
      { title: "Study Hub — PrimeFlow" },
      {
        name: "description",
        content:
          "Study Hub brings subjects, planner, notes and assignments together so your study time stays organised.",
      },
      { property: "og:title", content: "Study Hub — PrimeFlow" },
      {
        property: "og:description",
        content: "Subjects, planner, notes and assignments in one calm study space.",
      },
    ],
  }),
  component: Study,
});

function Study() {
  const study = useStudy();
  const s = studySummary(study);

  const CARDS = [
    {
      to: "/study/subjects" as const,
      icon: BookOpen,
      title: "Subjects",
      description: "Manage and organize your study subjects.",
      meta: `${s.subjects} active`,
    },
    {
      to: "/study/planner" as const,
      icon: CalendarClock,
      title: "Planner",
      description: "Plan study sessions, exams and revision schedules.",
      meta: `${study.planner.filter((p) => !p.done).length} open`,
    },
    {
      to: "/study/notes" as const,
      icon: NotebookPen,
      title: "Notes",
      description: "Keep all study notes organized in one place.",
      meta: `${s.notes} saved`,
    },
    {
      to: "/study/assignments" as const,
      icon: ClipboardList,
      title: "Assignments",
      description: "Track homework, deadlines and upcoming work.",
      meta: `${s.openAssignments} to do`,
    },
  ];

  return (
    <Screen>
      <ScreenTitle title="Study Hub" subtitle="Your study workspace, in flow" />

      <GlassCard className="relative overflow-hidden p-6" delay={40}>
        <div
          className="pointer-events-none absolute -top-16 -right-10 size-48 rounded-full blur-3xl"
          style={{ background: "var(--backdrop-2)" }}
        />
        <div className="relative flex flex-col items-center">
          <ProgressRing value={s.progress} label={`${s.progress}%`} caption="Today's plan" />
          <p className="mt-5 text-center text-sm leading-relaxed text-muted-foreground">
            {s.nextUp
              ? `Next up: ${s.nextUp.title} · ${s.nextUp.minutes} min of ${s.nextUp.subject}.`
              : "Everything planned is done. Add a session to keep the streak going."}
          </p>
          <Link
            to="/study/planner"
            className="accent-gradient mt-5 w-full rounded-2xl py-3.5 text-center font-display text-sm font-semibold text-primary-foreground shadow-[0_16px_40px_-16px_var(--primary)] transition-transform duration-300 active:scale-[0.98]"
          >
            Open Planner
          </Link>
        </div>
      </GlassCard>

      <div className="mt-4 grid grid-cols-2 gap-3">
        {[
          { label: "Planned today", value: `${Math.round(s.plannedMinutes / 6) / 10}h` },
          { label: "Completed", value: `${Math.round(s.doneMinutes / 6) / 10}h` },
          { label: "Open work", value: `${s.openAssignments}` },
          { label: "Due in 48h", value: `${s.dueSoon}` },
        ].map((stat, i) => (
          <GlassCard key={stat.label} delay={100 + i * 50} className="rounded-3xl p-4">
            <div className="font-display text-2xl font-semibold">{stat.value}</div>
            <div className="mt-0.5 text-[11px] text-muted-foreground">{stat.label}</div>
          </GlassCard>
        ))}
      </div>

      <GlassCard className="mt-4" delay={300}>
        <div className="flex items-center justify-between">
          <h2 className="font-display text-base font-semibold">Weekly subject balance</h2>
          <Link to="/study/subjects" className="text-xs font-medium text-primary">
            View all
          </Link>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          {s.loggedHours}h of {s.targetHours}h target · {s.weekProgress}%
        </p>
        <div className="mt-4 space-y-4">
          {study.subjects.slice(0, 4).map((subject, i) => (
            <div key={subject.id}>
              <div className="mb-2 flex items-baseline justify-between">
                <span className="text-sm font-medium">{subject.name}</span>
                <span className="text-[11px] text-muted-foreground">
                  {subject.loggedHours} / {subject.targetHours}h
                </span>
              </div>
              <AnimatedBar
                value={Math.min(100, Math.round((subject.loggedHours / subject.targetHours) * 100))}
                delay={i * 120}
              />
            </div>
          ))}
        </div>
      </GlassCard>

      <div className="mt-4 space-y-4">
        {CARDS.map(({ to, icon: Icon, title, description, meta }, i) => (
          <Link key={title} to={to} className="block">
            <GlassCard delay={360 + i * 60} className="transition-transform duration-300 active:scale-[0.98]">
              <div className="flex items-start gap-3">
                <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-primary/12">
                  <Icon className="size-[19px] text-primary" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h2 className="font-display text-base font-semibold">{title}</h2>
                    <span className="text-[11px] font-medium text-primary">{meta}</span>
                  </div>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{description}</p>
                </div>
                <ChevronRight className="mt-3 size-4 shrink-0 text-muted-foreground" />
              </div>
            </GlassCard>
          </Link>
        ))}
      </div>

      <GlassCard className="mt-4 border-primary/30" delay={620}>
        <div className="flex gap-3">
          <div className="accent-gradient grid size-9 shrink-0 place-items-center rounded-2xl">
            <Sparkles className="size-4 text-primary-foreground" />
          </div>
          <div>
            <div className="text-[11px] font-medium tracking-[0.16em] text-primary uppercase">
              Study insight
            </div>
            <p className="mt-1.5 text-sm leading-relaxed">
              {s.dueSoon > 0
                ? `${s.dueSoon} assignment${s.dueSoon > 1 ? "s" : ""} due within 48 hours. Block a focus session today to stay ahead.`
                : "Nothing urgent on the horizon. Use the free space for spaced revision of your weakest subject."}
            </p>
          </div>
        </div>
      </GlassCard>
    </Screen>
  );
}
