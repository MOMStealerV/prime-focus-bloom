import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

import { QUOTES } from "@/lib/quotes";

export default defineTool({
  name: "get_focus_quote",
  title: "Get focus quote",
  description:
    "Return a motivational focus quote from PrimeFlow's library. Omit the index for a random quote.",
  inputSchema: {
    index: z
      .number()
      .int()
      .min(0)
      .max(QUOTES.length - 1)
      .optional()
      .describe(`Optional quote index between 0 and ${QUOTES.length - 1}.`),
  },
  annotations: { readOnlyHint: true, openWorldHint: false },
  handler: ({ index }) => {
    const i = index ?? Math.floor(Math.random() * QUOTES.length);
    const quote = QUOTES[i]!;
    return {
      content: [{ type: "text", text: `"${quote.text}" — ${quote.author}` }],
      structuredContent: { index: i, text: quote.text, author: quote.author },
    };
  },
});