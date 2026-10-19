import type { CSSProperties } from "react";
import { Container } from "@/components/layout/Container";
import { TextReveal } from "@/components/motion/TextReveal";
import { ButtonArrow } from "@/components/ui/SiteIcons";
import { sectionTextRevealBeige } from "@/config/animation";

/**
 * What makes a good referral — the kinds of company to send, one row each.
 *
 * A copy of the Careers page's "Current Openings" list (Openings, which stays
 * as it is), without the search, the filters and the count: there is nothing
 * to narrow in five rows. Each row is the list's own row — the line large, the
 * arrow box at its end, ruled underneath — and the whole row is the link,
 * down to the referral form on this page.
 *
 * Beige, so the heading takes the peach leading bar, as the openings do.
 *
 * A server component, unlike the list it is copied from: the client state that
 * one holds was its filters.
 */

type ReferralTypesProps = {
  content: {
    headingLines: readonly string[];
    subheading: string;
    items: readonly string[];
    /** Where a row goes — the form's anchor on this page. */
    href: string;
    /** Each row's accessible name, ahead of the row's own words. */
    actionLabel: string;
  };
};

export function ReferralTypes({ content }: ReferralTypesProps) {
  return (
    <section data-bg="beige" className="bg-bg-light py-20 text-fg-on-light tablet:py-25">
      <Container>
        <TextReveal
          as="h2"
          lines={content.headingLines}
          settings={sectionTextRevealBeige}
          className="flex flex-col items-center gap-(--space-heading-line) text-center text-display-lg leading-(--leading-display) tracking-(--tracking-display) font-normal"
        />

        <p className="mx-auto mt-8 max-w-[52ch] text-center font-body text-body-md text-fg-on-light">
          {content.subheading}
        </p>

        <ul className="mt-12">
          {content.items.map((item) => (
            <li key={item} className="border-b border-border-on-light last:border-b-0">
              <a
                href={content.href}
                aria-label={`${content.actionLabel}: ${item}`}
                // `mh-arrow-swap` is the trigger for the arrow's swap, the same
                // gesture the openings rows make.
                className="mh-arrow-swap group flex items-center justify-between gap-6 py-8 transition-opacity duration-(--duration-hover) ease-(--ease-out) hover:opacity-70"
              >
                <span className="font-body text-heading-lg leading-(--leading-heading)">
                  {item}
                </span>

                {/* The openings row's arrow box, and its 32 of throw. */}
                <span
                  aria-hidden="true"
                  className="relative flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-(--radius-icon) bg-icon-box text-fg-on-light"
                  style={{ "--mh-cta-travel": "32px" } as CSSProperties}
                >
                  <ButtonArrow className="mh-cta-arrow-out absolute size-5" />
                  <ButtonArrow className="mh-cta-arrow-in absolute size-5" />
                </span>
              </a>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
