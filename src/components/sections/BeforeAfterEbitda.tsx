"use client";

import { useEffect, useRef, useState } from "react";
import NumberFlow from "@number-flow/react";
import { Container } from "@/components/layout/Container";
import { TextReveal } from "@/components/motion/TextReveal";
import { BillingToggle } from "@/components/ui/BillingToggle";
import { sectionTextRevealDynamic } from "@/config/animation";
import type { FeatureTone, beforeAfterEbitdaContent } from "@/content/home";
import { cn } from "@/lib/cn";

/**
 * Before / After EBITDA — one illustrative portco's numbers, before and after.
 *
 * Where there is room the section pins: a stage holds still under the header
 * while the reader scrolls, and halfway through the pin it flips from Before
 * to After. Every figure rolls to its new value, the cost bars shrink and the
 * revenue bars grow, the margin climbs past a mark left where it started, and
 * the dark card counts up the EBITDA gained and what it is worth at a
 * multiple, with a bar showing where it came from.
 *
 * THE FLIP is decided the way How It Works decides its step: two invisible
 * markers, each a screen tall, run under the pinned stage, and whichever
 * shows more pixels wins — IntersectionObserver with plain thresholds. Nothing
 * reads scroll events, `scrollY` or `rootMargin`, which the preview bundle's
 * host can withhold (see BackgroundTransition). The track is two screens tall,
 * so the stage is held for one screen of scrolling: Before for the first
 * half, After for the second.
 *
 * "Room" is the `pin` variant in globals.css: tablet width and a screen at
 * least 780 tall, which is what the whole stage needs under the header — a
 * sticky block taller than the screen freezes the page. Anywhere else the
 * stage is laid out plainly and flips by itself once the P&L card is in view,
 * a moment after the reader arrives at it. The toggle switches it back and
 * forth at every size; it is the Pricing page's billing switch, borrowed.
 *
 * The section crossfades with the page (`data-bg="white"`), so the heading
 * and the lines beside it follow the dynamic ink; the cards paint their own
 * fills and keep fixed ink.
 */

type Content = typeof beforeAfterEbitdaContent;

/** The `pin` variant's media query, for the JS half of the same decision. */
const pinQuery = "(min-width: 810px) and (min-height: 780px)";

/** Bar fills — the deeper tints the tech stack's hover uses. */
const fills: Record<FeatureTone, string> = {
  blue: "bg-tool-shape-blue",
  magenta: "bg-tool-shape-magenta",
  green: "bg-tool-shape-green",
  rose: "bg-tool-shape-rose",
  lavender: "bg-tool-shape-lavender",
  peach: "bg-tool-shape-peach",
};

/** "$20M", "$1.2M", "$800K", "$3.75M" — Intl options NumberFlow also takes. */
const money = {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 2,
} as const;

const formatMoney = new Intl.NumberFormat("en-US", money);

/** "+$1.2M" / "−$350K" for the change beside each figure. */
function formatChange(value: number) {
  return `${value > 0 ? "+" : "−"}${formatMoney.format(Math.abs(value))}`;
}

/** The margin bar's full width: a 20% margin fills it. */
const MARGIN_SCALE = 0.2;

/** Visible-share thresholds, 5% apart — the background handover's grain. */
const thresholds = Array.from({ length: 21 }, (_, i) => i / 20);

/** One curve and pace for every bar and fade, the one How It Works uses. */
const ease = "duration-700 ease-(--ease-case-hover) motion-reduce:transition-none";

/** Whether the stage pins. Assumed so before the first paint, when it is at rest anyway. */
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

type BeforeAfterEbitdaProps = {
  content: Content;
};

export function BeforeAfterEbitda({ content }: BeforeAfterEbitdaProps) {
  const pinned = usePinned();
  const [after, setAfter] = useState(false);

  const markers = useRef<(HTMLDivElement | null)[]>([]);
  const card = useRef<HTMLDivElement>(null);

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

  // Not pinned: flip once, shortly after the P&L card is mostly in view.
  useEffect(() => {
    if (pinned) return;
    const node = card.current;
    if (!node) return;

    let timer: number | undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        observer.disconnect();
        timer = window.setTimeout(() => setAfter(true), 900);
      },
      { threshold: 0.75 },
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
    };
  }, [pinned]);

  const { lines, ebitda, gain } = content;
  const revenue = lines[0];
  const added = ebitda.after - ebitda.before;
  const marginBefore = ebitda.before / revenue.before;
  const margin = after ? ebitda.after / revenue.after : marginBefore;

  return (
    <section data-bg="white" className="relative bg-bg-white text-fg-on-light">
      <div className="relative">
        <div className="py-20 pin:sticky pin:top-0 pin:flex pin:h-svh pin:items-center pin:py-0 pin:pt-header">
          <Container>
            {/* The heading left; the line about it and the switch right, as the
                AI Employees section sets its opening. */}
            <div className="flex flex-col gap-6 tablet:flex-row tablet:items-end tablet:justify-between">
              <TextReveal
                as="h2"
                lines={content.headingLines}
                settings={sectionTextRevealDynamic}
                className="flex flex-col items-start gap-(--space-heading-line) text-display-lg leading-(--leading-display) tracking-(--tracking-display) font-normal"
              />
              <div className="flex flex-col items-start gap-4">
                <p className="text-ink-dynamic max-w-[54ch] font-body text-body-sm">
                  {content.subheading}
                </p>
                <BillingToggle
                  yearly={after}
                  onChange={setAfter}
                  name={content.toggle.name}
                  labels={{ monthly: content.toggle.before, yearly: content.toggle.after }}
                />
              </div>
            </div>

            {/* What a screen reader gets instead of the moving figures. */}
            <ul className="sr-only">
              {[...lines, ebitda].map((line) => (
                <li key={line.label}>
                  {`${line.label}: ${formatMoney.format(line.before)} before, ${formatMoney.format(line.after)} after.`}
                </li>
              ))}
              <li>{`${gain.label}: ${formatChange(added)}, about ${formatChange(added * gain.multiple)} in enterprise value at ${gain.multiple}×.`}</li>
            </ul>

            {/* 6 between the cards, as the AI Employees bento has it. */}
            <div aria-hidden="true" className="mt-6 grid gap-1.5 tablet:grid-cols-2">
              {/* The P&L: four lines, then the EBITDA they come to. */}
              <div ref={card} className="flex flex-col bg-bg-light p-6">
                <p className="font-ui text-label tracking-(--tracking-label) text-fg-on-light-muted uppercase">
                  {content.example}
                </p>

                <ul className="mt-5 flex flex-col gap-4">
                  {lines.map((line) => (
                    <li key={line.label}>
                      <Line line={line} after={after} />
                    </li>
                  ))}
                </ul>

                <div className="mt-6 border-t border-border-on-light pt-5 tablet:mt-auto">
                  <Line line={{ ...ebitda, tone: "green" }} after={after} total />
                </div>
              </div>

              <div className="grid gap-1.5">
                {/* The margin, climbing past a mark left where it started. */}
                <div className="flex flex-col bg-bg-light p-6 pb-10">
                  <p className="font-body text-body-md">{content.margin.label}</p>
                  <NumberFlow
                    value={margin}
                    format={{ style: "percent", maximumFractionDigits: 1 }}
                    className="mt-2 font-ui text-stat-sm leading-none font-light"
                  />
                  <div className="relative mt-5 h-2 bg-track">
                    <div
                      className={cn("h-full bg-tool-shape-green transition-[width]", ease)}
                      style={{ width: `${(margin / MARGIN_SCALE) * 100}%` }}
                    />
                    <div
                      className={cn(
                        "absolute top-0 transition-opacity",
                        ease,
                        after ? "opacity-100" : "opacity-0",
                      )}
                      style={{ left: `${(marginBefore / MARGIN_SCALE) * 100}%` }}
                    >
                      <span className="block h-4 w-px -translate-y-1 bg-fg-on-light" />
                      <span className="block -translate-x-1/2 font-ui text-label tracking-(--tracking-label) whitespace-nowrap text-fg-on-light-muted uppercase">
                        {content.margin.beforeMark}
                      </span>
                    </div>
                  </div>
                </div>

                {/* The gain, and what it is worth at the multiple. */}
                <div className="flex flex-col bg-bg p-6 text-fg">
                  <p className="font-body text-body-md">{gain.label}</p>
                  <NumberFlow
                    value={after ? added : 0}
                    prefix="+"
                    format={money}
                    className={cn(
                      "mt-2 font-ui text-stat-sm leading-none font-light transition-opacity",
                      ease,
                      after ? "opacity-100" : "opacity-40",
                    )}
                  />
                  <p
                    className={cn(
                      "mt-2 font-ui text-body-md transition-opacity",
                      ease,
                      after ? "opacity-100" : "opacity-40",
                    )}
                  >
                    {"≈ "}
                    <NumberFlow value={after ? added * gain.multiple : 0} prefix="+" format={money} />
                    {` in enterprise value at ${gain.multiple}×`}
                  </p>

                  {/* Where the gain comes from, each block its share of it,
                      arriving one after another. */}
                  <div className="mt-5 flex h-6 w-full bg-fg/10">
                    {gain.breakdown.map((part, i) => (
                      <div
                        key={part.label}
                        className={cn("h-full transition-[width]", ease, fills[part.tone])}
                        style={{
                          width: after ? `${(part.value / added) * 100}%` : "0%",
                          transitionDelay: after ? `${200 + i * 80}ms` : "0ms",
                        }}
                      />
                    ))}
                  </div>
                  <ul className="mt-4 grid grid-cols-2 gap-x-5 gap-y-2 desktop:grid-cols-3">
                    {gain.breakdown.map((part) => (
                      <li key={part.label} className="flex items-center gap-2 font-body text-body-sm">
                        <span className={cn("size-2.5 shrink-0", fills[part.tone])} />
                        <span>{part.label}</span>
                        <span className="ml-auto font-ui">{formatMoney.format(part.value)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <p className="text-ink-dynamic mt-3 font-ui text-label">{content.footnote}</p>
          </Container>
        </div>

        {/* The two markers that decide the flip, laid under the pinned stage —
            from its top, a screen each. They are what makes the track two
            screens tall. Empty and click-through: the toggle sits above them. */}
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
      </div>
    </section>
  );
}

type LineProps = {
  line: { label: string; before: number; after: number; tone: FeatureTone };
  after: boolean;
  /** The EBITDA line: set larger, under the rule, in ink. */
  total?: boolean;
};

/**
 * One P&L line: its label, its figure rolling between the two states with the
 * change beside it once it has happened, and a bar against the larger of the
 * two values — so a cost visibly shrinks and revenue visibly grows.
 */
function Line({ line, after, total = false }: LineProps) {
  const value = after ? line.after : line.before;
  const scale = Math.max(line.before, line.after);

  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <span className={cn("font-body", total ? "text-heading-md" : "text-body-md")}>
          {line.label}
        </span>
        <span className="flex items-baseline gap-3">
          <span
            className={cn(
              "font-ui text-body-sm text-fg-on-light-muted transition-opacity",
              ease,
              after ? "opacity-100" : "opacity-0",
            )}
          >
            {formatChange(line.after - line.before)}
          </span>
          <NumberFlow
            value={value}
            format={money}
            className={cn("font-ui leading-none", total ? "text-heading-lg" : "text-heading-md")}
          />
        </span>
      </div>
      <div className="mt-2 h-2 bg-track">
        <div
          className={cn("h-full transition-[width]", ease, total ? "bg-fg-on-light" : fills[line.tone])}
          style={{ width: `${(value / scale) * 100}%` }}
        />
      </div>
    </div>
  );
}
