import { CtaPanel } from "@/components/layout/CtaPanel";
import { Button } from "@/components/ui/Button";

/**
 * The closing call to action: the green panel with its pixel fringe, a
 * heading on the left and the button on the right.
 *
 * The footer opens with it on every page, from `footerContent.cta`. A page
 * that closes on its own words (/partners) renders this itself, in a dark
 * section marked `data-page-cta`, and `globals.css` takes the footer's copy
 * away on that page — the footer is mounted outside every page and cannot be
 * handed different words. Same component either way, so the two cannot drift.
 */

type ClosingCtaProps = {
  /** The heading's lines from tablet up. Where a line breaks is a decision. */
  headingLines: readonly string[];
  /** The heading's lines on a phone. */
  headingLinesMobile: readonly string[];
  action: {
    label: string;
    /** The button's words on a phone, where it runs full width. */
    labelShort: string;
    href: string;
  };
};

export function ClosingCta({ headingLines, headingLinesMobile, action }: ClosingCtaProps) {
  return (
    <CtaPanel className="relative flex flex-col justify-between gap-10 bg-cta p-10 text-fg-on-light tablet:flex-row tablet:items-center tablet:p-16">
      {/* Both sets of breaks are in the markup and one is shown, the same as
          the hero: where a line breaks is a decision, not a wrap. */}
      <h2 className="text-display-lg leading-(--leading-display) tracking-(--tracking-display) font-normal">
        <span className="flex flex-col max-tablet:hidden">
          {headingLines.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </span>
        <span className="flex flex-col tablet:hidden">
          {headingLinesMobile.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </span>
      </h2>

      {/* Full width on a phone, and the label can shorten there. The
          accessible name stays the long one either way. */}
      <Button
        href={action.href}
        variant="plan"
        withArrow
        aria-label={action.label}
        className="w-full shrink-0 tablet:w-auto"
      >
        <span className="max-tablet:hidden">{action.label}</span>
        <span className="tablet:hidden">{action.labelShort}</span>
      </Button>
    </CtaPanel>
  );
}
