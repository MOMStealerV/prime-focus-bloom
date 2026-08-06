import { auth, defineMcp } from "@lovable.dev/mcp-js";

import buildFocusPlanTool from "./tools/build-focus-plan";
import getFocusQuoteTool from "./tools/get-focus-quote";
import listAchievementsTool from "./tools/list-achievements";
import listFocusPresetsTool from "./tools/list-focus-presets";
import listThemesTool from "./tools/list-themes";

const projectRef = import.meta.env['VITE_SUPABASE_PROJECT_ID'] ?? "project-ref-unset";

export default defineMcp({
  name: "primeflow-focus-and-wellbeing",
  title: "PrimeFlow: Focus and Wellbeing",
  version: "0.1.0",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  instructions:
    "Tools for PrimeFlow, a focus and digital wellbeing app. Use `list_focus_presets` for session lengths, break rules and ambient sounds, `build_focus_plan` to turn a target amount of focus time into a pomodoro schedule, `get_focus_quote` for motivation, `list_achievements` for the milestone catalog and `list_themes` for the available visual themes. Personal focus history lives only in the user's browser and is not exposed here.",
  tools: [
    listFocusPresetsTool,
    buildFocusPlanTool,
    getFocusQuoteTool,
    listAchievementsTool,
    listThemesTool,
  ],
});