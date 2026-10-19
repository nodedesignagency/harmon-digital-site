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
 * What You Get — /vsl's offer, one coloured card per thing the fund gets.
 *
 * Each card is the owner's reference laid out in the site's terms: the words
 * on the left — the name, what it is, what it includes — and on the right the
 * matching file from the home page's Portfolio Dashboards, figures and all, so
 * the offer is shown as the dashboard the fund will read. Same files, same
 * figures, so the two pages cannot disagree.
 *
 * Each card takes its tint from content (`tone`), as every tinted card on the
 * site does, at the 50 depth the dashboard files are drawn on.
 *
 * The section crossfades with the page on white, so its heading is in the
 * dynamic ink; the cards paint their own tints and keep fixed dark ink.
 */

export type OfferPreview = "savings" | "revenue" | "overview";
export type OfferTone = "lavender" | "peach" | "blue";

type WhatYouGetProps = {
  content: {
    headingLines: readonly string[];
    subheading: string;
    items: readonly {
      title: string;
      body: string;
      includes: readonly string[];
      preview: OfferPreview;
      tone: OfferTone;
    }[];
  };
  /** The home page's dashboards, which the previews are drawn from. */
  dashboards: typeof portfolioDashboardsContent;
};

/** Fills come from theme.css; the section never names a colour itself. */
const tints: Record<OfferTone, string> = {
  lavender: "bg-tool-lavender",
  peach: "bg-stat-peach",
  blue: "bg-stat-blue",
};

export function WhatYouGet({ content, dashboards }: WhatYouGetProps) {
  const previews: Record<OfferPreview, ReactNode> = {
    savings: <SavingsFile savings={dashboards.savings} />,
    revenue: <RevenueFile revenue={dashboards.revenue} />,
    overview: <OverviewFile overview={dashboards.overview} />,
  };

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
          {content.items.map((item) => (
            <li
              key={item.title}
              className={cn(
                "grid gap-10 p-6 text-fg-on-light tablet:p-10 desktop:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] desktop:gap-16 desktop:p-12",
                tints[item.tone],
              )}
            >
              <div className="flex flex-col desktop:justify-center">
                <h3 className="font-display text-display-md leading-(--leading-heading) tracking-(--tracking-display) font-normal">
                  {item.title}
                </h3>
                <p className="mt-5 max-w-[44ch] font-body text-body-md">
                  {item.body}
                </p>
                <ul className="mt-8 flex flex-col border-b border-fg-on-light/10">
                  {item.includes.map((line) => (
                    <li
                      key={line}
                      className="flex items-center gap-3 border-t border-fg-on-light/10 py-3 font-ui text-body-sm"
                    >
                      <span aria-hidden="true" className="size-1.5 bg-fg-on-light" />
                      {line}
                    </li>
                  ))}
                </ul>
              </div>

              {/* The dashboard, as the home page draws it. Every figure in it
                  is also read out, from the file's own markup. */}
              <div className="flex min-h-[26rem] flex-col">
                {previews[item.preview]}
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
