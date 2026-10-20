import type { ReactNode } from "react";
import type { FeatureTone } from "@/content/home";
import { cn } from "@/lib/cn";

/**
 * One card from the feature strip.
 *
 * Every card is the same object — a title across the top, a small product
 * screen in the middle (see ProductScreen), a line of copy at the foot — and
 * only the words, the screen and the tint change. Those are props; nothing else about a card is configurable,
 * which is what keeps six of them looking like one set.
 *
 * Geometry is fixed at the original's 265×400. The card is a fixed-size tile in
 * a row that scrolls, not a fluid box, so it does not respond to its container.
 */

/** Fills come from theme.css; the card never names a colour itself. */
const tones: Record<FeatureTone, string> = {
  blue: "bg-card-blue",
  magenta: "bg-card-magenta",
  green: "bg-card-green",
  rose: "bg-card-rose",
  lavender: "bg-card-lavender",
  peach: "bg-card-peach",
};

type FeatureCardProps = {
  title: string;
  body: string;
  tone: FeatureTone;
  /**
   * What stands in the middle: the card's product screen. Omitted, the tile
   * keeps its size and reserves the space rather than collapsing, so the row's
   * rhythm holds and a missing picture is obvious instead of invisible.
   */
  art?: ReactNode;
  className?: string;
};

export function FeatureCard({ title, body, tone, art, className }: FeatureCardProps) {
  return (
    <article
      className={cn(
        "relative h-[400px] w-[265px] shrink-0 overflow-clip",
        tones[tone],
        className,
      )}
    >
      <h3 className="absolute top-[29px] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-body-md tracking-(--tracking-display) whitespace-nowrap uppercase">
        {title}
      </h3>

      {/* The 260 square the artwork always had, the screen centred in it at
          the card's full width, so its construction lines run to the edges. */}
      {art ? (
        <div className="absolute top-[calc(50%-28px)] left-1/2 flex size-[260px] -translate-x-1/2 -translate-y-1/2 items-center justify-center">
          <div className="w-[265px] shrink-0">{art}</div>
        </div>
      ) : (
        <div
          aria-hidden
          className="absolute top-[calc(50%-28px)] left-1/2 size-[260px] -translate-x-1/2 -translate-y-1/2 rounded-sm border border-dashed border-border-on-light"
        />
      )}

      <p className="absolute bottom-5 left-1/2 w-[225px] -translate-x-1/2 text-center text-body-md leading-(--leading-card) font-light">
        {body}
      </p>
    </article>
  );
}
