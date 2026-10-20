import type { CSSProperties } from "react";
import { Container } from "@/components/layout/Container";
import { TextReveal } from "@/components/motion/TextReveal";
import { sectionTextRevealDynamic } from "@/config/animation";
import { cn } from "@/lib/cn";

/**
 * Who it's for — the three kinds of partner.
 *
 * After Ploy's "Who's Ploy for?" on Mobbin, in the site's terms: the heading
 * and a line on the left, and on the right three panels, each the partner's
 * name set large with its one line under it at the foot, and a small square in
 * each corner as a drafting mark. No picture: the client asked for no 3D
 * artwork anywhere, and the tint and the name carry the panel.
 *
 * The panels stack as the reader scrolls, exactly as the home page's portfolio
 * files do (PortfolioDashboards): each sticks one step lower than the one
 * before and the next rides up over it, leaving a band of each earlier tint
 * above it, while the heading holds still beside them. Nothing but
 * `position: sticky` — no script, no scroll events. The band an earlier panel
 * leaves is its fill and its two top corner marks.
 *
 * Follows the Careers-style gallery that rides over the hero, so it is an
 * ordinary white section that crossfades with the page: the words beside the
 * stack take the dynamic ink, the panels paint their own tints and keep fixed
 * ink.
 *
 * Tints come from content (`tone`), at the 50 depth text sits on.
 *
 * A server component; only the heading moves.
 */

export type AudienceTone = "lavender" | "rose" | "peach";

type PartnerAudienceProps = {
  content: {
    headingLines: readonly string[];
    subheading: string;
    cards: readonly {
      title: string;
      body: string;
      tone: AudienceTone;
    }[];
  };
};

/** Fills come from theme.css; the section never names a colour itself. */
const tints: Record<AudienceTone, string> = {
  lavender: "bg-tool-lavender",
  rose: "bg-tool-rose",
  peach: "bg-tool-peach",
};

/** The four corner marks, 8 in from each edge. */
const corners = ["top-2 left-2", "top-2 right-2", "bottom-2 left-2", "bottom-2 right-2"];

/**
 * How much lower each panel sticks than the one before, px: the panel's top
 * padding (`pt-8`, at every size) — a band of the tint with its corner marks.
 */
const STEP = 32;
/**
 * The least space between the fixed header and the top of the stack, px.
 * Taller than that, the stack is centred under the header (`stackTop`).
 */
const GAP = 24;

/**
 * The last panel's height: as tall as the screen allows once the header, the
 * gaps and the bands piled above it are taken out — capped at a little more
 * than the name and its line need, so a tall screen does not get a cavernous
 * panel.
 */
function panelHeight(panels: number) {
  return `min(220px, calc(100svh - var(--header-height) - ${GAP * 2 + STEP * (panels - 1)}px))`;
}

/**
 * Each earlier panel is a step taller per panel still to come, so that
 * settled, every one ends on the same line and the stack lets go as one —
 * with equal heights the last panel left first and wiped the bands above it.
 */
function bodyHeight(index: number, panels: number) {
  return `calc(var(--panel-h) + ${(panels - 1 - index) * STEP}px)`;
}

/**
 * Where the settled stack and the words beside it pin: centred in the screen
 * under the header, never closer to it than GAP. Shared by the words and every
 * panel, so they stay level.
 */
const stackTop = `calc(var(--header-height) + max(${GAP}px, (100svh - var(--header-height) - var(--stack-h)) / 2))`;

export function PartnerAudience({ content }: PartnerAudienceProps) {
  const panels = content.cards.length;

  return (
    <section data-bg="white" className="bg-bg-white py-20 tablet:py-30">
      <Container>
        <div
          className="grid gap-12 desktop:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] desktop:gap-16"
          style={
            {
              "--panel-h": panelHeight(panels),
              "--stack-h": `calc(var(--panel-h) + ${STEP * (panels - 1)}px)`,
              "--stack-top": stackTop,
            } as CSSProperties
          }
        >
          {/* From desktop up, pinned level with the first panel and exactly as
              tall as the settled stack, so the words hold beside the panels
              and leave with them. */}
          <div className="text-ink-dynamic desktop:sticky desktop:top-(--stack-top) desktop:h-(--stack-h) desktop:self-start">
            <TextReveal
              as="h2"
              lines={content.headingLines}
              settings={sectionTextRevealDynamic}
              className="flex flex-col items-start gap-(--space-heading-line) text-display-lg leading-(--leading-display) tracking-(--tracking-display) font-normal"
            />
            <p className="mt-6 max-w-[36ch] font-body text-body-md">{content.subheading}</p>
          </div>

          <ul>
            {content.cards.map((card, i) => (
              <li
                key={card.title}
                className={cn(
                  // The name and its line together at the foot.
                  "sticky flex flex-col justify-end overflow-clip px-6 pt-8 pb-6 text-fg-on-light tablet:p-8",
                  tints[card.tone],
                )}
                style={{
                  top: `calc(var(--stack-top) + ${i * STEP}px)`,
                  height: bodyHeight(i, panels),
                }}
              >
                {corners.map((corner) => (
                  <span
                    key={corner}
                    aria-hidden="true"
                    className={cn("absolute size-1.5 bg-fg-on-light", corner)}
                  />
                ))}

                <div>
                  <h3 className="font-display text-display-lg leading-(--leading-display) tracking-(--tracking-display) font-normal">
                    {card.title}
                  </h3>
                  <p className="mt-3 font-body text-body-md">{card.body}</p>
                </div>
              </li>
            ))}

            {/* The hold: once the last panel has settled, the stack stays put
                for this much more scrolling before it leaves. Inside the list
                rather than padding on it — a sticky box is held by its
                container's content, and padding would not count. */}
            <li aria-hidden="true" className="h-[25svh]" />
          </ul>
        </div>
      </Container>
    </section>
  );
}
