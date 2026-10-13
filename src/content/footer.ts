/**
 * Footer copy.
 *
 * The original pairs the closing call to action and the footer as one block,
 * so they are one component and one content file. Links come from
 * `config/navigation`, which stays the single source for routes.
 *
 * Labels carry their braces as written — `{EMAIL}` is the original's styling
 * for a column heading, not a template placeholder.
 */

import { ctaHref } from "@/config/site.config";
export const footerContent = {
  cta: {
    /** One entry per visual line, as elsewhere: the break is a decision. */
    headingLines: ["Ready to Grow", "Portco EBITDA?"],
    /**
     * The break moves on a phone, where the first line no longer fits. Here
     * both lines fit a 360px phone's panel (238px) as they are.
     */
    headingLinesMobile: ["Ready to Grow", "Portco EBITDA?"],
    action: {
      label: "Book a Call",
      /** The phone drops the verb; the button is the whole width there. */
      labelShort: "Book a Call",
      href: ctaHref("/contact"),
    },
  },

  /** No phone number on the client's current site, so email only. */
  contact: [
    { label: "{Email}", value: "info@harmon-digital.com", href: "mailto:info@harmon-digital.com" },
  ],

  copyright: "@2026 Harmon Digital. All Rights Reserved.",
  /** The people who built it, each linking to their own profile. */
  credits: {
    label: "Made by:",
    people: [
      { name: "Breeje", href: "https://x.com/BreejeAnadkat" },
      { name: "Shubham", href: "https://www.linkedin.com/in/sbiswas29/" },
      { name: "Anas", href: "https://x.com/AnasKaratela7" },
    ],
  },

  /** The oversized wordmark the page closes on. */
  wordmark: "Harmon",
} as const;
