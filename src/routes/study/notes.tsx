import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Trash2 } from "lucide-react";

import { GlassCard } from "@/components/primeflow/GlassCard";
import { Screen } from "@/components/primeflow/Screen";
import { ModuleHeader, inputClass, primaryButtonClass } from "@/components/study/ModuleHeader";
import { removeNote, saveNote, useStudy } from "@/lib/study-store";

export const Route = createFileRoute("/study/notes")({
  head: () => ({
    meta: [
      { title: "Notes — PrimeFlow Study Hub" },
      { name: "description", content: "Capture and revisit study notes per subject in one calm place." },
      { property: "og:title", content: "Notes — PrimeFlow Study Hub" },
      { property: "og:description", content: "Capture and revisit study notes per subject." },
    ],
  }),
  component: Notes,
});

function Notes() {
  const { notes, subjects } = useStudy();
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState(subjects[0]?.name ?? "");
  const [body, setBody] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <Screen>
      <ModuleHeader title="Notes" subtitle={`${notes.length} notes saved`} />

      <GlassCard delay={40}>
        <h2 className="font-display text-base font-semibold">New note</h2>
        <div className="mt-3 space-y-2">
          <input
            className={inputClass}
            placeholder="Note title"
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
          <textarea
            className={`${inputClass} min-h-24 resize-none`}
            placeholder="Write it down while it's fresh…"
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
          <button
            className={`${primaryButtonClass} w-full`}
            onClick={() => {
              saveNote({ title, subject, body });
              setTitle("");
              setBody("");
            }}
          >
            Save note
          </button>
        </div>
      </GlassCard>

      <div className="mt-4 space-y-3">
        {notes.map((note, i) => {
          const open = openId === note.id;
          return (
            <GlassCard key={note.id} delay={100 + i * 50} className="rounded-3xl p-4">
              <div className="flex items-start gap-3">
                <button
                  className="min-w-0 flex-1 text-left"
                  onClick={() => setOpenId(open ? null : note.id)}
                >
                  <div className="truncate text-sm font-medium">{note.title}</div>
                  <div className="mt-0.5 text-[11px] text-muted-foreground">
                    {note.subject} · {new Date(note.updated).toLocaleDateString()}
                  </div>
                  <p
                    className={`mt-2 text-sm leading-relaxed text-muted-foreground ${
                      open ? "" : "line-clamp-2"
                    }`}
                  >
                    {note.body}
                  </p>
                </button>
                <button
                  aria-label={`Delete ${note.title}`}
                  onClick={() => removeNote(note.id)}
                  className="grid size-9 shrink-0 place-items-center rounded-xl bg-muted/60 text-muted-foreground transition-transform duration-300 active:scale-90"
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
