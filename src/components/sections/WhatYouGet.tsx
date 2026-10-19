import type { ReactNode } from "react";
import { Container } from "@/components/layout/Container";
import { TextReveal } from "@/components/motion/TextReveal";
import { sectionTextRevealDynamic } from "@/config/animation";
import type { portfolioDashboardsContent } from "@/content/home";
import { cn } from "@/lib/cn";

/**
 * What You Get — /vsl's offer, one dark card per thing the fund gets.
 *
 * The owner's reference: a dark card with the words on the left — a marked
 * label, the heading, a paragraph — and on the right a picture of the thing at
 * work, built from interface pieces rather than illustrated: a status panel
 * with its progress, a short log under it, and a column of white figure cards
 * stepping down beside them.
 *
 * Every figure on a white card comes from the home page's Portfolio
 * Dashboards, so the two pages tell the same story with the same numbers. The
 * status lines and the log are this page's (`content.items[].graphic`); the
 * dashboards card's log is that file's portcos.
 *
 * The section crossfades with the page on white; the cards paint their own
 * dark fill and keep fixed light ink.
 */

export type OfferPreview = "savings" | "revenue" | "overview";

type LogRow = { event: string; detail: string };

type WhatYouGetProps = {
  content: {
    headingLines: readonly string[];
    subheading: string;
    items: readonly {
      label: string;
      title: string;
      body: string;
      includes: readonly string[];
      preview: OfferPreview;
      graphic: { status: string; progress: number; log?: readonly LogRow[] };
    }[];
  };
  /** The home page's dashboards, which the figures are drawn from. */
  dashboards: typeof portfolioDashboardsContent;
};

/** "$1.6M", "$600K". The minimum is stated: currency defaults it to two. */
const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

const percent = new Intl.NumberFormat("en-US", {
  style: "percent",
  maximumFractionDigits: 1,
});

const label = "font-ui text-label tracking-(--tracking-label) uppercase";

type Stat = { label: string; sub: string; value: string };

/** The white cards for each offer, from the dashboards' own figures. */
function statsFor(preview: OfferPreview, d: WhatYouGetProps["dashboards"]): Stat[] {
  switch (preview) {
    case "savings": {
      const total = d.savings.parts.reduce((sum, part) => sum + part.value, 0);
      return [
        { label: "Saved", sub: "Per year, across the fund", value: money.format(total) },
        ...d.savings.parts.slice(0, 3).map((part) => ({
          label: part.label,
          sub: "Per year",
          value: money.format(part.value),
        })),
      ];
    }
    case "revenue":
      return [
        { label: "Revenue added", sub: "By AI employees", value: `+${money.format(d.revenue.total)}` },
        ...d.revenue.sources.map((source) => ({
          label: source.label,
          sub: "Per year",
          value: money.format(source.value),
        })),
      ];
    case "overview": {
      const live = d.overview.rows.filter((row) => row.status === "live").length;
      return [
        { label: "EBITDA lift", sub: "Across the fund", value: `+${money.format(d.overview.total)}` },
        {
          label: "Portco 01 margin",
          sub: `Up from ${percent.format(d.drilldown.before)}`,
          value: percent.format(d.drilldown.after),
        },
        { label: "Live", sub: "Portcos reporting", value: `${live} of ${d.overview.rows.length}` },
      ];
    }
  }
}

/** The dashboards card's log: the first portco, then one in each other state. */
function overviewLog(d: WhatYouGetProps["dashboards"]): LogRow[] {
  return d.overview.rows
    .filter((row, i) => i === 0 || row.status !== "live")
    .slice(0, 3)
    .map((row) => ({
      event: `${row.name} · ${d.overview.statuses[row.status]}`,
      detail: row.lift ? `+${money.format(row.lift)} EBITDA` : "No figures yet",
    }));
}

/** Where each white card sits across its column: they step in and narrow. */
const steps = ["w-full", "ml-[6%] w-[94%]", "ml-[2%] w-[92%]", "ml-[12%] w-[88%]"];

export function WhatYouGet({ content, dashboards }: WhatYouGetProps) {
  return (
    <section data-bg="white" className="bg-bg-white py-20 tablet:py-30">
      <Container>
        <div className="text-ink-dynamic flex flex-col gap-6 tablet:flex-row tablet:items-end tablet:justify-between tablet:gap-16">
          <TextReveal
            as="h2"
            lines={content.headingLines}
            settings={sectionTextRevealDynamic}
            className="flex flex-col items-start gap-(--space-heading-line) text-display-lg leading-(--leading-display) tracking-(--tracking-display) font-normal"
          />
          <p className="max-w-[40ch] font-body text-body-md tablet:pb-1">
            {content.subheading}
          </p>
        </div>

        <ul className="mt-12 flex flex-col gap-5 tablet:mt-15">
          {content.items.map((item) => {
            const log = item.graphic.log ?? overviewLog(dashboards);
            return (
              <li
                key={item.title}
                className="grid gap-12 bg-bg p-6 text-fg tablet:p-10 desktop:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] desktop:gap-16 desktop:p-12"
              >
                <div className="flex flex-col">
                  <p className={cn("flex items-center gap-3", label)}>
                    <span
                      aria-hidden="true"
                      className="flex size-7 items-center justify-center bg-accent text-accent-fg"
                    >
                      <OfferIcon preview={item.preview} />
                    </span>
                    {item.label}
                  </p>

                  <h3 className="mt-12 font-display text-display-md leading-(--leading-heading) tracking-(--tracking-display) font-normal desktop:mt-auto">
                    {item.title}
                  </h3>
                  <p className="mt-5 max-w-[44ch] font-body text-body-md">
                    {item.body}
                  </p>
                  <ul className="mt-8 flex flex-col">
                    {item.includes.map((line) => (
                      <li
                        key={line}
                        className="flex items-center gap-3 border-t border-border py-3 font-ui text-body-sm"
                      >
                        <span aria-hidden="true" className="size-1.5 bg-accent" />
                        {line}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* The picture of it at work. Decorative: the figures in it are
                    the dashboards', and the reader has the words beside it. */}
                <div
                  aria-hidden="true"
                  className="grid content-center gap-4 tablet:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] tablet:items-center"
                >
                  <div className="flex flex-col gap-2">
                    <Status text={item.graphic.status} progress={item.graphic.progress}>
                      <OfferIcon preview={item.preview} />
                    </Status>
                    {log.map((row) => (
                      <div key={row.event} className="border border-fg/15 px-4 py-3">
                        <p className={cn(label, "flex items-center gap-2")}>
                          <span className="size-1.5 bg-fg" />
                          {row.event}
                        </p>
                        <p className={cn(label, "mt-1.5 pl-3.5 opacity-55")}>{row.detail}</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col gap-3">
                    {statsFor(item.preview, dashboards).map((stat, i) => (
                      <div
                        key={stat.label}
                        className={cn(
                          "flex items-center justify-between gap-4 bg-bg-white px-4 py-3.5 text-fg-on-light",
                          steps[i],
                        )}
                      >
                        <div className="min-w-0">
                          <p className="font-ui text-body-sm">{stat.label}</p>
                          <p className="mt-0.5 font-ui text-label text-fg-on-light-muted">
                            {stat.sub}
                          </p>
                        </div>
                        <p className="shrink-0 font-ui text-heading-lg leading-none">
                          {stat.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}

/** The status panel: what the system is doing, and how far along. */
function Status({
  text,
  progress,
  children,
}: {
  text: string;
  progress: number;
  children: ReactNode;
}) {
  const SEGMENTS = 14;
  const filled = Math.round(progress * SEGMENTS);

  return (
    <div className="flex flex-col items-center gap-4 border border-fg/40 px-4 py-6">
      <span className="flex size-8 items-center justify-center bg-accent text-accent-fg">
        {children}
      </span>
      <p className={label}>{text}</p>
      <div className="flex w-3/4 gap-1">
        {Array.from({ length: SEGMENTS }, (_, i) => (
          <span key={i} className={cn("h-1 flex-1", i < filled ? "bg-accent" : "bg-fg/15")} />
        ))}
      </div>
    </div>
  );
}

/**
 * Each offer's mark, drawn in squares as the site's patterns are: the bars
 * stepping down for costs, up for revenue, and four panes for the dashboards.
 */
function OfferIcon({ preview }: { preview: OfferPreview }) {
  const shapes: Record<OfferPreview, ReactNode> = {
    savings: (
      <>
        <rect x="1" y="2" width="4" height="13" />
        <rect x="6" y="6" width="4" height="9" />
        <rect x="11" y="10" width="4" height="5" />
      </>
    ),
    revenue: (
      <>
        <rect x="1" y="10" width="4" height="5" />
        <rect x="6" y="6" width="4" height="9" />
        <rect x="11" y="1" width="4" height="14" />
      </>
    ),
    overview: (
      <>
        <rect x="1" y="1" width="6" height="6" />
        <rect x="9" y="1" width="6" height="6" />
        <rect x="1" y="9" width="6" height="6" />
        <rect x="9" y="9" width="6" height="6" opacity="0.4" />
      </>
    ),
  };

  return (
    <svg viewBox="0 0 16 16" className="size-3.5" fill="currentColor">
      {shapes[preview]}
    </svg>
  );
}
