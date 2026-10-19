import { Container } from "@/components/layout/Container";
import { Accordion } from "@/components/motion/Accordion";
import { TextReveal } from "@/components/motion/TextReveal";
import { CtaCard } from "@/components/ui/CtaCard";
import { sectionTextRevealBeige } from "@/config/animation";

/**
 * FAQ — "Answers to Your Questions".
 *
 * Heading and pitch on the left with the strategy-call card anchored to the
 * column's foot; the accordion fills the right. On a phone the card follows
 * the accordion rather than floating mid-air.
 *
 * The second beige section, running straight on from pricing — the surface
 * holds rather than changing, which is the point of adjacent same-colour
 * sections in the changing-background zone.
 */

type FaqProps = {
  /**
   * The shared `faqContent`, or a page's own selection of the same shape —
   * /vsl passes four of its questions.
   */
  content: {
    headingLines: readonly string[];
    subheading: string;
    cta: { title: string; body: string; href: string };
    items: ReadonlyArray<{ question: string; answer: string }>;
  };
};

export function Faq({ content }: FaqProps) {
  return (
    <section data-bg="beige" className="bg-bg-light py-20 text-fg-on-light">
      <Container className="grid gap-12 px-10 desktop:grid-cols-[5fr_7fr] desktop:gap-20">
        <div className="flex flex-col">
          <TextReveal
            as="h2"
            lines={content.headingLines}
            settings={sectionTextRevealBeige}
            lineStagger={sectionTextRevealBeige.lineStagger}
            className="flex flex-col items-start gap-(--space-heading-line) text-display-lg leading-(--leading-display) tracking-(--tracking-display) font-normal"
          />
          <p className="text-ink-dynamic mt-8 max-w-[38ch] font-body text-body-md">
            {content.subheading}
          </p>

          {/* The strategy-call card, anchored to the column's foot. */}
          <CtaCard
            href={content.cta.href}
            title={content.cta.title}
            body={content.cta.body}
            fill="bg-bg-white"
            className="mt-16 desktop:mt-auto"
          />
        </div>

        <Accordion items={content.items} />
      </Container>
    </section>
  );
}
