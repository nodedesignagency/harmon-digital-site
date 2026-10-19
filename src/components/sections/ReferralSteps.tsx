import { Container } from "@/components/layout/Container";
import { TextReveal } from "@/components/motion/TextReveal";
import { sectionTextRevealBeige } from "@/config/animation";

/**
 * How it works — the four steps of a referral, two by two.
 *
 * A copy of the Careers page's hiring process (HiringProcess, which stays as
 * it is): each step a rule, a numbered square with the step's name beside it,
 * and the line that explains it underneath. The number is the index, padded,
 * in Geist — never a figure written in content.
 *
 * Beige, so the heading takes the peach leading bar.
 *
 * A server component; only the heading moves.
 */

export type StepTone = "blue" | "green" | "magenta" | "peach";

type ReferralStepsProps = {
  content: {
    headingLines: readonly string[];
    steps: readonly { title: string; body: string; tone: StepTone }[];
  };
};

/** Fills come from theme.css; the section never names a colour itself. */
const tones: Record<StepTone, string> = {
  blue: "bg-principle-blue",
  green: "bg-principle-green",
  magenta: "bg-principle-magenta",
  peach: "bg-principle-peach",
};

export function ReferralSteps({ content }: ReferralStepsProps) {
  return (
    <section data-bg="beige" className="bg-bg-light py-20 text-fg-on-light tablet:py-25">
      <Container>
        <TextReveal
          as="h2"
          lines={content.headingLines}
          settings={sectionTextRevealBeige}
          lineStagger={sectionTextRevealBeige.lineStagger}
          className="flex flex-col items-center gap-(--space-heading-line) text-center text-display-lg leading-(--leading-display) tracking-(--tracking-display) font-normal"
        />

        <ol className="mt-15 grid grid-cols-1 gap-x-16 gap-y-12 tablet:grid-cols-2">
          {content.steps.map((step, i) => (
            <li key={step.title} className="border-t border-border-on-light pt-8">
              <div className="flex items-center gap-4">
                <span
                  aria-hidden="true"
                  className={`flex size-11 shrink-0 items-center justify-center font-ui text-body-md text-fg-on-light ${tones[step.tone]}`}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>

                <h3 className="font-body text-heading-md leading-(--leading-heading)">
                  {step.title}
                </h3>
              </div>

              <p className="mt-6 max-w-[44ch] font-body text-body-md text-fg-on-light-muted">
                {step.body}
              </p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
