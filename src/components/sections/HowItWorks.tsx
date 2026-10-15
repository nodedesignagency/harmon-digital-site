"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import NumberFlow from "@number-flow/react";
import { Container } from "@/components/layout/Container";
import { TextReveal } from "@/components/motion/TextReveal";
import { featureArtwork } from "@/components/ui/featureArtwork";
import { sectionTextRevealBeige } from "@/config/animation";
import type { FeatureTone, howItWorksContent } from "@/content/home";
import { cn } from "@/lib/cn";

/**
 * How It Works — a pinned scroll, after the owner's reference.
 *
 * Two halves. On the left a stage holds still in the middle of the screen: the
 * step's number, large and faint, and a tile carrying the step's picture. On
 * the right the steps' words scroll past normally. Whichever step holds the
 * middle of the screen is the active one — its words at full ink, the others
 * a step back — and when the next one takes over, the number rolls up to it
 * and the next tile pushes the current one up and out of the frame.
 *
 * WHAT DECIDES the active step is the same rule the page background uses:
 * most visible pixels, from IntersectionObserver entries with plain
 * thresholds. Nothing reads scroll events, `scrollY` or `rootMargin`, all of
 * which the preview bundle's host can withhold (see BackgroundTransition).
 * The rows are equal and half a screen tall, so the most visible one is
 * always the one holding the middle of the screen.
 *
 * THE STAGE is exactly one row tall (half a screen) with the tile centred in
 * it, and sticks a quarter-screen from the top — so pinned, the tile's centre
 * is the screen's centre. Being one row tall is what lines the words up: the
 * stage starts level with the first row and lets go level with the last, so
 * each step's words pass through the tile's centre, and the pin ends exactly
 * as the last step's words are centred on the tile.
 *
 * Below the tablet there is no stage — pinned scrolling to read five short
 * steps is a lot on a phone — and each step shows its own number and tile
 * inline instead.
 *
 * The section crossfades with the page (`data-bg="beige"`, no keep), so every
 * word here is set in the dynamic ink: as the dark case studies arrive below,
 * the last step's words follow the background rather than going dark on dark.
 */

/** Tile fills — the tech stack's tints. */
const tiles: Record<FeatureTone, string> = {
  blue: "bg-tool-blue",
  magenta: "bg-tool-magenta",
  green: "bg-tool-green",
  rose: "bg-tool-rose",
  lavender: "bg-tool-lavender",
  peach: "bg-tool-peach",
};

/** Visible-share thresholds, 5% apart — the background handover's grain. */
const thresholds = Array.from({ length: 21 }, (_, i) => i / 20);

/** "/01". The stage rolls its number; the phone rows print theirs. */
function stepNumber(index: number) {
  return `/${String(index + 1).padStart(2, "0")}`;
}

type HowItWorksProps = {
  content: typeof howItWorksContent;
};

export function HowItWorks({ content }: HowItWorksProps) {
  const { steps } = content;
  const rows = useRef<(HTMLLIElement | null)[]>([]);

  /** The step holding the middle of the screen: number, tile and ink follow it. */
  const [active, setActive] = useState(0);

  useEffect(() => {
    const items = rows.current.filter((row): row is HTMLLIElement => row !== null);
    if (items.length === 0) return;

    const visible = new Map<Element, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          visible.set(entry.target, entry.isIntersecting ? entry.intersectionRect.height : 0);
        }
        // Most visible pixels wins; ties go to the later row, as they do for
        // the background, so a step takes over the moment it covers as much.
        let next = -1;
        let most = 0;
        items.forEach((item, i) => {
          const pixels = visible.get(item) ?? 0;
          if (pixels >= most && pixels > 0) {
            most = pixels;
            next = i;
          }
        });
        if (next >= 0) setActive(next);
      },
      { threshold: thresholds },
    );

    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, [steps.length]);

  return (
    <section data-bg="beige" className="bg-bg-light py-20 text-fg-on-light">
      <Container className="px-10">
        {/* Centred, as the pricing section's opening is. */}
        <TextReveal
          as="h2"
          lines={content.headingLines}
          settings={sectionTextRevealBeige}
          lineStagger={sectionTextRevealBeige.lineStagger}
          className="flex flex-col items-center gap-(--space-heading-line) text-center text-display-lg leading-(--leading-display) tracking-(--tracking-display) font-normal"
        />
        <p className="text-ink-dynamic mx-auto mt-6 max-w-[56ch] text-center font-body text-body-md">
          {content.subheading}
        </p>

        <div className="mt-15 tablet:grid tablet:grid-cols-2 tablet:gap-10 desktop:gap-20">
          {/* The stage. Its cell runs the full height of the list beside it,
              and the stage is sticky inside that, so the pin lasts exactly as
              long as there are steps to scroll past. Decorative: the list
              says everything it shows. */}
          <div aria-hidden="true" className="max-tablet:hidden">
            <div className="sticky top-[25svh] flex h-[50svh] items-center gap-8 desktop:gap-12">
              {/* Geist, as every figure on the site is. Rolls up digit by
                  digit, the same direction the tiles travel.

                  In a fixed-width slot: Geist's figures are proportional, so
                  "/01" is narrower than "/02", and while the number sized
                  itself the roll shoved the tile sideways at every step. */}
              <div className="w-28 shrink-0">
                <NumberFlow
                  value={active + 1}
                  prefix="/"
                  format={{ minimumIntegerDigits: 2 }}
                  className="text-ink-dynamic font-ui text-stat-sm font-light leading-none opacity-25"
                />
              </div>

              {/* The tiles stand in a column inside a one-tile frame. The
                  column moves up by a tile per step, so the next tile pushes
                  the current one up and out — the stack in the brief. */}
              <div className="relative size-60 shrink-0 overflow-clip desktop:size-80">
                <div
                  className="flex flex-col transition-[translate] duration-700 ease-(--ease-case-hover) motion-reduce:transition-none"
                  style={{ translate: `0 ${(-active * 100) / steps.length}%` }}
                >
                  {steps.map((step) => (
                    <div
                      key={step.title}
                      className={cn("relative size-60 shrink-0 desktop:size-80", tiles[step.tone])}
                    >
                      <Image
                        src={featureArtwork[step.image]}
                        alt=""
                        sizes="(max-width: 1199px) 240px, 320px"
                        className="absolute top-[15%] left-[15%] size-[70%] object-contain"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <ol className="flex flex-col gap-14 tablet:gap-0">
            {steps.map((step, i) => (
              <li
                key={step.title}
                ref={(row) => {
                  rows.current[i] = row;
                }}
                className="flex flex-col justify-center gap-6 tablet:min-h-[50svh]"
              >
                {/* A phone has no stage, so each step carries its own. */}
                <div aria-hidden="true" className="flex items-center gap-6 tablet:hidden">
                  <span className="text-ink-dynamic font-ui text-stat-sm font-light leading-none opacity-25">
                    {stepNumber(i)}
                  </span>
                  <div className={cn("relative size-28 shrink-0", tiles[step.tone])}>
                    <Image
                      src={featureArtwork[step.image]}
                      alt=""
                      sizes="112px"
                      className="absolute top-[15%] left-[15%] size-[70%] object-contain"
                    />
                  </div>
                </div>

                {/* The active step at full ink, the rest a step back — from the
                    tablet up, where there is a stage to be level with. */}
                <div
                  className={cn(
                    "flex flex-col gap-4 transition-opacity duration-500",
                    i === active ? "tablet:opacity-100" : "tablet:opacity-25",
                  )}
                >
                  <h3 className="text-ink-dynamic font-display text-display-md leading-(--leading-heading) tracking-(--tracking-display) font-normal">
                    <span className="sr-only">{`Step ${i + 1}: `}</span>
                    {step.title}
                  </h3>
                  <p className="text-ink-dynamic max-w-[44ch] font-body text-body-md">
                    {step.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}
