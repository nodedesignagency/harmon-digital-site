import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { TextReveal } from "@/components/motion/TextReveal";
import { featureArtwork } from "@/components/ui/featureArtwork";
import { sectionTextReveal } from "@/config/animation";
import type { FeatureImage } from "@/content/home";
import { cn } from "@/lib/cn";

/**
 * Who it's for — the three kinds of partner.
 *
 * After Ploy's "Who's Ploy for?" on Mobbin, in the site's terms: the heading
 * and a line on the left, and on the right three panels stacked 10 apart, each
 * the partner's name set large with its one line under it, a small square in
 * each corner as a drafting mark, and one of the home page's feature pictures
 * in the top corner (`art`, the same 3D set the feature cards and How It Works
 * carry). Static: every panel shows its line, nothing opens or closes.
 *
 * Takes the Careers page's "Grow With" place (GrowWithUs, which stays as it
 * is): the white section that rides up over the pinned hero. So it keeps its
 * own fill, sits above the hero, and its heading takes the fixed light reveal
 * — a section that never crossfades has no live surface to resolve against.
 * A screen tall, so it has covered the hero by the time the two leave.
 *
 * Tints come from content (`tone`), at the 50 depth text sits on, and are
 * matched to the picture, as the feature cards' are.
 *
 * A server component; only the heading moves.
 */

export type AudienceTone = "lavender" | "rose" | "peach";

type PartnerAudienceProps = {
  content: {
    headingLines: readonly string[];
    subheading: string;
    cards: readonly {
      title: string;
      body: string;
      art: FeatureImage;
      tone: AudienceTone;
    }[];
  };
};

/** Fills come from theme.css; the section never names a colour itself. */
const tints: Record<AudienceTone, string> = {
  lavender: "bg-tool-lavender",
  rose: "bg-tool-rose",
  peach: "bg-tool-peach",
};

/** The four corner marks, 8 in from each edge. */
const corners = ["top-2 left-2", "top-2 right-2", "bottom-2 left-2", "bottom-2 right-2"];

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
        <div className="grid gap-12 desktop:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] desktop:gap-16">
          <div>
            <TextReveal
              as="h2"
              lines={content.headingLines}
              settings={sectionTextReveal}
              className="flex flex-col items-start gap-(--space-heading-line) text-display-lg leading-(--leading-display) tracking-(--tracking-display) font-normal"
            />
            <p className="mt-6 max-w-[36ch] font-body text-body-md">{content.subheading}</p>
          </div>

          <ul className="flex flex-col gap-2.5">
            {content.cards.map((card) => (
              <li
                key={card.title}
                className={cn(
                  // The picture at the top, the name and its line together at
                  // the foot.
                  "relative flex min-h-[13rem] flex-col justify-between gap-6 p-6 tablet:p-8",
                  tints[card.tone],
                )}
              >
                {corners.map((corner) => (
                  <span
                    key={corner}
                    aria-hidden="true"
                    className={cn("absolute size-1.5 bg-fg-on-light", corner)}
                  />
                ))}

                {/* Decorative: the name beside it says who this is. */}
                <Image
                  src={featureArtwork[card.art]}
                  alt=""
                  sizes="64px"
                  className="size-16 object-contain"
                />
                <div>
                  <h3 className="font-display text-display-lg leading-(--leading-display) tracking-(--tracking-display) font-normal">
                    {card.title}
                  </h3>
                  <p className="mt-3 max-w-[40ch] font-body text-body-md">{card.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
