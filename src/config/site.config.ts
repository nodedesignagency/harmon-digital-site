import { configuredUrl } from "@/lib/env";

/**
 * Site-wide configuration.
 *
 * This is the first file a template buyer should open. Name, URL, contact
 * details, default metadata and feature flags all live here — no component
 * reads these values from anywhere else.
 */

export const siteConfig = {
  name: "Harmon Digital",
  /** Short label used in the header wordmark and OG images. */
  shortName: "Harmon Digital",
  tagline: "Custom software & AI employees for PE portfolio companies",
  description:
    "Harmon Digital builds custom software and AI employees for private equity portfolio companies — cutting software and fulfillment costs, and growing revenue with automated follow-up, inbound and outbound.",

  /**
   * Absolute production URL. Drives canonical URLs, the sitemap and the share
   * card, so it must be right before deploying. Set NEXT_PUBLIC_SITE_URL.
   *
   * `configuredUrl` rather than the variable itself: set-but-empty is what a
   * hosting dashboard hands you for a row with no value, and it used to reach
   * `new URL("")` and take the whole build down. It also forgives a trailing
   * slash and a missing `https://`.
   */
  url:
    configuredUrl(process.env.NEXT_PUBLIC_SITE_URL) ??
    "https://www.harmon-digital.com",

  locale: "en_US",
  /** Used on <html lang>. */
  lang: "en",

  contact: {
    email: "info@harmon-digital.com",
    phone: "",
    location: "Austin, TX",
  },


  /**
   * The client's booking link (Calendly or similar). Empty until they send it,
   * and every "Book a Call" on the site falls back to /contact meanwhile. Set
   * it here and every one of them points at it — the header's, the footer
   * panel's, the FAQ card's and every button on /vsl. See `ctaHref`.
   */
  booking: "" as string,

  /** Twitter/X handle including the @, or an empty string to omit the tag. */
  twitterHandle: "",

  /**
   * The floating badge in the bottom right corner.
   *
   * `href` empty draws the badge without making it a link — see BuyTemplate.
   * Set `show` to false to take it off the site entirely.
   */
  template: {
    show: false,
    label: "Launch in hours",
    action: "Buy Template",
    href: "https://contra.com/payment-link/wHlBeqQJ-mahadeva-ai-agency-next-js-template-standard-license",
  },
} as const;

/**
 * Where a primary call to action points.
 *
 * On the template's own demo site every one of them sells the template: the
 * hero's consultation button, the footer's, the FAQ's strategy-call card, the
 * three plan buttons and the comparison table's. A visitor there is not
 * hiring an agency, they are looking at something for sale, and sending them
 * to a contact form for an agency that is not taking the enquiry wastes the
 * one click they were willing to give.
 *
 * A buyer's site is the opposite case, and the switch is already there:
 * `template.show` is what hides the floating buy badge, and it is the first
 * thing the launch checklist says to turn off. Off, each call to action falls
 * back to the page it names — /contact, and the enquiry form that is already
 * wired to their endpoint — and nothing anywhere on the site still points at
 * where it was bought.
 *
 * So the buy link is written once, here, rather than nine times across four
 * content files, and a buyer never has to find the other eight.
 */
export function ctaHref(fallback: string): string {
  if (siteConfig.template.show) return siteConfig.template.href;
  // The client's booking link, once they have sent it — empty does nothing.
  return siteConfig.booking || fallback;
}
