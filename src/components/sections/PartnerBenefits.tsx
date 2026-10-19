import { Container } from "@/components/layout/Container";
import { TextReveal } from "@/components/motion/TextReveal";
import { PartnerMarkIcon, type PartnerMark } from "@/components/ui/partnerMarks";
import { sectionTextRevealDynamic } from "@/config/animation";

/**
 * Why partner with us — six reasons, three across.
 *
 * A copy of the Careers page's "Why Join" (WhyJoin, which stays as it is): a
 * tinted square carrying a mark, a title and a line of copy, sitting straight
 * on the surface with no card around it. One addition: an optional `detail`
 * line under the copy, for the specifics a reason still waits on — the payout
 * and the gift — so they read as part of it and are dropped when empty.
 *
 * White, and it crossfades with the page rather than painting itself, so the
 * heading resolves into the live ink token.
 *
 * A server component. Nothing here moves except the heading.
 */

export type BenefitTone = "blue" | "peach" | "lavender" | "rose" | "green" | "magenta";

type PartnerBenefitsProps = {
  content: {
    headingLines: readonly string[];
    items: readonly {
      title: string;
      body: string;
      /** Specifics under the line. Empty for none. */
      detail: string;
      tone: BenefitTone;
      mark: PartnerMark;
    }[];
  };
};

/** Fills come from theme.css; the section never names a colour itself. */
const tones: Record<BenefitTone, string> = {
  blue: "bg-principle-blue",
  peach: "bg-principle-peach",
  lavender: "bg-principle-lavender",
  rose: "bg-principle-rose",
  green: "bg-principle-green",
  magenta: "bg-principle-magenta",
};

export function PartnerBenefits({ content }: PartnerBenefitsProps) {
  return (
    <section data-bg="white" className="bg-bg-white py-20 text-fg-on-light tablet:py-25">
      <Container>
        <TextReveal
          as="h2"
          lines={content.headingLines}
          settings={sectionTextRevealDynamic}
          className="flex flex-col items-start gap-(--space-heading-line) text-display-lg leading-(--leading-display) tracking-(--tracking-display) font-normal"
        />

        {/* Three across from desktop, two on a tablet, one on a phone. The row
            gap is much larger than the column gap on purpose: with six entries
            and no cards, it is the space between rows that groups them. */}
        <ul className="mt-15 grid grid-cols-1 gap-x-10 gap-y-15 tablet:grid-cols-2 desktop:grid-cols-3">
          {content.items.map((item) => (
            <li key={item.title} className="flex flex-col items-start">
              <span
                aria-hidden="true"
                className={`flex size-10 items-center justify-center ${tones[item.tone]}`}
              >
                <PartnerMarkIcon mark={item.mark} />
              </span>

              <h3 className="mt-6 font-body text-heading-sm leading-(--leading-heading)">
                {item.title}
              </h3>
              <p className="mt-4 max-w-[36ch] font-body text-body-md text-fg-on-light-muted">
                {item.body}
              </p>
              {item.detail ? (
                <p className="mt-2 max-w-[36ch] font-ui text-body-sm text-fg-on-light">
                  {item.detail}
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
