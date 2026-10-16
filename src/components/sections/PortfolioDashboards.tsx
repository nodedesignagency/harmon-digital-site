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

const formatCount = new Intl.NumberFormat("en-US");

const formatPercent = new Intl.NumberFormat("en-US", {
  style: "percent",
  maximumFractionDigits: 1,
});

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
            <p className={cn("flex items-center gap-2", label)}>
              <span aria-hidden="true" className="size-2 bg-accent" />
              {content.eyebrow}
            </p>
            <TextReveal
              as="h2"
              lines={content.headingLines}
              settings={sectionTextRevealDynamic}
              className="mt-5 flex flex-col items-start gap-(--space-heading-line) text-display-lg leading-(--leading-display) tracking-(--tracking-display) font-normal"
            />
            <p className="mt-6 max-w-[40ch] font-body text-body-md">
              {content.subheading}
            </p>
            <p className="mt-6 font-ui text-label opacity-60 tablet:mt-auto">
              {content.note}
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
              <div className="mt-6 flex flex-1 flex-col">
                {/* Twelve months against a 20% scale; the months before go-live
                  step back. The chart takes whatever height the file has. */}
                <div
                  aria-hidden="true"
                  className="flex min-h-24 flex-1 items-end gap-1.5"
                >
                  {drilldown.months.map((month, i) => (
                    <span
                      key={i}
                      className={cn(
                        "flex-1",
                        i < drilldown.liveFrom
                          ? "bg-fg-on-light/20"
                          : "bg-fg-on-light",
                      )}
                      style={{ height: `${(month / 0.2) * 100}%` }}
                    />
                  ))}
                </div>
                <ul
                  aria-hidden="true"
                  className="mt-3 flex gap-5 font-ui text-label"
                >
                  <li className="flex items-center gap-2">
                    <span className="size-2 bg-fg-on-light/20" />
                    {drilldown.legend.before}
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="size-2 bg-fg-on-light" />
                    {drilldown.legend.after}
                  </li>
                </ul>
                <p className="mt-4 font-ui text-body-sm">{drilldown.caption}</p>
              </div>
            </Folder>

            <Folder index={2} tab={savings.tab} tint="lavender">
              <SavingsFile savings={savings} />
            </Folder>

            <Folder index={3} tab={revenue.tab} tint="peach">
              <p className={label}>{revenue.label}</p>
              <p className="mt-2 font-ui text-stat-sm leading-none font-light">
                {`+${formatMoney.format(revenue.total)}`}
              </p>
              {/* The funnel: each stage against the first. */}
              <ul className="mt-auto flex flex-col gap-4 pt-6">
                {revenue.funnel.map((stage) => (
                  <li
                    key={stage.label}
                    className="grid grid-cols-[7.5rem_1fr_auto] items-center gap-3 font-ui text-label"
                  >
                    <span className="tracking-(--tracking-label) uppercase">
                      {stage.label}
                    </span>
                    <span className="h-5 bg-fg-on-light/10">
                      <span
                        className="block h-full bg-fg-on-light"
                        style={{
                          width: `${(stage.value / revenue.funnel[0].value) * 100}%`,
                        }}
                      />
                    </span>
                    <span className="text-body-sm">
                      {formatCount.format(stage.value)}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-5 font-ui text-body-sm">{revenue.caption}</p>
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

/** The savings file: the total, one bar split by line, and the lines under it. */
function SavingsFile({ savings }: { savings: Content["savings"] }) {
  const total = savings.parts.reduce((sum, part) => sum + part.value, 0);
  // Darkest for the largest line, stepping lighter — the reference's bar.
  const shades = [
    "bg-fg-on-light",
    "bg-tool-shape-lavender",
    "bg-lavender",
    "bg-bg-white",
  ];

  return (
    <>
      <p className={label}>{savings.label}</p>
      <p className="mt-2 font-ui text-stat-sm leading-none font-light">
        {formatMoney.format(total)}
      </p>
      <div className="mt-auto pt-6">
        <div aria-hidden="true" className="flex h-16 border border-fg-on-light">
          {savings.parts.map((part, i) => (
            <span
              key={part.label}
              className={shades[i]}
              style={{ width: `${(part.value / total) * 100}%` }}
            />
          ))}
        </div>
        <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 tablet:grid-cols-4">
          {savings.parts.map((part, i) => (
            <li key={part.label} className="flex flex-col gap-1">
              <span className={cn("flex items-center gap-2", label)}>
                <span
                  aria-hidden="true"
                  className={cn(
                    "size-2 border border-fg-on-light/30",
                    shades[i],
                  )}
                />
                {part.label}
              </span>
              <span className="font-ui text-body-md">
                {formatMoney.format(part.value)}
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-5 font-ui text-body-sm">{savings.caption}</p>
      </div>
    </>
  );
}
