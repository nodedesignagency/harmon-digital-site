"use client";

import { useEffect, useRef, useState } from "react";
import NumberFlow from "@number-flow/react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { Container } from "@/components/layout/Container";
import { TextReveal } from "@/components/motion/TextReveal";
import { beforeAfter, sectionTextReveal } from "@/config/animation";
import type { beforeAfterEbitdaContent } from "@/content/home";
import { cn } from "@/lib/cn";

/**
 * Before vs After, as an EBITDA bridge.
 *
 * The opening is the original Before vs After's (BeforeAfter.tsx): the three
 * words pinned in the middle of the screen, parting to either side and fading
 * as the panel below rides up over them. The panel carries an EBITDA bridge
 * after the owner's reference — columns with a heavy cap line at their value
 * and the figure hung under it, one column picked out in a solid fill.
 *
 * Once the panel has arrived it pins too, and the bridge builds as the reader
 * scrolls on: at first only "EBITDA before" stands; halfway through the pin
 * each source of the gain rises in turn, starting where the last one ended,
 * and "EBITDA after" rises last in the dark fill. The figure beside the chart
 * rolls from the old EBITDA to the new, and the enterprise value it is worth
 * appears under it.
 *
 * THE FLIP is decided the way How It Works decides its step: two invisible
 * markers, a screen each, run under the pinned panel, and whichever shows
 * more pixels wins — IntersectionObserver with plain thresholds, so it does
 * not depend on scroll events, which the preview bundle's host can withhold
 * (see BackgroundTransition). The words keep the original's scroll-linked
 * motion; if that is withheld they simply stay put, and the panel still
 * covers them.
 *
 * Pinning needs the `pin` variant (globals.css): tablet width and a screen
 * tall enough for the panel under the header. Anywhere else the section is
 * laid out plainly and the bridge builds by itself once it is in view. On a
 * phone the bridge turns on its side: one row per column, bars running right.
 *
 * The section is the dark green, as the original is (`data-bg="green"`); the
 * panel paints its own light fill, so everything in it keeps fixed ink.
 */

type Content = typeof beforeAfterEbitdaContent;

/** The `pin` variant's media query, for the JS half of the same decision. */
const pinQuery = "(min-width: 810px) and (min-height: 680px)";

/** The value axis runs from nothing to this, and is labelled every million. */
const AXIS_MAX = 4_000_000;
const TICKS = [0, 1_000_000, 2_000_000, 3_000_000, 4_000_000];

/** Milliseconds between one column rising and the next. */
const STAGGER = 140;

/** "$20M", "$1.2M", "$800K", "$3.75M" — Intl options NumberFlow also takes. */
const money = {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 2,
} as const;

const formatMoney = new Intl.NumberFormat("en-US", money);

/** "+$350K" for a step of the bridge. */
function formatGain(value: number) {
  return `+${formatMoney.format(value)}`;
}

/** Visible-share thresholds, 5% apart — the background handover's grain. */
const thresholds = Array.from({ length: 21 }, (_, i) => i / 20);

/** One curve and pace for every bar and fade, the one How It Works uses. */
const ease = "duration-700 ease-(--ease-case-hover) motion-reduce:transition-none";

/** Whether the section pins. Assumed so before the first paint, when it is at rest anyway. */
function usePinned() {
  const [pinned, setPinned] = useState(true);

  useEffect(() => {
    const query = window.matchMedia(pinQuery);
    const read = () => setPinned(query.matches);
    read();
    query.addEventListener("change", read);
    return () => query.removeEventListener("change", read);
  }, []);

  return pinned;
}

/**
 * One column of the bridge. `base` is where it starts and `top` where it ends;
 * the totals start from nothing, each step from the total before it.
 */
type Bar = {
  label: string;
  base: number;
  top: number;
  text: string;
  kind: "start" | "step" | "end";
  /** Stagger position: when, after the flip, this one rises. */
  order: number;
};

function bridge(content: Content): Bar[] {
  const { ebitda, steps, bars } = content;
  let running = ebitda.before;

  const middle = steps.map((step, i): Bar => {
    const bar: Bar = {
      label: step.label,
      base: running,
      top: running + step.value,
      text: formatGain(step.value),
      kind: "step",
      order: i,
    };
    running += step.value;
    return bar;
  });

  return [
    { label: bars.before, base: 0, top: ebitda.before, text: formatMoney.format(ebitda.before), kind: "start", order: -1 },
    ...middle,
    { label: bars.after, base: 0, top: ebitda.after, text: formatMoney.format(ebitda.after), kind: "end", order: steps.length },
  ];
}

/** Fill above the carried total: the gain in green, the result in the site's dark. */
const fills: Record<Bar["kind"], string> = {
  start: "bg-bg-white",
  step: "bg-tool-shape-green",
  end: "bg-bg",
};

type BeforeAfterEbitdaProps = {
  content: Content;
};

export function BeforeAfterEbitda({ content }: BeforeAfterEbitdaProps) {
  const pinned = usePinned();
  const reduced = useReducedMotion() ?? false;
  const [after, setAfter] = useState(false);

  const panel = useRef<HTMLDivElement>(null);
  const chart = useRef<HTMLDivElement>(null);
  const markers = useRef<(HTMLDivElement | null)[]>([]);

  // The original's words: zero when the panel is a screen away, one when it
  // has arrived.
  const { scrollYProgress } = useScroll({
    target: panel,
    offset: ["start end", "start start"],
  });
  const spread = reduced ? 0 : beforeAfter.spread;
  const before = useTransform(scrollYProgress, [0, 1], [0, -spread]);
  const afterX = useTransform(scrollYProgress, [0, 1], [0, spread]);
  const fade = useTransform(scrollYProgress, [0, 1], [1, 0]);

  // Pinned: whichever of the two markers shows more pixels decides the state;
  // ties go to the later one, as they do for the background.
  useEffect(() => {
    if (!pinned) return;
    const [first, second] = markers.current;
    if (!first || !second) return;

    const visible = new Map<Element, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          visible.set(entry.target, entry.isIntersecting ? entry.intersectionRect.height : 0);
        }
        const a = visible.get(first) ?? 0;
        const b = visible.get(second) ?? 0;
        if (a > 0 || b > 0) setAfter(b >= a);
      },
      { threshold: thresholds },
    );

    observer.observe(first);
    observer.observe(second);
    return () => observer.disconnect();
  }, [pinned]);

  // Not pinned: build once, shortly after the chart is mostly in view.
  useEffect(() => {
    if (pinned) return;
    const node = chart.current;
    if (!node) return;

    let timer: number | undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        observer.disconnect();
        timer = window.setTimeout(() => setAfter(true), 600);
      },
      { threshold: 0.6 },
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
    };
  }, [pinned]);

  const { ebitda, revenue } = content;
  const bars = bridge(content);
  const gained = ebitda.after - ebitda.before;
  const margin = after ? ebitda.after / revenue.after : ebitda.before / revenue.before;
  // The words under the figure arrive with the last column.
  const finale = `${(content.steps.length * STAGGER) / 1000 + 0.2}s`;

  return (
    <section data-bg="green" className="relative bg-bg py-20 pin:py-0">
      <div className="flex items-center justify-center overflow-hidden pb-14 pin:sticky pin:top-0 pin:h-svh pin:pb-0">
        {/* Explicitly white, as in the original: these words are only ever on
            the dark ground. */}
        <p className="flex w-full items-center justify-center gap-2.5 text-display-lg leading-(--leading-display) tracking-(--tracking-display) font-normal text-fg">
          <motion.span style={pinned ? { x: before, opacity: fade } : undefined}>
            {content.headingBefore}
          </motion.span>
          <motion.span style={pinned ? { opacity: fade } : undefined}>
            {content.headingJoin}
          </motion.span>
          <motion.span style={pinned ? { x: afterX, opacity: fade } : undefined}>
            {content.headingAfter}
          </motion.span>
        </p>
      </div>

      <div
        ref={panel}
        className="relative z-10 pin:sticky pin:top-0 pin:flex pin:h-svh pin:items-center pin:pt-header"
      >
        <Container>
          <div className="grid gap-10 bg-bg-light p-6 text-fg-on-light tablet:grid-cols-[0.8fr_1.6fr] tablet:p-10 desktop:gap-16">
            <div className="flex flex-col">
              <p className="font-ui text-label tracking-(--tracking-label) text-fg-on-light-muted uppercase">
                {content.example}
              </p>
              <TextReveal
                as="h2"
                lines={content.titleLines}
                settings={sectionTextReveal}
                className="mt-4 flex flex-col items-start gap-(--space-heading-line) text-display-md leading-(--leading-display) tracking-(--tracking-display) font-normal"
              />
              <p className="mt-4 max-w-[40ch] font-body text-body-sm text-fg-on-light-muted">
                {content.body}
              </p>

              <div className="mt-8 tablet:mt-auto">
                <p className="font-body text-body-md">{ebitda.label}</p>
                <NumberFlow
                  value={after ? ebitda.after : ebitda.before}
                  format={money}
                  className="mt-1 font-ui text-stat-sm leading-none font-light"
                />
                <p className="mt-2 font-ui text-body-sm text-fg-on-light-muted">
                  <NumberFlow value={margin} format={{ style: "percent", maximumFractionDigits: 1 }} />{" "}
                  {content.marginLabel}
                </p>
                <div
                  className={cn("mt-4 font-ui text-body-md transition-opacity", ease, after ? "opacity-100" : "opacity-0")}
                  style={{ transitionDelay: after ? finale : "0s" }}
                >
                  <p>{`${formatGain(gained)} ${content.gainLabel}`}</p>
                  <p className="mt-1">{`≈ ${formatGain(gained * content.multiple)} ${content.valueLabel} ${content.multiple}×`}</p>
                </div>
              </div>
            </div>

            <div ref={chart}>
              {/* What a screen reader gets instead of the chart. */}
              <ul className="sr-only">
                {bars.map((bar) => (
                  <li key={bar.label}>{`${bar.label}: ${bar.text}`}</li>
                ))}
              </ul>

              <VerticalBridge bars={bars} after={after} />
              <HorizontalBridge bars={bars} after={after} />

              <p className="mt-6 font-ui text-label text-fg-on-light-muted">{content.footnote}</p>
            </div>
          </div>
        </Container>
      </div>

      {/* The two markers that decide the flip, laid under the pinned panel —
          from its top, a screen each, which is what holds it for one screen
          of scrolling. Empty and click-through. */}
      <div aria-hidden="true" className="pointer-events-none hidden pin:-mt-[100svh] pin:block">
        {[0, 1].map((i) => (
          <div
            key={i}
            ref={(node) => {
              markers.current[i] = node;
            }}
            className="h-svh"
          />
        ))}
      </div>
    </section>
  );
}

/** Whether a column is up, and when it rose. */
function rise(bar: Bar, after: boolean) {
  const shown = bar.kind === "start" || after;
  const delay = after && bar.order >= 0 ? `${bar.order * STAGGER}ms` : "0ms";
  return { shown, delay };
}

/**
 * The bridge upright, from tablet up: columns on a heavy baseline with the
 * scale on the right. Each column is one box from nothing to its value, so it
 * can rise as a whole: the total it carries in white, the part it adds above
 * that, the cap line, and the figure hung under the cap.
 */
function VerticalBridge({ bars, after }: { bars: Bar[]; after: boolean }) {
  return (
    <div aria-hidden="true" className="hidden tablet:block">
      <div className="flex">
        <div className="relative h-[320px] flex-1 border-b-[3px] border-fg-on-light">
          <div className="absolute inset-0 grid grid-cols-7 gap-1.5">
            {bars.map((bar) => {
              const { shown, delay } = rise(bar, after);
              const carried = bar.base / bar.top;

              return (
                <div key={bar.label} className="relative h-full">
                  <div
                    className={cn("absolute inset-x-0 bottom-0 overflow-clip transition-[height]", ease)}
                    style={{
                      height: shown ? `${(bar.top / AXIS_MAX) * 100}%` : "0%",
                      transitionDelay: delay,
                    }}
                  >
                    {bar.kind === "step" ? (
                      <div
                        className="absolute inset-x-0 bottom-0 border-t border-fg-on-light/25 bg-bg-white"
                        style={{ height: `${carried * 100}%` }}
                      />
                    ) : null}
                    <div
                      className={cn("absolute inset-x-0 top-0", fills[bar.kind])}
                      style={{ height: `${(1 - carried) * 100}%` }}
                    />
                    <div
                      className={cn(
                        "absolute inset-x-0 top-0 h-[3px]",
                        bar.kind === "end" ? "bg-accent" : "bg-fg-on-light",
                      )}
                    />
                    {/* Under the cap on the totals; under the green band on a
                        step, whose band can be thinner than the figure. */}
                    <span
                      className={cn(
                        "absolute left-2 font-ui text-body-sm whitespace-nowrap",
                        bar.kind === "end" ? "text-fg" : "text-fg-on-light",
                      )}
                      style={{
                        top: bar.kind === "step" ? `calc(${(1 - carried) * 100}% + 8px)` : "10px",
                      }}
                    >
                      {bar.text}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="relative h-[320px] w-14 shrink-0">
          {TICKS.map((tick) => (
            <span
              key={tick}
              className="absolute left-3 translate-y-1/2 font-ui text-label text-fg-on-light-muted"
              style={{ bottom: `${(tick / AXIS_MAX) * 100}%` }}
            >
              {formatMoney.format(tick)}
            </span>
          ))}
        </div>
      </div>

      <div className="mr-14 mt-3 grid grid-cols-7 gap-1.5">
        {bars.map((bar) => (
          <span key={bar.label} className="text-center font-body text-body-sm leading-tight">
            {bar.label}
          </span>
        ))}
      </div>
    </div>
  );
}

/**
 * The bridge on its side, for a phone: a row per column, each bar running
 * right from nothing to its value against the same scale.
 */
function HorizontalBridge({ bars, after }: { bars: Bar[]; after: boolean }) {
  return (
    <ul aria-hidden="true" className="flex flex-col gap-3 tablet:hidden">
      {bars.map((bar) => {
        const { shown, delay } = rise(bar, after);
        const carried = bar.base / bar.top;

        return (
          <li key={bar.label}>
            <div className="flex items-baseline justify-between gap-3 font-body text-body-sm">
              <span>{bar.label}</span>
              <span
                className={cn("font-ui transition-opacity", ease, shown ? "opacity-100" : "opacity-0")}
                style={{ transitionDelay: delay }}
              >
                {bar.text}
              </span>
            </div>
            <div className="relative mt-1.5 h-5 border-l-[3px] border-fg-on-light">
              <div
                className={cn("absolute inset-y-0 left-0 overflow-clip transition-[width]", ease)}
                style={{
                  width: shown ? `${(bar.top / AXIS_MAX) * 100}%` : "0%",
                  transitionDelay: delay,
                }}
              >
                {bar.kind === "step" ? (
                  <div
                    className="absolute inset-y-0 left-0 border-r border-fg-on-light/25 bg-bg-white"
                    style={{ width: `${carried * 100}%` }}
                  />
                ) : null}
                <div
                  className={cn("absolute inset-y-0 right-0", fills[bar.kind])}
                  style={{ width: `${(1 - carried) * 100}%` }}
                />
                <div
                  className={cn(
                    "absolute inset-y-0 right-0 w-[3px]",
                    bar.kind === "end" ? "bg-accent" : "bg-fg-on-light",
                  )}
                />
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
