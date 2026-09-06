/**
 * TEMPORARY documentation tool — extracts design tokens straight from source.
 *
 * Colors, radii, fonts and gradients are parsed from the real `src/styles.css`
 * text; spacing / radius / typography usage is tallied from the actual JSX
 * className strings. Nothing here is visually inferred and nothing is mutated.
 */
import stylesSource from "../styles.css?raw";

export type ColorToken = {
  variable: string;
  utility: string | null;
  value: string;
  hex: string;
};

export type ThemeTokens = {
  id: string;
  name: string;
  tone: "dark" | "light";
  selector: string;
  colors: ColorToken[];
};

export type UsageEntry = { token: string; value: string | null; occurrences: number };

export type GradientToken = { name: string; source: string; definition: string };

export type DesignTokens = {
  generatedAt: string;
  source: string;
  fonts: { token: string; value: string; usedFor: string }[];
  radiusScale: { token: string; value: string }[];
  themes: { dark: ThemeTokens[]; light: ThemeTokens[] };
  gradients: GradientToken[];
  usage: {
    screenPadding: UsageEntry[];
    gaps: UsageEntry[];
    borderRadius: UsageEntry[];
    fontSizes: UsageEntry[];
    fontWeights: UsageEntry[];
  };
};

/* ---------------------------------------------------------------- color ---- */

function clamp01(n: number) {
  return Math.min(1, Math.max(0, n));
}

function toHex2(n: number) {
  return Math.round(clamp01(n) * 255)
    .toString(16)
    .padStart(2, "0");
}

/** oklch(L C H [/ A]) -> #rrggbb(aa) */
export function oklchToHex(input: string): string {
  const m = input.trim().match(/^oklch\(\s*([\d.]+%?)\s+([\d.]+%?)\s+([\d.]+)(?:\s*\/\s*([\d.]+%?))?\s*\)$/i);
  if (!m) return input;
  const num = (raw: string, pctBase: number) =>
    raw.endsWith("%") ? (parseFloat(raw) / 100) * pctBase : parseFloat(raw);

  const L = num(m[1], 1);
  const C = num(m[2], 0.4);
  const H = parseFloat(m[3]);
  const A = m[4] === undefined ? 1 : num(m[4], 1);

  const h = (H * Math.PI) / 180;
  const a = C * Math.cos(h);
  const b = C * Math.sin(h);

  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;

  const l = l_ ** 3;
  const mm = m_ ** 3;
  const s = s_ ** 3;

  const lr = +4.0767416621 * l - 3.3077115913 * mm + 0.2309699292 * s;
  const lg = -1.2684380046 * l + 2.6097574011 * mm - 0.3413193965 * s;
  const lb = -0.0041960863 * l - 0.7034186147 * mm + 1.707614701 * s;

  const gamma = (v: number) =>
    v <= 0.0031308 ? 12.92 * v : 1.055 * Math.sign(v) * Math.abs(v) ** (1 / 2.4) - 0.055;

  const hex = `#${toHex2(gamma(lr))}${toHex2(gamma(lg))}${toHex2(gamma(lb))}`;
  return A >= 1 ? hex : `${hex}${toHex2(A)}`;
}

/* --------------------------------------------------------------- parsing --- */

/** Maps `--color-x: var(--x)` registrations back to their utility base name. */
function utilityMap(): Record<string, string> {
  const map: Record<string, string> = {};
  for (const block of stylesSource.match(/@theme inline\s*\{[\s\S]*?\n\}/g) ?? []) {
    for (const [, util, ref] of block.matchAll(/--color-([\w-]+)\s*:\s*var\(--([\w-]+)\)/g)) {
      map[`--${ref}`] = util;
    }
  }
  return map;
}

function blockFor(selector: string): string {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(`(?:^|\\n)[^{}]*${escaped}[^{}]*\\{([\\s\\S]*?)\\n\\}`, "m");
  return stylesSource.match(re)?.[1] ?? "";
}

function colorsFor(selector: string): ColorToken[] {
  const utils = utilityMap();
  const out: ColorToken[] = [];
  for (const [, name, raw] of blockFor(selector).matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) {
    const value = raw.trim();
    if (!value.startsWith("oklch")) continue;
    out.push({
      variable: name,
      utility: utils[name] ? `${utils[name]} (bg-/text-/border-)` : null,
      value,
      hex: oklchToHex(value),
    });
  }
  return out;
}

const THEME_META = [
  { id: "midnight", name: "Midnight Flow", tone: "dark", selector: '[data-theme="midnight"]' },
  { id: "emerald", name: "Emerald Focus", tone: "dark", selector: '[data-theme="emerald"]' },
  { id: "sakura", name: "Sakura Glow", tone: "light", selector: '[data-theme="sakura"]' },
  { id: "arctic", name: "Arctic White", tone: "light", selector: '[data-theme="arctic"]' },
] as const;

/** Base tokens live in the shared `:root, [data-theme="midnight"]` block. */
function themeTokens(meta: (typeof THEME_META)[number]): ThemeTokens {
  const base = meta.id === "midnight" ? colorsFor(":root,") : [];
  const own = colorsFor(meta.selector);
  const merged = new Map<string, ColorToken>();
  for (const t of [...base, ...own]) merged.set(t.variable, t);
  return {
    id: meta.id,
    name: meta.name,
    tone: meta.tone,
    selector: meta.selector,
    colors: [...merged.values()].sort((a, b) => a.variable.localeCompare(b.variable)),
  };
}

function fonts() {
  const out: { token: string; value: string; usedFor: string }[] = [];
  for (const [, name, value] of stylesSource.matchAll(/--font-([\w-]+)\s*:\s*([^;]+);/g)) {
    out.push({
      token: `--font-${name}`,
      value: value.trim(),
      usedFor: name === "display" ? "h1–h4 and .font-display headings" : "body text and labels",
    });
  }
  return out;
}

function radiusScale() {
  const out: { token: string; value: string }[] = [];
  const rootRadius = blockFor(":root,").match(/--radius\s*:\s*([^;]+);/)?.[1]?.trim();
  if (rootRadius) out.push({ token: "--radius", value: rootRadius });
  for (const [, name, value] of stylesSource.matchAll(/--radius-([\w-]+)\s*:\s*([^;]+);/g)) {
    out.push({ token: `--radius-${name}`, value: value.trim() });
  }
  return out;
}

function gradients(sources: Record<string, string>): GradientToken[] {
  const out: GradientToken[] = [];
  for (const [, name, body] of stylesSource.matchAll(/@utility\s+([\w-]+)\s*\{([\s\S]*?)\n\}/g)) {
    for (const [, def] of body.matchAll(/((?:linear|radial|conic)-gradient\([^;]*\))/g)) {
      out.push({ name: `.${name}`, source: "src/styles.css", definition: def.trim() });
    }
  }
  for (const [path, code] of Object.entries(sources)) {
    for (const [, def] of code.matchAll(/((?:linear|radial|conic)-gradient\([^)]*\([^)]*\)[^)]*\)|(?:linear|radial|conic)-gradient\([^)]*\))/g)) {
      out.push({ name: "inline style", source: path.replace(/^\//, ""), definition: def.trim() });
    }
  }
  return out;
}

/* ----------------------------------------------------------- usage scan ---- */

const SPACING_STEP: Record<string, string> = {
  "0": "0px", "0.5": "2px", "1": "4px", "1.5": "6px", "2": "8px", "2.5": "10px",
  "3": "12px", "3.5": "14px", "4": "16px", "5": "20px", "6": "24px", "7": "28px",
  "8": "32px", "9": "36px", "10": "40px", "11": "44px", "12": "48px", "14": "56px",
  "16": "64px", "20": "80px", "24": "96px", "28": "112px", "32": "128px",
};

const FONT_SIZE: Record<string, string> = {
  xs: "12px", sm: "14px", base: "16px", lg: "18px", xl: "20px",
  "2xl": "24px", "3xl": "30px", "4xl": "36px", "5xl": "48px",
};

function tally(sources: Record<string, string>, re: RegExp, resolve: (key: string) => string | null) {
  const counts = new Map<string, number>();
  for (const code of Object.values(sources)) {
    for (const match of code.matchAll(re)) {
      const token = match[0];
      counts.set(token, (counts.get(token) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([token, occurrences]) => ({ token, value: resolve(token), occurrences }))
    .sort((a, b) => b.occurrences - a.occurrences);
}

function spacingValue(token: string): string | null {
  const arbitrary = token.match(/\[([^\]]+)\]$/);
  if (arbitrary) return arbitrary[1];
  const step = token.split("-").pop()!;
  return SPACING_STEP[step] ?? null;
}

function radiusValue(token: string): string | null {
  const arbitrary = token.match(/\[([^\]]+)\]$/);
  if (arbitrary) return arbitrary[1];
  const key = token.replace(/^rounded-?/, "") || "DEFAULT";
  const named: Record<string, string> = {
    DEFAULT: "0.25rem", none: "0px", sm: "calc(1.75rem - 4px)", md: "calc(1.75rem - 2px)",
    lg: "1.75rem", xl: "calc(1.75rem + 4px)", "2xl": "calc(1.75rem + 8px)",
    "3xl": "calc(1.75rem + 12px)", full: "9999px",
  };
  return named[key] ?? null;
}

export function collectDesignTokens(): DesignTokens {
  const sources = import.meta.glob("/src/**/*.{tsx,ts}", {
    query: "?raw",
    import: "default",
    eager: true,
  }) as Record<string, string>;

  const app = Object.fromEntries(
    Object.entries(sources).filter(([p]) => !p.includes("ui-gallery") && !p.includes("/gallery/")),
  );

  return {
    generatedAt: new Date().toISOString(),
    source: "Parsed from src/styles.css and src/**/*.tsx className usage",
    fonts: fonts(),
    radiusScale: radiusScale(),
    themes: {
      dark: THEME_META.filter((t) => t.tone === "dark").map(themeTokens),
      light: THEME_META.filter((t) => t.tone === "light").map(themeTokens),
    },
    gradients: gradients(app),
    usage: {
      screenPadding: tally(app, /\b-?p[xytrbl]?-(?:\[[^\]\s]+\]|[\d.]+)/g, spacingValue),
      gaps: tally(app, /\bgap(?:-[xy])?-(?:\[[^\]\s]+\]|[\d.]+)|\bspace-[xy]-(?:\[[^\]\s]+\]|[\d.]+)/g, spacingValue),
      borderRadius: tally(app, /\brounded(?:-[a-z]+)?(?:-(?:\[[^\]\s]+\]|none|sm|md|lg|xl|2xl|3xl|full))?\b/g, radiusValue),
      fontSizes: tally(app, /\btext-(?:\[[^\]\s]+\]|xs|sm|base|lg|xl|2xl|3xl|4xl|5xl)\b/g, (t) => {
        const arb = t.match(/\[([^\]]+)\]$/);
        return arb ? arb[1] : (FONT_SIZE[t.replace("text-", "")] ?? null);
      }),
      fontWeights: tally(app, /\bfont-(?:thin|light|normal|medium|semibold|bold|extrabold|black|display|sans)\b/g, (t) => {
        const w: Record<string, string> = {
          thin: "100", light: "300", normal: "400", medium: "500",
          semibold: "600", bold: "700", extrabold: "800", black: "900",
        };
        const key = t.replace("font-", "");
        return w[key] ?? (key === "display" ? "font-family: var(--font-display)" : "font-family: var(--font-sans)");
      }),
    },
  };
}

/* ---------------------------------------------------------------- output --- */

function usageTable(title: string, rows: UsageEntry[]) {
  const lines = [`### ${title}`, "", "| Class | Resolved value | Occurrences |", "| --- | --- | --- |"];
  for (const r of rows) lines.push(`| \`${r.token}\` | ${r.value ?? "—"} | ${r.occurrences} |`);
  return [...lines, ""].join("\n");
}

function themeSection(theme: ThemeTokens) {
  const lines = [
    `### ${theme.name} (\`${theme.id}\`, ${theme.tone})`,
    "",
    `Selector: \`${theme.selector}\``,
    "",
    "| Variable | Tailwind utility | Source value | Hex |",
    "| --- | --- | --- | --- |",
  ];
  for (const c of theme.colors) {
    lines.push(`| \`${c.variable}\` | ${c.utility ?? "—"} | \`${c.value}\` | \`${c.hex}\` |`);
  }
  return [...lines, ""].join("\n");
}

export function tokensToMarkdown(t: DesignTokens): string {
  return [
    "# PrimeFlow Design Tokens",
    "",
    `Generated ${t.generatedAt} — ${t.source}`,
    "",
    "## Typography",
    "",
    "| Token | Value | Used for |",
    "| --- | --- | --- |",
    ...t.fonts.map((f) => `| \`${f.token}\` | ${f.value} | ${f.usedFor} |`),
    "",
    usageTable("Font sizes in use", t.usage.fontSizes),
    usageTable("Font weights / families in use", t.usage.fontWeights),
    "## Spacing",
    "",
    usageTable("Padding (screens, cards)", t.usage.screenPadding),
    usageTable("Gaps between elements", t.usage.gaps),
    "## Border radius",
    "",
    "| Token | Value |",
    "| --- | --- |",
    ...t.radiusScale.map((r) => `| \`${r.token}\` | ${r.value} |`),
    "",
    usageTable("Radius classes in use (cards, buttons, sheets, nav)", t.usage.borderRadius),
    "## Gradients",
    "",
    "| Name | Source | Definition |",
    "| --- | --- | --- |",
    ...t.gradients.map((g) => `| \`${g.name}\` | ${g.source} | \`${g.definition}\` |`),
    "",
    "## Colors — dark themes",
    "",
    ...t.themes.dark.map(themeSection),
    "## Colors — light themes",
    "",
    ...t.themes.light.map(themeSection),
  ].join("\n");
}
