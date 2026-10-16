"use client";

import { useEffect, useRef, useState } from "react";
import NumberFlow from "@number-flow/react";
import { Container } from "@/components/layout/Container";
import type { beforeAfterEbitdaContent } from "@/content/home";
import { cn } from "@/lib/cn";

/**
 * Before / After EBITDA — one illustrative portco, as an EBITDA bridge.
 *
 * A white section, split down the middle by a hairline. On the left a big
 * "Before" over "working with us." and, at the foot, the EBITDA it comes to;
 * on the right a line about the chart and the bridge itself, drawn after the
 * owner's reference: a light fill up to a fine line for what was already
 * there, a heavy cap at the new total, and one column — the EBITDA after — in
 * a solid fill.
 *
 * Where there is room the section pins, and halfway through the pin it turns
 * from Before to After: the word rolls up to "After", each source of the gain
 * rises in turn from where the last one ended, "EBITDA after" rises last, the
 * figure on the left rolls to the new EBITDA, and the gain and what it is
 * worth at a multiple arrive under it.
 *
 * THE TURN is decided the way How It Works decides its step: two invisible
 * markers, a screen each, run under the pinned stage, and whichever shows
 * more pixels wins — IntersectionObserver with plain thresholds, so it does
 * not depend on scroll events, which the preview bundle's host can withhold
 * (see BackgroundTransition).
 *
 * Pinning needs the `pin` variant (globals.css): tablet width and a screen
 * tall enough for the stage under the header. Anywhere else the section is
 * laid out plainly and turns by itself once the chart is in view. On a phone
 * the bridge lies on its side: one row per column, bars running right.
 *
 * The section crossfades with the page (`data-bg="white"`, no fill of its
 * own), so everything in it is drawn in the dynamic ink — the chart's lines
 * and fills included, as tints of it. Only the solid column keeps fixed ink.
 */

type Content = typeof beforeAfterEbitdaContent;

/** The `pin` variant's media query, for the JS half of the same decision. */
const pinQuery = "(min-width: 810px) and (min-height: 680px)";

/** The value axis runs from nothing to this, and is labelled every million. */
const AXIS_MAX = 4_000_000;
const TICKS = [0, 1_000_000, 2_000_000, 3_000_000, 4_000_000];

/** Milliseconds between one column rising and the next. */
const STAGGER = 140;

/**
 * "$20M", "$1.2M", "$800K", "$3.75M" — Intl options NumberFlow also takes.
 * The minimum is stated because currency defaults it to two, and Node's ICU
 * honours that under compact notation where the browser's does not: the
 * server rendered "$2.40M" and the browser corrected it.
 */
const money = {
  style: "currency",
  currency: "USD",
  notation: "compact",
  minimumFractionDigits: 0,
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

/**
 * The chart's inks: tints of whatever the page's ink is at the moment, so the
 * lines read while the background is still turning from the green above.
 */
const ink = {
  line: "bg-(--color-fg-dynamic)",
  rule: "bg-(--color-fg-dynamic)/30",
  fill: "bg-(--color-fg-dynamic)/5",
  border: "border-(--color-fg-dynamic)",
};

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
 * One column of the bridge. `base` is what was already there — the total a
 * step starts from, or the EBITDA before under the final column — and `top`
 * is where it ends.
 */
type Bar = {
  label: string;
  base: number;
  top: number;
  text: string;
  kind: "start" | "step" | "end";
  /** Stagger position: when, after the turn, this one rises. */
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
    { label: bars.before, base: ebitda.before, top: ebitda.before, text: formatMoney.format(ebitda.before), kind: "start", order: -1 },
    ...middle,
    { label: bars.after, base: ebitda.before, top: ebitda.after, text: formatMoney.format(ebitda.after), kind: "end", order: steps.length },
  ];
}

/** Whether a column is up, and when it rose. */
function rise(bar: Bar, after: boolean) {
  const shown = bar.kind === "start" || after;
  const delay = after && bar.order >= 0 ? `${bar.order * STAGGER}ms` : "0ms";
  return { shown, delay };
}

type BeforeAfterEbitdaProps = {
  content: Content;
};

export function BeforeAfterEbitda({ content }: BeforeAfterEbitdaProps) {
  const pinned = usePinned();
  const [after, setAfter] = useState(false);

  const chart = useRef<HTMLDivElement>(null);
  const markers = useRef<(HTMLDivElement | null)[]>([]);

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

  // Not pinned: turn once, shortly after the chart is mostly in view.
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

  const { ebitda, revenue, state } = content;
  const bars = bridge(content);
  const gained = ebitda.after - ebitda.before;
  const margin = after ? ebitda.after / revenue.after : ebitda.before / revenue.before;
  // The lines under the figure arrive with the last column.
  const finale = `${(content.steps.length * STAGGER) / 1000 + 0.2}s`;

  return (
    // Ruled across the full width top and bottom, in the same ink as the
    // divider, so the section has an edge to arrive at and leave by. The
    // divider runs the stage's whole height to meet both: the stage starts
    // at the top rule and, pinned, finishes on the bottom one, so the header's
    // clearance is the columns' own padding rather than the stage's.
    <section
      data-bg="white"
      className="relative border-y border-(--color-fg-dynamic)/10 bg-bg-white"
    >
      <div className="pin:sticky pin:top-0 pin:h-svh">
        {/* Two to three: the statement needs little width, the chart's seven
            columns all of it. */}
        <Container className="text-ink-dynamic grid tablet:grid-cols-[2fr_3fr] pin:h-full">
          <div className="flex flex-col pt-20 pb-12 tablet:py-10 tablet:pr-10 desktop:pr-16 pin:pt-[calc(var(--header-height)+2.5rem)]">
            <p className="font-ui text-label tracking-(--tracking-label) uppercase opacity-60">
              {content.example}
            </p>

            <h2 className="sr-only">{content.heading}</h2>
            {/* The word rolls up from one state to the other, inside a frame
                one line tall — the push How It Works gives its tiles. */}
            <div
              aria-hidden="true"
              className="mt-4 font-display text-display-lg leading-(--leading-heading) tracking-(--tracking-display)"
            >
              <div className="h-[1.15em] overflow-clip">
                <div
                  className={cn("transition-[translate]", ease)}
                  style={{ translate: `0 ${after ? "-50%" : "0"}` }}
                >
                  <p className="h-[1.15em]">{state.before}</p>
                  <p className="h-[1.15em]">{state.after}</p>
                </div>
              </div>
              <p className="opacity-40">{state.tail}</p>
            </div>

            <div className="mt-12 tablet:mt-auto">
              <p className="font-body text-body-md">{ebitda.label}</p>
              <NumberFlow
                value={after ? ebitda.after : ebitda.before}
                format={money}
                className="mt-2 font-ui text-stat leading-none font-light"
              />
              <p className="mt-3 font-ui text-body-sm opacity-60">
                <NumberFlow value={margin} format={{ style: "percent", maximumFractionDigits: 1 }} />{" "}
                {content.marginLabel}
              </p>
              <div
                className={cn("mt-5 font-ui text-body-md transition-opacity", ease, after ? "opacity-100" : "opacity-0")}
                style={{ transitionDelay: after ? finale : "0s" }}
              >
                <p>{`${formatGain(gained)} ${content.gainLabel}`}</p>
                <p className="mt-1">{`≈ ${formatGain(gained * content.multiple)} ${content.valueLabel} ${content.multiple}×`}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col border-t border-(--color-fg-dynamic)/10 pt-12 pb-20 tablet:border-t-0 tablet:border-l tablet:py-10 tablet:pl-10 desktop:pl-16 pin:pt-[calc(var(--header-height)+2.5rem)]">
            <p className="max-w-[40ch] font-display text-heading-lg leading-(--leading-heading)">
              {content.lead} <span className="opacity-40">{content.tail}</span>
            </p>

            <div ref={chart} className="mt-10 tablet:mt-auto">
              {/* What a screen reader gets instead of the chart. */}
              <ul className="sr-only">
                {bars.map((bar) => (
                  <li key={bar.label}>{`${bar.label}: ${bar.text}`}</li>
                ))}
              </ul>

              <VerticalBridge bars={bars} after={after} />
              <HorizontalBridge bars={bars} after={after} />
            </div>

            <p className="mt-6 font-ui text-label opacity-60">{content.footnote}</p>
          </div>
        </Container>
      </div>

      {/* The two markers that decide the turn, laid under the pinned stage —
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

/**
 * The bridge upright, from tablet up, after the owner's reference: columns
 * side by side on a heavy baseline with the scale on the right. Each column is
 * one box from nothing to its value, so it rises as a whole — the light fill
 * of what was already there under a fine line, then empty up to the heavy cap
 * at its total, its figure set just above. The final column fills the gain
 * solid instead, and carries its figure inside, as the reference's one
 * coloured column does.
 */
function VerticalBridge({ bars, after }: { bars: Bar[]; after: boolean }) {
  const plot = "h-[clamp(220px,40svh,400px)]";

  return (
    <div aria-hidden="true" className="hidden tablet:block">
      <div className="flex">
        <div className={cn("relative flex-1 border-b-[3px]", plot, ink.border)}>
          <div className="absolute inset-0 grid grid-cols-7">
            {bars.map((bar) => {
              const { shown, delay } = rise(bar, after);
              const height = `${(bar.top / AXIS_MAX) * 100}%`;
              const carried = bar.base / bar.top;
              const end = bar.kind === "end";

              return (
                <div key={bar.label} className="relative h-full">
                  <div
                    className={cn("absolute inset-x-0 bottom-0 overflow-clip transition-[height]", ease)}
                    style={{ height: shown ? height : "0%", transitionDelay: delay }}
                  >
                    {/* What was already there, under its fine line. */}
                    <div
                      className={cn("absolute inset-x-0 bottom-0", ink.fill)}
                      style={{ height: `${carried * 100}%` }}
                    >
                      {bar.kind !== "start" ? (
                        <span className={cn("absolute inset-x-0 top-0 h-0.5", ink.rule)} />
                      ) : null}
                    </div>
                    {end ? (
                      <div
                        className="absolute inset-x-0 top-0 bg-accent"
                        style={{ height: `${(1 - carried) * 100}%` }}
                      >
                        <span className="absolute top-3 left-3 font-ui text-body-md font-medium text-fg-on-light">
                          {bar.text}
                        </span>
                      </div>
                    ) : null}
                    <span className={cn("absolute inset-x-0 top-0 h-[3px]", end ? "bg-fg-on-light" : ink.line)} />
                  </div>

                  {end ? null : (
                    <span
                      className={cn(
                        "absolute left-3 mb-2 font-ui text-body-md font-medium whitespace-nowrap transition-opacity",
                        ease,
                        shown ? "opacity-100" : "opacity-0",
                      )}
                      style={{ bottom: height, transitionDelay: delay }}
                    >
                      {bar.text}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className={cn("relative w-14 shrink-0", plot)}>
          {TICKS.map((tick) => (
            <span
              key={tick}
              className="absolute left-3 translate-y-1/2 font-ui text-label opacity-60"
              style={{ bottom: `${(tick / AXIS_MAX) * 100}%` }}
            >
              {formatMoney.format(tick)}
            </span>
          ))}
        </div>
      </div>

      <div className="mr-14 mt-3 grid grid-cols-7">
        {bars.map((bar) => (
          <span key={bar.label} className="px-1 text-center font-ui text-label leading-tight">
            {bar.label}
          </span>
        ))}
      </div>
    </div>
  );
}

/**
 * The bridge on its side, for a phone: a row per column, each bar running
 * right from nothing to its value against the same scale, drawn the same way.
 */
function HorizontalBridge({ bars, after }: { bars: Bar[]; after: boolean }) {
  return (
    <ul aria-hidden="true" className="flex flex-col gap-3 tablet:hidden">
      {bars.map((bar) => {
        const { shown, delay } = rise(bar, after);
        const carried = bar.base / bar.top;
        const end = bar.kind === "end";

        return (
          <li key={bar.label}>
            <div className="flex items-baseline justify-between gap-3 font-ui text-body-sm">
              <span>{bar.label}</span>
              <span
                className={cn("font-medium transition-opacity", ease, shown ? "opacity-100" : "opacity-0")}
                style={{ transitionDelay: delay }}
              >
                {bar.text}
              </span>
            </div>
            <div className={cn("relative mt-1.5 h-6 border-l-[3px]", ink.border)}>
              <div
                className={cn("absolute inset-y-0 left-0 overflow-clip transition-[width]", ease)}
                style={{
                  width: shown ? `${(bar.top / AXIS_MAX) * 100}%` : "0%",
                  transitionDelay: delay,
                }}
              >
                <div
                  className={cn("absolute inset-y-0 left-0", ink.fill)}
                  style={{ width: `${carried * 100}%` }}
                >
                  {bar.kind !== "start" ? (
                    <span className={cn("absolute inset-y-0 right-0 w-0.5", ink.rule)} />
                  ) : null}
                </div>
                {end ? (
                  <div
                    className="absolute inset-y-0 right-0 bg-accent"
                    style={{ width: `${(1 - carried) * 100}%` }}
                  />
                ) : null}
                <span className={cn("absolute inset-y-0 right-0 w-[3px]", end ? "bg-fg-on-light" : ink.line)} />
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
