import { useEffect, useState } from "react";

import { QUOTES, nextQuoteIndex } from "@/lib/quotes";

const ROTATE_MS = 3 * 60 * 1000;

export function QuoteCard({ className }: { className?: string }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(nextQuoteIndex(-1));
    const id = window.setInterval(() => setIndex((current) => nextQuoteIndex(current)), ROTATE_MS);
    return () => window.clearInterval(id);
  }, []);

  const quote = QUOTES[index];

  return (
    <figure key={index} className={`animate-fade-swap max-w-[300px] text-center ${className ?? ""}`}>
      <blockquote className="text-sm leading-relaxed text-muted-foreground">
        “{quote.text}”
      </blockquote>
      <figcaption className="mt-2 text-[11px] tracking-[0.16em] text-muted-foreground uppercase">
        {quote.author}
      </figcaption>
    </figure>
  );
}