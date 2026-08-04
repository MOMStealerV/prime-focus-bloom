import { defineTool } from "@lovable.dev/mcp-js";

import { AMBIENT_SOUNDS, SESSION_PRESETS } from "@/data/mock";
import {
  LONG_BREAK_EVERY,
  LONG_BREAK_MINUTES,
  MAX_MINUTES,
  MIN_MINUTES,
  SHORT_BREAK_MINUTES,
  DAILY_GOAL_MINUTES,
} from "@/types/focus";

export default defineTool({
  name: "list_focus_presets",
  title: "List focus presets",
  description:
    "List PrimeFlow's focus session presets, allowed custom durations, break rules and ambient soundscapes.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => {
    const config = {
      presetMinutes: SESSION_PRESETS,
      customRange: { minMinutes: MIN_MINUTES, maxMinutes: MAX_MINUTES },
      breaks: {
        shortBreakMinutes: SHORT_BREAK_MINUTES,
        longBreakMinutes: LONG_BREAK_MINUTES,
        longBreakEveryFocusBlocks: LONG_BREAK_EVERY,
      },
      dailyGoalMinutes: DAILY_GOAL_MINUTES,
      ambientSounds: AMBIENT_SOUNDS,
    };
    return {
      content: [{ type: "text", text: JSON.stringify(config, null, 2) }],
      structuredContent: config,
    };
  },
});