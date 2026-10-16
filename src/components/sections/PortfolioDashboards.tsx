import type { CSSProperties, ReactNode } from "react";
import { Container } from "@/components/layout/Container";
import { TextReveal } from "@/components/motion/TextReveal";
import { sectionTextRevealDynamic } from "@/config/animation";
import type { portfolioDashboardsContent } from "@/content/home";
import { cn } from "@/lib/cn";

/**
 * Portfolio dashboards — "Every portco. One file each."
 *
 * Four files, each a dashboard under its own tab, that stack as the reader
 * scrolls: the next one rides up and settles a tab's height below the last, so
 * the tabs pile up down the stack, alternating sides, as a drawer of folders
 * does. The owner's folder reference, drawn in the site's own terms — square
 * corners, the pastel tints, Geist for every figure.
 *
 * The stacking is nothing but `position: sticky`: each file sticks one step
 * lower than the one before, and later files paint over earlier ones because
 * they come later in the document. No script, no scroll events — so nothing
 * here depends on what the preview host passes through. Each file is shorter
 * than the screen by construction (`--folder-h`), which is what lets it stick
 * at all.
 *
 * From tablet up the heading holds still on the left while the files stack on
 * the right; on a phone it sits above them.
 *
 * The section crossfades with the page (`data-bg="white"`), so the words beside
 * the stack are in the dynamic ink; the files paint their own tints and keep
 * fixed ink. A server component: only the heading reveal ships script.
 */

type Content = typeof portfolioDashboardsContent;

/** Height of a tab, px — `h-9`. */
const TAB = 36;
/** How much lower each file sticks than the one before: its tab and a sliver of body. */
const STEP = TAB + 12;
/** Space between the fixed header and the top of the stack, px. */
const GAP = 24;
/** Files in the stack. */
const FILES = 4;

/**
 * Where a file's contents start, under its body's top edge: below the sliver
 * that stays in view once the next file has settled over it, and the tab-high
 * band beside that file's tab — so the gaps between the tabs read as plain
 * fill, as a drawer of folders does, with no words caught in them.
 */
const CONTENT_TOP = STEP + 12;

/**
 * The last file's body is as tall as the screen allows once the header, the
 * gap, the tabs that pile above it and a margin below are taken out — capped,
 * so a tall screen does not get a cavernous file.
 */
const folderHeight = `min(500px, calc(100svh - var(--header-height) - ${GAP * 2 + STEP * (FILES - 1) + TAB}px))`;

/**
 * Each earlier file is a step taller per file still to come, so that settled,
 * every body ends on the same line. That is what lets the stack leave as one:
 * a sticky box lets go when its own bottom meets the end of the stack, and
 * with the bottoms level they all let go together. With equal heights the
 * last file left first and wiped the tabs above it on the way out.
 */
function bodyHeight(index: number) {
  return `calc(var(--folder-h) + ${(FILES - 1 - index) * STEP}px)`;
}

/** The settled stack, from the first tab to the shared bottom line. */
const stackHeight = `calc(var(--folder-h) + ${TAB + STEP * (FILES - 1)}px)`;

/** Fills come from theme.css; the section never names a colour itself. */
const tints = {
  blue: "bg-stat-blue",
  green: "bg-stat-green",
  lavender: "bg-tool-lavender",
  peach: "bg-stat-peach",
} as const;

/** "$4.2M", "$600K". The minimum is stated: currency defaults it to two. */
const formatMoney = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

const formatPercent = new Intl.NumberFormat("en-US", {
  style: "percent",
  maximumFractionDigits: 1,
});

/** A share of a whole, to the nearest point: "44%". */
const formatShare = new Intl.NumberFormat("en-US", { style: "percent" });

/** A dashboard's small capitals: the label over a figure, a tab, a status. */
const label = "font-ui text-label tracking-(--tracking-label) uppercase";

type PortfolioDashboardsProps = {
  content: Content;
};

export function PortfolioDashboards({ content }: PortfolioDashboardsProps) {
  const { overview, drilldown, savings, revenue } = content;

  return (
    <section data-bg="white" className="bg-bg-white py-20 tablet:py-30">
      <Container>
        <div
          className="grid gap-12 tablet:grid-cols-[2fr_3fr] tablet:gap-10 desktop:gap-16"
          style={
            {
              "--folder-h": folderHeight,
              "--stack-h": stackHeight,
            } as CSSProperties
          }
        >
          {/* From tablet up: exactly as tall as the settled stack and pinned
            level with its first tab (the 24 is GAP), so the words hold beside
            the files and leave with them rather than lingering after the
            stack has gone. */}
          <div className="text-ink-dynamic tablet:sticky tablet:top-[calc(var(--header-height)+24px)] tablet:flex tablet:h-(--stack-h) tablet:flex-col tablet:self-start">
            <TextReveal
              as="h2"
              lines={content.headingLines}
              settings={sectionTextRevealDynamic}
              className="flex flex-col items-start gap-(--space-heading-line) text-display-lg leading-(--leading-display) tracking-(--tracking-display) font-normal"
            />
            <p className="mt-6 max-w-[40ch] font-body text-body-md">
              {content.subheading}
            </p>
          </div>

          <div>
            <Folder index={0} tab={overview.tab} tint="blue">
              <p className={label}>{overview.label}</p>
              <p className="mt-2 font-ui text-stat-sm leading-none font-light">
                {`+${formatMoney.format(overview.total)}`}
              </p>
              <ul className="mt-6 flex flex-col">
                {overview.rows.map((row) => (
                  <li
                    key={row.name}
                    className="flex items-center justify-between gap-4 border-t border-fg-on-light/10 py-2.5 font-body text-body-sm"
                  >
                    <span>{row.name}</span>
                    <span className="flex items-center gap-6">
                      <span className="font-ui">
                        {row.lift ? `+${formatMoney.format(row.lift)}` : "—"}
                      </span>
                      <Status
                        status={row.status}
                        text={overview.statuses[row.status]}
                      />
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-auto pt-6 font-ui text-body-sm">
                {overview.caption}
              </p>
            </Folder>

            <Folder index={1} tab={drilldown.tab} tint="green">
              <DrilldownFile drilldown={drilldown} />
            </Folder>

            <Folder index={2} tab={savings.tab} tint="lavender">
              <SavingsFile savings={savings} />
            </Folder>

            <Folder index={3} tab={revenue.tab} tint="peach">
              <RevenueFile revenue={revenue} />
            </Folder>

            {/* The hold: once the last file has settled, the whole stack stays
              put for this much more scrolling before it leaves. Inside the
              stack rather than padding on it — a sticky box is held by its
              container's content, and padding would not count. */}
            <div aria-hidden="true" className="h-[25svh]" />
          </div>
        </div>
      </Container>
    </section>
  );
}

type FolderProps = {
  index: number;
  tab: string;
  tint: keyof typeof tints;
  children: ReactNode;
};

/**
 * One file: its tab, alternately on the left and the right, and the body
 * under it. Sticks a step lower than the file before it.
 */
function Folder({ index, tab, tint, children }: FolderProps) {
  const right = index % 2 === 1;

  return (
    <article
      className="sticky text-fg-on-light"
      style={{ top: `calc(var(--header-height) + ${GAP + index * STEP}px)` }}
    >
      <div className={cn("flex", right ? "justify-end pr-6" : "pl-6")}>
        <h3 className={cn("flex h-9 items-center px-5", label, tints[tint])}>
          {tab}
        </h3>
      </div>
      <div
        className={cn(
          "flex flex-col overflow-clip px-6 pb-6 tablet:px-8 tablet:pb-8",
          tints[tint],
        )}
        style={{ height: bodyHeight(index), paddingTop: CONTENT_TOP }}
      >
        {children}
      </div>
    </article>
  );
}

/** A portco's state: a square in the tint it is at, and the word. */
function Status({
  status,
  text,
}: {
  status: "live" | "building" | "audit";
  text: string;
}) {
  const marks = {
    live: "bg-accent",
    building: "bg-peach",
    audit: "bg-lavender",
  } as const;

  return (
    <span className={cn("flex w-20 items-center gap-2", label)}>
      <span
        aria-hidden="true"
        className={cn("size-2 border border-fg-on-light/30", marks[status])}
      />
      {text}
    </span>
  );
}

/**
 * The drilldown file: the margin before and after as two bars side by side,
 * against the after — the old one hatched, the new one solid, each figure
 * inside its bar and its name under it.
 */
function DrilldownFile({ drilldown }: { drilldown: Content["drilldown"] }) {
  const bars = [
    { value: drilldown.before, name: drilldown.bars.before, before: true },
    { value: drilldown.after, name: drilldown.bars.after, before: false },
  ];

  return (
    <>
      <p className={label}>{drilldown.label}</p>
      <p className="mt-2 flex items-baseline gap-4 font-ui text-stat-sm leading-none font-light">
        <span className="opacity-40">
          {formatPercent.format(drilldown.before)}
        </span>
        <span aria-hidden="true" className="text-stat-unit">
          →
        </span>
        <span>{formatPercent.format(drilldown.after)}</span>
      </p>

      <div
        aria-hidden="true"
        className="mt-8 flex min-h-32 flex-1 gap-3 tablet:gap-4"
      >
        {bars.map((bar) => (
          <div key={bar.name} className="flex flex-1 flex-col">
            <div className="flex flex-1 items-end">
              <div
                className={cn(
                  "relative w-full",
                  bar.before
                    ? "hatch-diagonal border border-fg-on-light/30 text-fg-on-light/25"
                    : "bg-fg-on-light",
                )}
                style={{ height: `${(bar.value / drilldown.after) * 100}%` }}
              >
                <span
                  className={cn(
                    "absolute top-3 left-3 font-ui text-heading-md",
                    bar.before ? "text-fg-on-light" : "text-fg",
                  )}
                >
                  {formatPercent.format(bar.value)}
                </span>
              </div>
            </div>
            <span className="mt-3 text-center font-ui text-body-sm">
              {bar.name}
            </span>
          </div>
        ))}
      </div>

      <p className="mt-5 font-ui text-body-sm">{drilldown.caption}</p>
    </>
  );
}

/**
 * Lead lines under the savings bar, longest first, px: each line drops from
 * the start of its part to a dot and the part's name. Shortening left to right
 * keeps every name clear of the lines after it.
 */
const LEADS = [176, 138, 100, 62];

/**
 * The savings file, after the owner's reference: one bar split by line — solid
 * and hatched in turn — with a fine line dropping from the start of each part
 * to its name, and the amount set beside the line where it leaves the bar.
 */
function SavingsFile({ savings }: { savings: Content["savings"] }) {
  const total = savings.parts.reduce((sum, part) => sum + part.value, 0);
  const fills = [
    "bg-fg-on-light",
    "bg-tool-shape-lavender",
    "hatch-vertical text-fg-on-light/35",
    "bg-bg-white",
  ];
  // Where each part starts along the bar, as a share of it.
  const starts = savings.parts.map(
    (_, i) =>
      savings.parts.slice(0, i).reduce((sum, part) => sum + part.value, 0) /
      total,
  );

  return (
    <>
      <p className={label}>{savings.label}</p>
      <p className="mt-2 font-ui text-stat-sm leading-none font-light">
        {formatMoney.format(total)}
      </p>

      <div className="mt-auto pt-6">
        <ul className="sr-only">
          {savings.parts.map((part) => (
            <li
              key={part.label}
            >{`${part.label}: ${formatMoney.format(part.value)}`}</li>
          ))}
        </ul>
        <div aria-hidden="true">
          <div className="flex h-16 tablet:h-20">
            {savings.parts.map((part, i) => (
              <span
                key={part.label}
                className={fills[i]}
                style={{ width: `${(part.value / total) * 100}%` }}
              />
            ))}
          </div>
          <div className="relative" style={{ height: LEADS[0] + 12 }}>
            {savings.parts.map((part, i) => (
              <div
                key={part.label}
                className="absolute top-0"
                style={{ left: `${starts[i] * 100}%`, height: LEADS[i] }}
              >
                <span className="absolute inset-y-0 left-0 w-px bg-fg-on-light/40" />
                <span className="absolute top-2 left-3 font-ui text-heading-md whitespace-nowrap">
                  {formatMoney.format(part.value)}
                </span>
                <span className="absolute -bottom-[3px] -left-[3px] size-1.5 bg-fg-on-light" />
                <span className="absolute bottom-0 left-3 translate-y-1/2 font-ui text-body-sm font-medium whitespace-nowrap">
                  {part.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <p className="mt-4 font-ui text-body-sm">{savings.caption}</p>
    </>
  );
}

/** Ticks round the revenue ring, and its geometry in its own units. */
const RING = { ticks: 72, size: 220, radius: 104, length: 18 };

/** Each source's ticks and swatch: the largest in full ink, then lighter. */
const sourceInks = [
  "text-fg-on-light",
  "text-fg-on-light/50",
  "text-fg-on-light/20",
];

/**
 * The revenue file, after the owner's reference: a ring of ticks, each source
 * taking its share of them in its own ink, the total in the middle, and a
 * table of the sources under it — or beside it, where there is the width.
 */
function RevenueFile({ revenue }: { revenue: Content["revenue"] }) {
  const total = revenue.sources.reduce((sum, source) => sum + source.value, 0);

  // Which source each tick belongs to: the boundaries are the running shares,
  // rounded to whole ticks, so the counts always come to the full ring.
  const owner: number[] = [];
  let running = 0;
  revenue.sources.forEach((source, i) => {
    const from = Math.round((running / total) * RING.ticks);
    running += source.value;
    const to = Math.round((running / total) * RING.ticks);
    for (let t = from; t < to; t++) owner[t] = i;
  });

  const centre = RING.size / 2;

  return (
    <>
      <p className={label}>{revenue.label}</p>

      <div className="mt-6 flex flex-1 flex-col items-center gap-6 tablet:flex-row tablet:gap-10">
        <div className="relative size-44 shrink-0 tablet:size-52">
          <svg
            viewBox={`0 0 ${RING.size} ${RING.size}`}
            aria-hidden="true"
            className="size-full"
          >
            {owner.map((source, t) => {
              // From the top, clockwise.
              const angle = (t / RING.ticks) * Math.PI * 2 - Math.PI / 2;
              const inner = RING.radius - RING.length;
              return (
                <line
                  key={t}
                  x1={centre + inner * Math.cos(angle)}
                  y1={centre + inner * Math.sin(angle)}
                  x2={centre + RING.radius * Math.cos(angle)}
                  y2={centre + RING.radius * Math.sin(angle)}
                  stroke="currentColor"
                  strokeWidth={3}
                  className={sourceInks[source]}
                />
              );
            })}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="font-ui text-heading-lg">{`+${formatMoney.format(total)}`}</span>
            <span className="mt-1 font-ui text-label opacity-60">
              {revenue.totalLabel}
            </span>
          </div>
        </div>

        <ul className="flex w-full flex-col">
          {revenue.sources.map((source, i) => (
            <li
              key={source.label}
              className="grid grid-cols-[auto_1fr_auto_auto] items-center gap-3 border-t border-fg-on-light/10 py-3 font-ui text-body-sm"
            >
              <span
                aria-hidden="true"
                className={cn("size-2.5 bg-current", sourceInks[i])}
              />
              <span>{source.label}</span>
              <span>{formatMoney.format(source.value)}</span>
              <span className="w-10 text-right opacity-60">
                {formatShare.format(source.value / total)}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-5 font-ui text-body-sm">{revenue.caption}</p>
    </>
  );
}
