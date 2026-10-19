import { Container } from "@/components/layout/Container";
import { TextReveal } from "@/components/motion/TextReveal";
import { Button } from "@/components/ui/Button";
import { sectionTextRevealDynamic } from "@/config/animation";
import { cn } from "@/lib/cn";

/**
 * Process steps — /vsl's "How It Works", the five steps on one line.
 *
 * After Zaro's "How It Runs" on Mobbin: a framed panel with the steps strung
 * along a single rule, each a marker, its number, a name and a line, and a
 * foot under a hairline saying what the client keeps either way, with the
 * call to book beside it. The last step is ongoing rather than numbered, and
 * its marker is the accent — the one that does not end.
 *
 * Across the panel from desktop up; below that the rule turns down the left
 * edge and the steps stack along it.
 *
 * Crossfades with the page on beige; the panel paints its own white and keeps
 * fixed ink.
 */

type ProcessStepsProps = {
  content: {
    eyebrow: string;
    headingLines: readonly string[];
    subheading: string;
    steps: readonly { label: string; title: string; body: string }[];
    footer: { label: string; body: string };
  };
  cta: { label: string; href: string };
};

const label = "font-ui text-label tracking-(--tracking-label) uppercase";

export function ProcessSteps({ content, cta }: ProcessStepsProps) {
  const last = content.steps.length - 1;

  return (
    <section data-bg="beige" className="bg-bg-light py-20 tablet:py-30">
      <Container>
        <div className="text-ink-dynamic">
          <p className={cn("flex items-center gap-2", label)}>
            <span aria-hidden="true" className="size-2 bg-current" />
            {content.eyebrow}
          </p>
          <TextReveal
            as="h2"
            lines={content.headingLines}
            settings={sectionTextRevealDynamic}
            className="mt-6 flex flex-col items-start gap-(--space-heading-line) text-display-lg leading-(--leading-display) tracking-(--tracking-display) font-normal"
          />
          <p className="mt-6 max-w-[48ch] font-body text-body-md">
            {content.subheading}
          </p>
        </div>

        {/* The frame, then the panel inset in it by 8 — a sheet on a mount. */}
        <div className="mt-12 border border-border-on-light p-2 tablet:mt-15">
          <div className="bg-bg-white px-6 py-8 text-fg-on-light tablet:px-10 tablet:py-10">
            <ol className="relative grid gap-8 desktop:grid-cols-5 desktop:gap-6">
              {/* The rule the markers sit on: down the left edge, then across
                  the top from desktop up. Through each 8px marker's centre. */}
              <span
                aria-hidden="true"
                className="absolute top-1 bottom-1 left-[3.5px] w-px bg-border-on-light desktop:inset-x-0 desktop:top-[3.5px] desktop:bottom-auto desktop:h-px desktop:w-auto"
              />
              {content.steps.map((step, i) => (
                <li key={step.title} className="relative pl-8 desktop:pl-0">
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute top-1 left-0 size-2 desktop:static desktop:block",
                      i === last
                        ? "border border-fg-on-light bg-accent"
                        : "bg-fg-on-light",
                    )}
                  />
                  <p
                    className={cn(
                      label,
                      "desktop:mt-6",
                      i === last ? "text-fg-on-light" : "text-fg-label",
                    )}
                  >
                    {step.label}
                  </p>
                  <h3 className="mt-3 font-display text-heading-md leading-(--leading-heading) font-normal">
                    {step.title}
                  </h3>
                  <p className="mt-2 font-body text-body-sm text-fg-on-light-muted">
                    {step.body}
                  </p>
                </li>
              ))}
            </ol>

            <div className="mt-10 flex flex-col gap-6 border-t border-border-on-light pt-8 tablet:flex-row tablet:items-center tablet:justify-between tablet:gap-10">
              <div>
                <p className={cn(label, "text-fg-label")}>{content.footer.label}</p>
                <p className="mt-2 max-w-[56ch] font-body text-body-md">
                  {content.footer.body}
                </p>
              </div>
              {/* `plan`: the dark body the pricing cards use on their light
                  panels, where the white primary would vanish. */}
              <Button
                href={cta.href}
                variant="plan"
                withArrow
                className="w-full shrink-0 tablet:w-[267px]"
              >
                {cta.label}
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
