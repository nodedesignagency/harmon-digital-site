import type { ReactNode } from "react";
import { Container } from "@/components/layout/Container";
import { TextReveal } from "@/components/motion/TextReveal";
import {
  OverviewFile,
  RevenueFile,
  SavingsFile,
} from "@/components/sections/PortfolioDashboards";
import { sectionTextRevealDynamic } from "@/config/animation";
import type { portfolioDashboardsContent } from "@/content/home";
import { cn } from "@/lib/cn";

/**
 * What You Get — /vsl's offer, one ruled row per thing the fund gets.
 *
 * After Phantom Studios' services rows on Mobbin: on the left the name large,
 * what it is and what it includes, and on the right a look at it — here the
 * matching file from the home page's Portfolio Dashboards, so
 * the offer is shown as the dashboard the fund will actually read rather than
 * described. Same files, same figures, so the two pages cannot disagree. The
 * look gets the wider column because the files need it: the savings bar labels
 * its parts along its length and runs them together much narrower than this.
 *
 * Crossfades with the page (`data-bg="white"`): the words take the dynamic
 * ink, and the dashboards keep their own tints and fixed ink.
 */

export type OfferPreview = "savings" | "revenue" | "overview";

type WhatYouGetProps = {
  content: {
    headingLines: readonly string[];
    subheading: string;
    items: readonly {
      title: string;
      body: string;
      includes: readonly string[];
      preview: OfferPreview;
    }[];
  };
  /** The home page's dashboards, which the previews are drawn from. */
  dashboards: typeof portfolioDashboardsContent;
};

/** Each preview in its file's tint on the home page. */
const tints: Record<OfferPreview, string> = {
  savings: "bg-tool-lavender",
  revenue: "bg-stat-peach",
  overview: "bg-stat-blue",
};

/** The include list's markers: the same hue, at the strength of a mark. */
const swatches: Record<OfferPreview, string> = {
  savings: "bg-tool-shape-lavender",
  revenue: "bg-tool-shape-peach",
  overview: "bg-tool-shape-blue",
};

const label = "font-ui text-label tracking-(--tracking-label) uppercase";

export function WhatYouGet({ content, dashboards }: WhatYouGetProps) {
  const previews: Record<OfferPreview, ReactNode> = {
    savings: <SavingsFile savings={dashboards.savings} />,
    revenue: <RevenueFile revenue={dashboards.revenue} />,
    overview: <OverviewFile overview={dashboards.overview} />,
  };

  return (
    <section data-bg="white" className="bg-bg-white py-20 tablet:py-30">
      <Container className="text-ink-dynamic">
        <div className="flex flex-col gap-6 tablet:flex-row tablet:items-end tablet:justify-between tablet:gap-16">
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

        <ol className="mt-12 border-b border-border-on-light tablet:mt-15">
          {content.items.map((item, i) => (
            <li
              key={item.title}
              className="grid gap-8 border-t border-border-on-light py-10 desktop:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] desktop:gap-16 desktop:py-12"
            >
              <div>
                <p className={cn(label, "opacity-60")}>
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-4 font-display text-display-md leading-(--leading-heading) tracking-(--tracking-display) font-normal">
                  {item.title}
                </h3>
                <p className="mt-6 max-w-[44ch] font-body text-body-md">
                  {item.body}
                </p>
                <ul className="mt-8 flex flex-col border-b border-border-on-light">
                  {item.includes.map((line) => (
                    <li
                      key={line}
                      className="flex items-center gap-3 border-t border-border-on-light py-3 font-ui text-body-sm"
                    >
                      <span aria-hidden="true" className={cn("size-2", swatches[item.preview])} />
                      {line}
                    </li>
                  ))}
                </ul>
              </div>

              {/* The look at it. Decorative to a point: every figure is also
                  read out, from the file's own markup. */}
              <div
                className={cn(
                  "flex min-h-[440px] flex-col p-6 text-fg-on-light tablet:p-8",
                  tints[item.preview],
                )}
              >
                {previews[item.preview]}
              </div>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
