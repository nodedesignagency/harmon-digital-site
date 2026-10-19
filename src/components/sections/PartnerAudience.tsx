import { Container } from "@/components/layout/Container";
import { TextReveal } from "@/components/motion/TextReveal";
import { PartnerMarkIcon, type PartnerMark } from "@/components/ui/partnerMarks";
import { sectionTextReveal } from "@/config/animation";
import { cn } from "@/lib/cn";

/**
 * Who it's for — the three kinds of partner, a card each.
 *
 * Takes the Careers page's "Grow With" place (GrowWithUs, which stays as it
 * is): the white section that rides up over the pinned hero. So it keeps its
 * own fill, sits above the hero, and its heading takes the fixed light reveal
 * — a section that never crossfades has no live surface to resolve against.
 * A screen tall, so it has covered the hero by the time the two leave.
 *
 * Each card: the mark in its tinted square, as the benefits below set theirs,
 * then the name and one line, on the palest tints on the site — the ones prose
 * sits on. Tints come from content (`tone`).
 *
 * A server component; only the heading moves.
 */

export type AudienceTone = "blue" | "green" | "lavender";

type PartnerAudienceProps = {
  content: {
    headingLines: readonly string[];
    cards: readonly {
      title: string;
      body: string;
      mark: PartnerMark;
      tone: AudienceTone;
    }[];
  };
};

/** The card's fill, and the mark's square one step deeper in the same hue. */
const tones: Record<AudienceTone, { card: string; mark: string }> = {
  blue: { card: "bg-mission-blue", mark: "bg-principle-blue" },
  green: { card: "bg-mission-green", mark: "bg-principle-green" },
  lavender: { card: "bg-mission-lavender", mark: "bg-principle-lavender" },
};

export function PartnerAudience({ content }: PartnerAudienceProps) {
  return (
    <section
      data-bg="white"
      data-bg-keep=""
      // `relative z-10` and an opaque fill are what make it ride over the hero
      // rather than under it.
      className="relative z-10 flex min-h-svh flex-col justify-center bg-bg-white py-20 text-fg-on-light tablet:py-25"
    >
      <Container>
        <TextReveal
          as="h2"
          lines={content.headingLines}
          settings={sectionTextReveal}
          className="flex flex-col items-center gap-(--space-heading-line) text-center text-display-lg leading-(--leading-display) tracking-(--tracking-display) font-normal"
        />

        <ul className="mt-12 grid grid-cols-1 gap-5 tablet:mt-16 tablet:grid-cols-3">
          {content.cards.map((card) => (
            <li
              key={card.title}
              className={cn(
                "flex min-h-[18rem] flex-col justify-between gap-12 p-8 tablet:p-10",
                tones[card.tone].card,
              )}
            >
              <span
                aria-hidden="true"
                className={cn("flex size-10 items-center justify-center", tones[card.tone].mark)}
              >
                <PartnerMarkIcon mark={card.mark} />
              </span>

              <div>
                <h3 className="font-display text-display-md leading-(--leading-heading) tracking-(--tracking-display) font-normal">
                  {card.title}
                </h3>
                <p className="mt-4 max-w-[36ch] font-body text-body-md">{card.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
