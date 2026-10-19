import Image from "next/image";
import type { StaticImageData } from "next/image";
import continuousGrowth from "@public/uploads/icons/continuous-growth.png";
import highOwnership from "@public/uploads/icons/high-ownership.png";
import reliableDelivery from "@public/uploads/icons/reliable-delivery.png";
import teamWork from "@public/uploads/icons/team-work.png";

/**
 * The marks /partners sets in its benefits' tinted squares.
 *
 * The owner's own drawings wherever one fits — the same files the About
 * principles and the Careers benefits use — and two drawn here to match them
 * where none does: a coin for the referral fee and a box for the gift. Those
 * two are inline, at the files' weight (a 1.5 line at 24), in the ink.
 */

const files = {
  crown: highOwnership,
  shield: reliableDelivery,
  handshake: teamWork,
  loop: continuousGrowth,
} satisfies Record<string, StaticImageData>;

const drawn = {
  coin: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M14.75 9.25c-.4-.9-1.45-1.5-2.75-1.5-1.65 0-2.75.9-2.75 2.1 0 2.9 5.5 1.6 5.5 4.3 0 1.2-1.1 2.1-2.75 2.1-1.35 0-2.4-.6-2.85-1.55 M12 6.25v1.5 M12 16.25v1.5" />
    </>
  ),
  gift: (
    <path d="M4 10.5h16v3H4z M5.5 13.5v6.5h13v-6.5 M12 10.5V20 M12 10.5c-1.5-3.5-5.25-4-5.25-1.75 0 1.75 3 1.75 5.25 1.75Z M12 10.5c1.5-3.5 5.25-4 5.25-1.75 0 1.75-3 1.75-5.25 1.75Z" />
  ),
};

export type PartnerMark = keyof typeof files | keyof typeof drawn;

/** One mark at 24, as the benefit and principle marks are set. Decorative. */
export function PartnerMarkIcon({ mark }: { mark: PartnerMark }) {
  if (mark in files) {
    return (
      <Image
        src={files[mark as keyof typeof files]}
        alt=""
        width={24}
        height={24}
        className="size-6"
      />
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="size-6 text-fg-on-light"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {drawn[mark as keyof typeof drawn]}
    </svg>
  );
}
