import { defineTool } from "@lovable.dev/mcp-js";

const THEMES = [
  { id: "midnight", name: "Midnight Flow", tagline: "Deep charcoal, electric blue", tone: "dark" },
  { id: "sakura", name: "Sakura Glow", tagline: "Soft petals, rose accent", tone: "light" },
  { id: "emerald", name: "Emerald Focus", tagline: "Forest slate, emerald light", tone: "dark" },
  { id: "arctic", name: "Arctic White", tagline: "Warm white, indigo accent", tone: "light" },
] as const;

export default defineTool({
  name: "list_themes",
  title: "List themes",
  description: "List the PrimeFlow visual themes a user can switch between in Settings.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => ({
    content: [{ type: "text", text: JSON.stringify(THEMES, null, 2) }],
    structuredContent: { themes: THEMES },
  }),
});