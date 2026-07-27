import { Pause, Play, Volume2 } from "lucide-react";

import { useFocusEngine } from "@/hooks/useFocusEngine";
import { AMBIENT_SOUNDS, type AmbientId } from "@/lib/ambient-sound";

export function AmbientPlayer({ compact = false }: { compact?: boolean }) {
  const { state, setSound, setVolume, setPlaying } = useFocusEngine();

  return (
    <div className="w-full">
      <div className="flex flex-wrap justify-center gap-2">
        {AMBIENT_SOUNDS.map((item) => {
          const active = item.id === state.ambientSound;
          return (
            <button
              key={item.id}
              type="button"
              aria-pressed={active}
              onClick={() => setSound(item.id as AmbientId)}
              className={`press rounded-full px-4 py-2 text-xs font-medium focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none active:scale-95 ${
                active ? "accent-gradient text-primary-foreground" : "bg-muted/50 text-muted-foreground"
              }`}
            >
              {item.name}
            </button>
          );
        })}
      </div>

      {compact ? null : (
        <div className="mt-4 flex items-center gap-3">
          <button
            type="button"
            onClick={() => setPlaying(!state.ambientPlaying)}
            aria-label={state.ambientPlaying ? "Pause ambient sound" : "Play ambient sound"}
            className="press glass grid size-11 place-items-center rounded-2xl focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none active:scale-95"
          >
            {state.ambientPlaying ? (
              <Pause className="size-4 text-primary" />
            ) : (
              <Play className="size-4 text-primary" />
            )}
          </button>
          <Volume2 className="size-4 text-muted-foreground" aria-hidden />
          <input
            type="range"
            min={0}
            max={100}
            value={Math.round(state.ambientVolume * 100)}
            aria-label="Ambient volume"
            onChange={(event) => setVolume(Number(event.target.value) / 100)}
            className="h-1.5 w-full flex-1 cursor-pointer appearance-none rounded-full bg-muted accent-[var(--primary)]"
          />
        </div>
      )}
    </div>
  );
}