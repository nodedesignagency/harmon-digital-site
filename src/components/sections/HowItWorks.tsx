"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import Image from "next/image";
import NumberFlow from "@number-flow/react";
import { useReducedMotion } from "motion/react";
import { Container } from "@/components/layout/Container";
import { TextReveal } from "@/components/motion/TextReveal";
import { featureArtwork } from "@/components/ui/featureArtwork";
import { sectionTextRevealBeige, stepSweep } from "@/config/animation";
import type { FeatureTone, howItWorksContent } from "@/content/home";
import { cn } from "@/lib/cn";
import { hoverRectBox, hoverRectFrom } from "@/lib/hoverRect";

/**
 * How It Works — a pinned scroll, after the owner's reference.
 *
 * Two halves. On the left a stage holds still in the middle of the screen: the
 * step's number, large and faint, and a tile carrying the step's picture. On
 * the right the steps' words scroll past normally. Whichever step owns the
 * middle of the screen is the active one — its words at full ink, the others
 * a step back — and when the next one takes over, the number rolls to it and
 * blocks sweep across the tile while the picture and tint change underneath.
 *
 * WHAT DECIDES the active step is the same rule the page background uses:
 * most visible pixels, from IntersectionObserver entries with plain
 * thresholds. Nothing reads scroll events, `scrollY` or `rootMargin`, all of
 * which the preview bundle's host can withhold (see BackgroundTransition).
 * The step rows are equal-height, so "most visible" hands over exactly as the
 * boundary between two rows crosses the middle of the screen.
 *
 * THE GEOMETRY that keeps words and tile level: the stage is a screen tall
 * and centred, each row is 75svh with its words centred in it, and the list
 * carries 12.5svh above and below. That puts the first row's words level with
 * the tile before the stage pins and the last row's words level with it as it
 * lets go, with no measuring.
 *
 * Below the tablet there is no stage — 375svh of pinned scrolling to read five
 * short steps is a lot on a phone — and each step shows its own number and
 * tile inline instead.
 *
 * The section crossfades with the page (`data-bg="beige"`, no keep), so every
 * word here is set in the dynamic ink: as the dark case studies arrive below,
 * the last step's words follow the background rather than going dark on dark.
 */

/** Tile fills — the tech stack's tints, whose shapes are one step deeper. */
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

type Step = (typeof howItWorksContent)["steps"][number];

export function HowItWorks({ content }: HowItWorksProps) {
  const { steps } = content;
  const reduced = useReducedMotion() ?? false;
  const rows = useRef<(HTMLLIElement | null)[]>([]);

  /** The step that owns the middle of the screen: number and words follow it. */
  const [active, setActive] = useState(0);
  /** The step the tile shows — `active`, half a sweep later. */
  const [shown, setShown] = useState(0);
  /** Bumped on every change, to remount the blocks and replay their sweep. */
  const [sweep, setSweep] = useState(0);

  useEffect(() => {
    const items = rows.current.filter((row): row is HTMLLIElement => row !== null);
    if (items.length === 0) return;

    const visible = new Map<Element, number>();
    let current = 0;
    let swap: number | undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          visible.set(entry.target, entry.isIntersecting ? entry.intersectionRect.height : 0);
        }

        // Most visible pixels wins; ties go to the later row, as they do for
        // the background, so a step takes over the moment it covers as much.
        let next = current;
        let most = 0;
        items.forEach((item, i) => {
          const pixels = visible.get(item) ?? 0;
          if (pixels >= most && pixels > 0) {
            most = pixels;
            next = i;
          }
        });
        if (next === current) return;
        current = next;
        setActive(next);

        // Asked for less motion: no blocks, and the tile changes with the words.
        if (reduced) {
          setShown(next);
          return;
        }
        setSweep((count) => count + 1);
        window.clearTimeout(swap);
        swap = window.setTimeout(() => setShown(next), stepSweep.duration / 2);
      },
      { threshold: thresholds },
    );

    items.forEach((item) => observer.observe(item));
    return () => {
      observer.disconnect();
      window.clearTimeout(swap);
    };
  }, [reduced, steps.length]);

  return (
    <section data-bg="beige" className="bg-bg-light pt-20 pb-10 text-fg-on-light tablet:pb-0">
      <Container className="px-10">
        <div className="flex flex-col gap-8 tablet:flex-row tablet:items-start tablet:justify-between">
          <TextReveal
            as="h2"
            lines={content.headingLines}
            settings={sectionTextRevealBeige}
            lineStagger={sectionTextRevealBeige.lineStagger}
            className="flex flex-col items-start gap-(--space-heading-line) text-display-lg leading-(--leading-display) tracking-(--tracking-display) font-normal"
          />
          <p className="text-ink-dynamic max-w-[46ch] font-body text-body-md tablet:pt-2">
            {content.subheading}
          </p>
        </div>

        <div className="mt-10 tablet:mt-0 tablet:grid tablet:grid-cols-2 tablet:gap-10 desktop:gap-20">
          {/* The stage. Its cell runs the full height of the list beside it,
              and the stage itself is sticky inside that — the pin lasts
              exactly as long as there are steps to scroll past. Decorative:
              the list says everything it shows. */}
          <div aria-hidden="true" className="max-tablet:hidden">
            <div className="sticky top-0 flex h-svh items-center gap-8 desktop:gap-12">
              {/* Geist, as every figure on the site is. Rolls digit by digit
                  to the next step, like the reference. */}
              <NumberFlow
                value={active + 1}
                prefix="/"
                format={{ minimumIntegerDigits: 2 }}
                className="text-ink-dynamic shrink-0 font-ui text-stat-sm font-light leading-none opacity-25"
              />
              <StepTile
                steps={steps}
                shown={shown}
                incoming={steps[active]}
                sweep={sweep}
                className="w-full max-w-[320px]"
              />
            </div>
          </div>

          <ol className="flex flex-col gap-14 tablet:gap-0 tablet:py-[12.5svh]">
            {steps.map((step, i) => (
              <li
                key={step.title}
                ref={(row) => {
                  rows.current[i] = row;
                }}
                className="flex flex-col justify-center gap-6 tablet:min-h-[75svh]"
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

type StepTileProps = {
  steps: readonly Step[];
  /** The step whose picture and tint are on the tile. */
  shown: number;
  /** The step arriving — its deeper tint is the blocks' colour. */
  incoming: Step;
  /** Changes on every step change; remounting the blocks replays the sweep. */
  sweep: number;
  className?: string;
};

/**
 * The square tile on the stage: a tint, the step's 3D picture on it, and the
 * blocks that sweep across when the step changes.
 *
 * Every picture is mounted and the shown one is opaque, so a change never
 * waits on an image load — it lands under the blocks at the sweep's midpoint.
 */
function StepTile({ steps, shown, incoming, sweep, className }: StepTileProps) {
  return (
    <div
      className={cn(
        "relative aspect-square overflow-clip transition-colors duration-200",
        tiles[steps[shown].tone],
        className,
      )}
    >
      {steps.map((step, i) => (
        <Image
          key={step.title}
          src={featureArtwork[step.image]}
          alt=""
          sizes="(max-width: 1199px) 30vw, 320px"
          className={cn(
            "absolute top-[15%] left-[15%] size-[70%] object-contain transition-opacity duration-200",
            i === shown ? "opacity-100" : "opacity-0",
          )}
        />
      ))}

      {/* Keyed on the sweep count: a new key is a new element, and a new
          element plays its animation from the start. Before the first change
          there is no sweep class, so the blocks wait outside the tile. */}
      <div
        key={sweep}
        className={cn("pointer-events-none absolute inset-0", sweep > 0 && "mh-step-sweep")}
        style={
          {
            "--mh-step-shape": `var(--color-tool-shape-${incoming.tone})`,
            "--mh-step-duration": `${stepSweep.duration}ms`,
          } as CSSProperties
        }
      >
        {stepSweep.rects.map((rect, r) => (
          <span
            key={r}
            className="mh-step-block"
            style={
              {
                ...hoverRectBox(rect),
                "--mh-step-from": hoverRectFrom(rect),
              } as CSSProperties
            }
          />
        ))}
      </div>
    </div>
  );
}
