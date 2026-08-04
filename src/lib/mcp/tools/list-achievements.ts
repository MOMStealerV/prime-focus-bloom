import { defineTool } from "@lovable.dev/mcp-js";

import { ACHIEVEMENTS } from "@/lib/achievements";

export default defineTool({
  name: "list_achievements",
  title: "List achievements",
  description:
    "List every PrimeFlow achievement and the milestone required to unlock it. Progress itself stays on the user's device.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => ({
    content: [{ type: "text", text: JSON.stringify(ACHIEVEMENTS, null, 2) }],
    structuredContent: { achievements: ACHIEVEMENTS },
  }),
});