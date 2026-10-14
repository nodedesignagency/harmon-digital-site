/**
 * Pricing page content.
 *
 * The plans live here rather than in `home.ts` because two pages render them:
 * the home page's pricing section and this page's hero are the same component
 * reading the same object, so a rate can never be right in one place and stale
 * in the other.
 */

import { ctaHref } from "@/config/site.config";

/**
 * A plan card. `price` is optional: until the client's figures arrive a plan
 * shows `priceLabel` in the price's place, and the monthly/yearly toggle stays
 * hidden while no plan has a price to toggle.
 */
export type PricingPlan = {
  name: string;
  tone: "sky" | "lavender";
  icon: PlanIcon;
  /** Yearly is the *monthly* rate when billed for the year, not the year's
   * total — which is why `period` stays `/month` across the toggle and only
   * the number rolls. */
  price?: { monthly: number; yearly: number; period: string };
  priceLabel?: string;
  body: string;
  cta: { label: string; href: string };
  includesTitle: string;
  includes: readonly string[];
};

/**
 * Pricing — the brief's three tiers: Do it yourself (Unstack), Done with you
 * (1:1 training), Done for you (custom builds). The third is the wide card.
 *
 * ⚠️ No prices yet: the client is sending pricing details. Each card shows
 * what the tier is in the price's place until then.
 */
export const pricingContent = {
  /** The three tier names. No phone variant, so each line fits a 360 phone. */
  headingLines: ["Do It Yourself, With Us,", "or Done For You"],
  subheading:
    "Run it yourself on Unstack, get 1:1 training for your team, or hand us the whole build.",
  billing: { monthly: "Billed Monthly", yearly: "Billed Yearly" },
  plans: [
    {
      name: "Do It Yourself",
      tone: "sky",
      icon: "launch",
      priceLabel: "Unstack",
      body: "Build your own tables, pages, automations and integrations on Unstack — the platform we use for our own client work.",
      cta: { label: "Get Started", href: ctaHref("/contact") },
      includesTitle: "Do It Yourself includes:",
      /** One line each, like the template's: the column is narrow. */
      includes: [
        "Unstack workspace",
        "AI-built tables & pages",
        "Automations & integrations",
        "Replaces scattered tools",
        "Go at your own pace",
      ],
    },
    {
      name: "Done With You",
      tone: "lavender",
      icon: "scale",
      priceLabel: "1:1 Training",
      body: "We train your team 1:1 on Claude, ChatGPT and Unstack, and build alongside them until they can run it themselves.",
      cta: { label: "Book Training", href: ctaHref("/contact") },
      includesTitle: "Done With You includes:",
      includes: [
        "1:1 team sessions",
        "Claude, ChatGPT & Unstack",
        "Bottleneck mapping",
        "Hands-on build support",
        "SOPs your team keeps",
      ],
    },
  ] as readonly PricingPlan[],
  enterprise: {
    name: "Done For You",
    tone: "peach",
    icon: "enterprise",
    title: "Custom Builds",
    body: "We audit the business, build the custom software and AI employees, deploy and train your team, then keep improving it.",
    cta: { label: "Book a Call", href: ctaHref("/contact") },
    includesTitle: "Done For You includes:",
    /** Two columns, read down each. The brief's "How it works", then what gets built. */
    includes: [
      ["Full operations audit", "Visual process maps & SOPs", "Custom software builds", "AI employees", "Integrations with your stack"],
      ["Automated follow-up", "Inbound & outbound systems", "Portfolio dashboards", "Team training", "Ongoing improvement"],
    ],
  },
} as const;

/** Which tint a plan's header strip and border are drawn in. */
export type PlanTone = PricingPlan["tone"] | "peach";

/** Keys the plan cards use to pick their header icon. */
export type PlanIcon = "launch" | "scale" | "enterprise";

/**
 * Impact — the band under the plans.
 *
 * Four figures, each credited to the client it came from. The counting figures
 * are split into prefix / value / unit the way the trust stats are, so the
 * number is a number the counter can climb to rather than a string: "-45%" is
 * a minus, forty-five and a percent sign.
 *
 * ⚠️ Client names are placeholders: the owner's four marks are logoipsum
 * stand-ins, so `client` labels every slot the same. `mark` names the file and
 * the section imports it — content that held the artwork itself could not be
 * moved to a CMS.
 */
export const impactContent = {
  headingLines: ["Mahadeva speeds up", "teams with automation."],
  stats: [
    {
      client: "Logoipsum",
      mark: "success",
      prefix: "",
      value: 98,
      unit: "%",
      label: "Project Success",
    },
    {
      client: "Logoipsum",
      mark: "revenue",
      prefix: "",
      value: 10,
      unit: "x",
      label: "Revenue Efficiency",
    },
    {
      client: "Logoipsum",
      mark: "costs",
      prefix: "-",
      value: 45,
      unit: "%",
      label: "Operational Costs",
    },
    {
      client: "Logoipsum",
      mark: "hours",
      prefix: "",
      value: 300,
      unit: "+",
      label: "Hours Saved Monthly",
    },
  ],
} as const;

/** Which client mark heads an impact figure. */
export type ImpactMark = (typeof impactContent.stats)[number]["mark"];

/**
 * Plan comparison — "Find The Right Plan".
 *
 * Three plans against the same list of features, in three groups. A cell is
 * either a phrase or a yes/no: `true` and `false` render as the tick and the
 * cross, so the table never spells "Included" in one row and draws a tick for
 * the same meaning in the next.
 *
 * The blurbs are the comparison's own — shorter than the cards' copy above,
 * since here they sit in a column head rather than a card.
 *
 * ⚠️ Read from the owner's reference shot. The plan names and tints match the
 * cards; the feature list is this table's alone.
 */
export const compareContent = {
  headingLines: ["Find The Right Plan"],
  subheading:
    "Compare features, automation capacity, and support levels to pick what fits your growth stage.",
  plans: [
    {
      name: "Launch",
      tone: "sky",
      body: "Simple automation workflows built for growing teams.",
      cta: { label: "Get Started", href: ctaHref("/contact") },
    },
    {
      name: "Scale",
      tone: "lavender",
      body: "Advanced automation designed to accelerate team growth.",
      cta: { label: "Get Started", href: ctaHref("/contact") },
    },
    {
      name: "Enterprise",
      tone: "peach",
      body: "Custom AI infrastructure built for enterprise scale.",
      cta: { label: "Get Started", href: ctaHref("/contact") },
    },
  ],
  /** Values are in plan order: Launch, Scale, Enterprise. */
  groups: [
    {
      title: "General",
      rows: [
        {
          label: "Automation Projects",
          values: ["1 Active System", "Up to 5 Systems", "Unlimited Systems"],
        },
        {
          label: "Monthly Runs",
          values: ["Up to 2,000", "Up to 75,000", "Unlimited"],
        },
        {
          label: "Connected Tools",
          values: ["Core Integrations", "Advanced Stack", "Custom Ecosystem"],
        },
        {
          label: "Support Access",
          values: ["Email Support", "Priority Support", "Dedicated Success Team"],
        },
      ],
    },
    {
      title: "Automation Capabilities",
      rows: [
        { label: "Visual Workflow Builder", values: [true, true, true] },
        { label: "Event Triggers", values: ["Basic", "Advanced", "Advanced"] },
        { label: "Context Memory", values: [false, true, true] },
        { label: "Performance Insights", values: [false, "Included", "Included"] },
      ],
    },
    {
      title: "Security & Access",
      rows: [
        {
          label: "Activity Tracking",
          values: ["Only Once", "Basic Logs", "Full Audit Logs"],
        },
        { label: "SSO / Identity Login", values: [false, true, true] },
        { label: "Private Infrastructure", values: [false, false, true] },
        { label: "Custom Compliance", values: [false, false, true] },
      ],
    },
  ],
} as const;
