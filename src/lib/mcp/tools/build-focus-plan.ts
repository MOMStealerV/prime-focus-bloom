import { defineTool, ToolError } from "@lovable.dev/mcp-js";
import { z } from "zod";

import {
  LONG_BREAK_EVERY,
  LONG_BREAK_MINUTES,
  MAX_MINUTES,
  MIN_MINUTES,
  SHORT_BREAK_MINUTES,
} from "@/types/focus";

type Block = { order: number; kind: "focus" | "break"; minutes: number };

export default defineTool({
  name: "build_focus_plan",
  title: "Build focus plan",
  description:
    "Build a PrimeFlow pomodoro plan: split a target amount of focus time into focus blocks with short and long breaks.",
  inputSchema: {
    totalFocusMinutes: z
      .number()
      .int()
      .min(MIN_MINUTES)
      .max(12 * 60)
      .describe("Total minutes of focus time to plan for."),
    blockMinutes: z
      .number()
      .int()
      .min(MIN_MINUTES)
      .max(MAX_MINUTES)
      .default(45)
      .describe(`Length of each focus block (${MIN_MINUTES}-${MAX_MINUTES} minutes).`),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ totalFocusMinutes, blockMinutes }) => {
    const size = blockMinutes ?? 45;
    if (size > totalFocusMinutes) {
      throw new ToolError("blockMinutes cannot be longer than totalFocusMinutes.");
    }

    const blocks: Block[] = [];
    let remaining = totalFocusMinutes;
    let focusCount = 0;
    let order = 1;

    while (remaining > 0) {
      const minutes = Math.min(size, remaining);
      blocks.push({ order: order++, kind: "focus", minutes });
      remaining -= minutes;
      focusCount += 1;
      if (remaining > 0) {
        const isLong = focusCount % LONG_BREAK_EVERY === 0;
        blocks.push({
          order: order++,
          kind: "break",
          minutes: isLong ? LONG_BREAK_MINUTES : SHORT_BREAK_MINUTES,
        });
      }
    }

    const breakMinutes = blocks
      .filter((b) => b.kind === "break")
      .reduce((sum, b) => sum + b.minutes, 0);
    const plan = {
      focusBlocks: focusCount,
      focusMinutes: totalFocusMinutes,
      breakMinutes,
      totalElapsedMinutes: totalFocusMinutes + breakMinutes,
      blocks,
    };

    return {
      content: [{ type: "text", text: JSON.stringify(plan, null, 2) }],
      structuredContent: plan,
    };
  },
});