import Image from "next/image";
import harmonIcon from "@public/uploads/images/harmon-icon.png";
import type { CSSProperties } from "react";
import Link from "next/link";
import { ButtonArrow } from "@/components/ui/SiteIcons";
import { ctaCardHover } from "@/config/animation";
import { leavesSite } from "@/lib/href";
import { cn } from "@/lib/cn";

/**
 * The strategy-call card: Harmon's mark, a heading and a line, the whole card
 * a link, an arrow in its corner. First drawn for the FAQ; the portfolio
 * dashboards use it too.
 *
 * The whole card is the link. The arrow rides its top right corner in a box of
 * its own, filled with the ink at a tenth rather than outlined — the same
 * cut-out language as the buttons.
 *
 * Two things move on hover and the card is neither: the fill swells a couple
 * of pixels past every edge, and the arrow is replaced — one leaves through
 * the corner as another arrives behind it. Both are `.mh-cta-*` in
 * globals.css; the numbers are `ctaCardHover`.
 */

type CtaCardProps = {
  href: string;
  title: string;
  body: string;
  /**
   * The card's fill, which has to stand off the section it sits on: white on
   * the FAQ's beige, beige on a white section.
   */
  fill: "bg-bg-white" | "bg-bg-light";
  className?: string;
};

export function CtaCard({ href, title, body, fill, className }: CtaCardProps) {
  return (
    <Link
      href={href}
      // The card is the one call to action on the site that is an anchor
      // rather than a Button, so it does not get the button's handling of an
      // outbound link and has to say the same thing itself. Which it may need
      // to: on the template's own site this points at the buy link rather than
      // at /contact. See `ctaHref`.
      {...(leavesSite(href)
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
      className={cn(
        "mh-cta-card relative flex w-full max-w-[26rem] items-center gap-4 p-2",
        className,
      )}
      style={
        {
          "--mh-cta-grow": `${ctaCardHover.grow}px`,
          "--mh-cta-travel": `${ctaCardHover.arrowTravel}px`,
          "--mh-cta-duration": `${ctaCardHover.duration}ms`,
        } as CSSProperties
      }
    >
      {/* The fill is its own layer because it has to be able to outgrow the
          card. On the card itself there is nothing to grow — a background is
          the box.

          Which is also why the card's radius lives here: this layer is the
          card as far as the eye is concerned, and rounding the link instead
          would round nothing. */}
      <span
        aria-hidden="true"
        className={cn("mh-cta-fill absolute rounded-(--radius-button)", fill)}
      />

      {/* The mark. Square, and the height of the content box: 64 inside 8px
          of padding is the card's 80, and it is the mark that sets that rather
          than the words beside it.

          Harmon Digital's green "//" mark, the favicon's drawing, in the slot
          the template gave a portrait — a person's face here should be someone
          the reader would actually talk to. */}
      <span
        aria-hidden="true"
        className="relative block size-16 shrink-0 overflow-clip bg-placeholder"
      >
        <Image
          src={harmonIcon}
          alt=""
          fill
          sizes="64px"
          className="object-cover"
        />
      </span>
      <span className="relative flex flex-col gap-2">
        {/* A heading at the body's leading is half a line taller than it
            should be, which is enough to push this column past the portrait
            and make the card set its own height. */}
        <span className="font-display text-heading-md leading-(--leading-heading) text-fg-on-light">
          {title}
        </span>
        <span className="font-body text-body-md text-fg-on-light">{body}</span>
      </span>

      {/* The corner clips both arrows, which is what makes one leave and the
          other arrive rather than both simply sliding about.

          It carries the card's radius on the one corner it shares with it.
          The card cannot clip its own children — the fill has to be free to
          grow past it — so the corner is rounded here instead of inherited. */}
      <span
        aria-hidden="true"
        className="absolute top-0 right-0 flex size-8 items-center justify-center overflow-hidden rounded-tr-(--radius-button) bg-fg-on-light/10"
      >
        <ButtonArrow className="mh-cta-arrow-out absolute size-4 text-fg-on-light" />
        <ButtonArrow className="mh-cta-arrow-in absolute size-4 text-fg-on-light" />
      </span>
    </Link>
  );
}
