import type { ReactNode } from "react";
import { Container } from "@/components/layout/Container";
import { TextReveal } from "@/components/motion/TextReveal";
import {
  OverviewFile,
  RevenueFile,
  SavingsFile,
} from "@/components/sections/PortfolioDashboards";
import { Button } from "@/components/ui/Button";
import { sectionTextRevealDynamic } from "@/config/animation";
import type { portfolioDashboardsContent } from "@/content/home";
import { cn } from "@/lib/cn";

/**
 * What You Get — /vsl's offer, one card per thing the fund gets.
 *
 * Each card is two halves, after the owner's references: the words on white
 * on the left — the name and what it is at the top, the call to book and a row
 * of what it includes, each with its icon, at the foot — and on the right, on
 * the card's tint, the matching file from the home page's Portfolio
 * Dashboards, figures and all. Same files, same figures, so the two pages
 * cannot disagree.
 *
 * The tint comes from content (`tone`), as every tinted card on the site does,
 * at the 50 depth the dashboard files are drawn on. A hairline round the card
 * keeps its white half from running into the white section.
 *
 * The section crossfades with the page on white, so its heading is in the
 * dynamic ink; the cards paint their own fills and keep fixed dark ink.
 */

export type OfferPreview = "savings" | "revenue" | "overview";
export type OfferTone = "lavender" | "peach" | "blue";
export type OfferIcon = keyof typeof icons;

type WhatYouGetProps = {
  content: {
    headingLines: readonly string[];
    subheading: string;
    items: readonly {
      title: string;
      body: string;
      includes: readonly { label: string; icon: OfferIcon }[];
      preview: OfferPreview;
      tone: OfferTone;
    }[];
  };
  /** The home page's dashboards, which the previews are drawn from. */
  dashboards: typeof portfolioDashboardsContent;
  /** The call to book, on every card. */
  cta: { label: string; href: string };
};

/** Fills come from theme.css; the section never names a colour itself. */
const tints: Record<OfferTone, string> = {
  lavender: "bg-tool-lavender",
  peach: "bg-stat-peach",
  blue: "bg-stat-blue",
};

export function WhatYouGet({ content, dashboards, cta }: WhatYouGetProps) {
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
              className="grid border border-border-on-light text-fg-on-light desktop:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]"
            >
              <div className="flex flex-col bg-bg-white p-6 tablet:p-8 desktop:p-9">
                <h3 className="font-display text-display-md leading-(--leading-heading) tracking-(--tracking-display) font-normal">
                  {item.title}
                </h3>
                <p className="mt-5 max-w-[44ch] font-body text-body-md">
                  {item.body}
                </p>

                <div className="mt-10 desktop:mt-auto desktop:pt-10">
                  {/* `plan`: the dark body the pricing cards use on their
                      light panels, where the white primary would vanish. */}
                  <Button
                    href={cta.href}
                    variant="plan"
                    withArrow
                    className="w-full tablet:w-[267px]"
                  >
                    {cta.label}
                  </Button>
                  <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-3 font-ui text-body-sm">
                    {item.includes.map((point) => (
                      <li key={point.label} className="flex items-center gap-2">
                        <svg
                          viewBox="0 0 16 16"
                          aria-hidden="true"
                          className="size-4 shrink-0"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={1.4}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          {icons[point.icon]}
                        </svg>
                        {point.label}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* The dashboard, as the home page draws it. Every figure in it
                  is also read out, from the file's own markup. */}
              <div
                className={cn(
                  "flex min-h-[26rem] flex-col p-6 tablet:p-8 desktop:p-9",
                  tints[item.tone],
                )}
              >
                {previews[item.preview]}
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

/**
 * The include row's icons: 16px line drawings in the ink, one idea each. Kept
 * inline so they take the card's colour.
 */
const icons = {
  layers: <path d="M8 2 14 5 8 8 2 5Z M2 8l6 3 6-3 M2 11l6 3 6-3" />,
  bolt: <path d="M9 1.5 3.5 9H8l-1 5.5L12.5 7H8l1-5.5Z" />,
  key: (
    <>
      <circle cx="5" cy="8" r="2.75" />
      <path d="M7.75 8H14.5 M12 8v2.5 M14.5 8v2" />
    </>
  ),
  phone: (
    <path d="M3.25 2.25h2.5l1.25 3-1.75 1.25a7.5 7.5 0 0 0 3.25 3.25L9.75 8l3 1.25v2.5a1 1 0 0 1-1 1A10.5 10.5 0 0 1 2.25 3.25a1 1 0 0 1 1-1Z" />
  ),
  repeat: (
    <path d="M2.5 7.5a5 5 0 0 1 8.75-3.25L12.5 5.5 M12.5 2v3.5H9 M13.5 8.5a5 5 0 0 1-8.75 3.25L3.5 10.5 M3.5 14v-3.5H7" />
  ),
  send: <path d="M14.5 1.5 1.5 7l5.25 2.25L9 14.5Z M6.75 9.25 14.5 1.5" />,
  grid: (
    <>
      <rect x="2" y="2" width="5" height="5" />
      <rect x="9" y="2" width="5" height="5" />
      <rect x="2" y="9" width="5" height="5" />
      <rect x="9" y="9" width="5" height="5" />
    </>
  ),
  trendDown: <path d="M1.5 4.5 6 9l3-3 5.5 5.5 M14.5 7.5v4h-4" />,
  trendUp: <path d="M1.5 11.5 6 7l3 3 5.5-5.5 M14.5 8.5v-4h-4" />,
} satisfies Record<string, ReactNode>;
