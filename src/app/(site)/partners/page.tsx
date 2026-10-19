import { ClosingCta } from "@/components/layout/ClosingCta";
import { Container } from "@/components/layout/Container";
import { PageSurface } from "@/components/layout/PageSurface";
import { PartnerAudience } from "@/components/sections/PartnerAudience";
import { PartnerBenefits } from "@/components/sections/PartnerBenefits";
import { PartnersHero } from "@/components/sections/PartnersHero";
import { ReferralFormSection } from "@/components/sections/ReferralFormSection";
import { ReferralSteps } from "@/components/sections/ReferralSteps";
import { ReferralTypes } from "@/components/sections/ReferralTypes";
import { buildMetadata } from "@/config/seo";

/* ---------------------------------------------------------------------------
 * The page's content — every word on /partners, in one place.
 *
 * Edit here, not in the components. `#refer` is the referral form's anchor:
 * every "Refer a Company" on the page scrolls to it, so if `form.id` changes,
 * change `REFER` with it. Placeholders still waiting on real content are
 * marked in square brackets and listed in HANDOFF.md.
 * ------------------------------------------------------------------------- */

const REFER = "#refer";

const partners = {
  meta: {
    title: "Referral Partners",
    description:
      "Accountants, lawyers and bankers: refer a PE-backed company to Harmon Digital and get rewarded.",
  },

  hero: {
    eyebrow: "Referral Partners",
    headingLines: ["Know a Deal That Needs Us?", "Let's Both Win."],
    headingLinesMobile: ["Know a Deal", "That Needs Us?", "Let's Both Win."],
    subheading:
      "If you work with PE-backed companies, you see where they're losing money before anyone else. Send them our way and get rewarded.",
    cta: { label: "Refer a Company", href: REFER },
  },

  /** Three cards. `mark` is the drawing in the square, `tone` the card's tint. */
  audience: {
    headingLines: ["Who It's For"],
    cards: [
      {
        title: "Accountants",
        body: "You see the books, the software spend and the manual work first.",
        mark: "layers",
        tone: "blue",
      },
      {
        title: "Lawyers",
        body: "You're in the room for every acquisition and new portco.",
        mark: "people",
        tone: "green",
      },
      {
        title: "Bankers",
        body: "You know which companies are growing and which are stuck.",
        mark: "growth",
        tone: "lavender",
      },
    ],
  },

  /**
   * Six reasons. `detail` is a line under the copy for specifics; empty shows
   * nothing.
   */
  benefits: {
    headingLines: ["Why Partner With Us"],
    items: [
      {
        title: "Paid Well for Every Referral",
        body: "Earn a referral fee on every closed project.",
        detail: "[Payout details placeholder]",
        tone: "green",
        mark: "coin",
      },
      {
        title: "Gifts for Every Intro",
        body: "A thank you for every introduction, even before it closes.",
        detail: "[Gift details placeholder]",
        tone: "peach",
        mark: "gift",
      },
      {
        title: "Make Your Client Look Good",
        body: "Help them cut costs and grow EBITDA.",
        detail: "",
        tone: "blue",
        mark: "crown",
      },
      {
        title: "We Handle the Rest",
        body: "You make the intro, we take it from there.",
        detail: "",
        tone: "lavender",
        mark: "shield",
      },
      {
        title: "No Selling Needed",
        body: "Just connect us. No pitching on your end.",
        detail: "",
        tone: "rose",
        mark: "handshake",
      },
      {
        title: "Always in the Loop",
        body: "We keep you updated on every referral.",
        detail: "",
        tone: "magenta",
        mark: "loop",
      },
    ],
  },

  /** One row per kind of company. Each row goes to the form. */
  referralTypes: {
    headingLines: ["What Makes a Good Referral"],
    subheading: "If a company you know fits one of these, send it our way.",
    items: [
      "PE-backed companies after an acquisition",
      "Businesses running on manual work and spreadsheets",
      "Companies paying for too many disconnected tools",
      "Teams losing leads or missing follow-ups",
      "Portcos that need better reporting for the fund",
    ],
    href: REFER,
    actionLabel: "Refer a company like this",
  },

  /** Four steps. The numbers are drawn from the order. */
  process: {
    headingLines: ["How It Works"],
    steps: [
      {
        title: "Send the Intro",
        body: "Fill in the form below or email us. A name and a line of context is enough.",
        tone: "blue",
      },
      {
        title: "We Meet the Company",
        body: "We learn how they run and show them where the savings and the revenue are.",
        tone: "green",
      },
      {
        title: "We Start the Project",
        body: "If it's a fit, we scope it and get to work. You stay in the loop.",
        tone: "magenta",
      },
      {
        title: "You Get Paid, Plus a Gift",
        body: "Your referral fee is paid when the project closes.",
        tone: "peach",
      },
    ],
  },

  form: {
    /** The anchor `REFER` points at. */
    id: "refer",
    headingLines: ["Send a Referral"],
    subheading: "A name and a line of context is enough. We take it from there.",
    form: {
      label: "Referral form",
      fields: {
        name: { label: "Your name", placeholder: "Jane Smith" },
        firm: { label: "Your firm", placeholder: "Smith & Co." },
        email: { label: "Your email", placeholder: "jane@smithco.com" },
        company: { label: "Company you're referring", placeholder: "Acme Holdings" },
        contact: {
          label: "Contact person at that company",
          placeholder: "Name, role, and an email or phone",
        },
        note: {
          label: "Short note",
          placeholder: "What they do, and where they're stuck",
        },
      },
      submit: "Send Referral",
      sending: "Sending…",
      /** What the button reads once it has gone. Past tense: it is a report. */
      submitted: "Sent",
      failed: "Something went wrong. Please try again, or email us directly.",
      sent: {
        title: "Referral received",
        body: "Thank you. We'll be in touch about next steps.",
      },
    },
  },

  /** The closing panel, in place of the footer's own on this page. */
  closing: {
    headingLines: ["Have Someone in Mind?"],
    headingLinesMobile: ["Have Someone", "in Mind?"],
    action: { label: "Refer a Company", labelShort: "Refer a Company", href: REFER },
  },
} as const;

/* ------------------------------------------------------------------------- */

export const metadata = buildMetadata({
  title: partners.meta.title,
  description: partners.meta.description,
  path: "/partners",
});

/**
 * /partners — the referral partner page. One goal: send a referral.
 *
 * Built from copies of the Careers page's sections, in its order and on its
 * surfaces: the dark hero pinned while the white "who it's for" rides up over
 * it, the white reasons, then the beige list and process. The form follows on
 * white, and the page closes on its own green panel — the footer's, with this
 * page's words, which is why the footer's copy is taken away here (see
 * ClosingCta and `data-page-cta`).
 */
export default function PartnersPage() {
  return (
    <>
      {/* Dark over the opening, light once past it, as the Careers page. */}
      <PageSurface value="hero" />

      <div data-scroll-stack>
        <PartnersHero content={partners.hero} />
        <PartnerAudience content={partners.audience} />
      </div>
      <PartnerBenefits content={partners.benefits} />
      <ReferralTypes content={partners.referralTypes} />
      <ReferralSteps content={partners.process} />
      <ReferralFormSection content={partners.form} />

      {/* The closing call to action. Dark, as the footer it stands on, with
          the footer's spacing, so the page closes exactly as every other one
          does. */}
      <section data-page-cta="" className="bg-bg text-fg">
        <Container className="pt-20 pb-40">
          <ClosingCta {...partners.closing} />
        </Container>
      </section>
    </>
  );
}
