export const QUOTES = [
  { text: "Almost everything will work again if you unplug it for a few minutes.", author: "Anne Lamott" },
  { text: "The successful warrior is the average person with laser-like focus.", author: "Bruce Lee" },
  { text: "It is not that we have a short time to live, but that we waste a lot of it.", author: "Seneca" },
  { text: "You do not rise to the level of your goals. You fall to the level of your systems.", author: "James Clear" },
  { text: "Where attention goes, energy flows.", author: "James Redfield" },
  { text: "Simplicity is the ultimate sophistication.", author: "Leonardo da Vinci" },
  { text: "Slow is smooth, and smooth is fast.", author: "Proverb" },
  { text: "Concentration is the secret of strength.", author: "Ralph Waldo Emerson" },
  { text: "Small daily improvements are the key to staggering long-term results.", author: "Unknown" },
  { text: "Breathe. This moment is enough.", author: "Thich Nhat Hanh" },
  { text: "Deep work is like a superpower in an increasingly competitive economy.", author: "Cal Newport" },
  { text: "Do less, but better.", author: "Dieter Rams" },
] as const;

export type Quote = (typeof QUOTES)[number];

/** Picks a new quote index that is never the same as the current one. */
export function nextQuoteIndex(current: number) {
  if (QUOTES.length < 2) return 0;
  let next = current;
  while (next === current) next = Math.floor(Math.random() * QUOTES.length);
  return next;
}