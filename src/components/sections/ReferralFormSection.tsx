import type { ComponentProps } from "react";
import { Container } from "@/components/layout/Container";
import { TextReveal } from "@/components/motion/TextReveal";
import { ReferralForm } from "@/components/sections/ReferralForm";
import { sectionTextRevealDynamic } from "@/config/animation";

/**
 * Send a referral — the heading, a line, and the form in a ruled panel.
 *
 * The panel is the job page's apply panel's form half on its own (see
 * JobApply): white, a hairline round it, the fields at the site's measure.
 * Centred and narrower than the page, since six fields across the full
 * column would be lines a reader has to cross the screen to finish.
 *
 * `id` is the anchor every "Refer a Company" on the page scrolls to.
 *
 * White, crossfading with the page, so the heading takes the live ink.
 */

type ReferralFormSectionProps = {
  content: {
    id: string;
    headingLines: readonly string[];
    subheading: string;
    form: ComponentProps<typeof ReferralForm>["content"];
  };
};

export function ReferralFormSection({ content }: ReferralFormSectionProps) {
  return (
    <section
      id={content.id}
      data-bg="white"
      className="bg-bg-white py-20 text-fg-on-light tablet:py-25"
    >
      <Container>
        <TextReveal
          as="h2"
          lines={content.headingLines}
          settings={sectionTextRevealDynamic}
          className="flex flex-col items-center gap-(--space-heading-line) text-center text-display-lg leading-(--leading-display) tracking-(--tracking-display) font-normal"
        />
        <p className="text-ink-dynamic mx-auto mt-6 max-w-[52ch] text-center font-body text-body-md">
          {content.subheading}
        </p>

        <div className="mx-auto mt-12 max-w-[800px] border border-border-on-light bg-bg-white tablet:mt-15">
          <ReferralForm content={content.form} />
        </div>
      </Container>
    </section>
  );
}
