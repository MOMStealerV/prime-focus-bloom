import { createFileRoute } from "@tanstack/react-router";
import { BookOpen, CalendarClock, ClipboardList, NotebookPen } from "lucide-react";

import { GlassCard } from "@/components/primeflow/GlassCard";
import { Screen, ScreenTitle } from "@/components/primeflow/Screen";

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

const CARDS = [
  {
    icon: BookOpen,
    title: "Subjects",
    description: "Manage and organize your study subjects.",
  },
  {
    icon: CalendarClock,
    title: "Planner",
    description: "Plan study sessions, exams and revision schedules.",
  },
  {
    icon: NotebookPen,
    title: "Notes",
    description: "Keep all study notes organized in one place.",
  },
  {
    icon: ClipboardList,
    title: "Assignments",
    description: "Track homework, deadlines and upcoming work.",
  },
];

function Study() {
  return (
    <Screen>
      <ScreenTitle title="Study Hub" subtitle="Your study workspace, taking shape" />

      <div className="space-y-4">
        {CARDS.map(({ icon: Icon, title, description }, i) => (
          <GlassCard key={title} delay={60 + i * 60}>
            <div className="flex items-start gap-3">
              <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-primary/12">
                <Icon className="size-[19px] text-primary" />
              </span>
              <div>
                <h2 className="font-display text-base font-semibold">{title}</h2>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{description}</p>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </Screen>
  );
}