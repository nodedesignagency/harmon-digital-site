/**
 * Home page content.
 *
 * Harmon Digital's copy, written from the client's website brief
 * (`client-brief/website-brief.md`) and the facts on their current site
 * (`client-brief/current-site/`). Every figure here comes from one of their
 * case studies. Components take this as typed props and contain no literal
 * strings — editing the site's words never means opening a component.
 */

import { ctaHref } from "@/config/site.config";
import { clientLogos } from "./clients";
type CtaLink = {
  label: string;
  href: string;
};

export const heroContent = {
  /**
   * Rendered as the page's single <h1>, one reveal block per line.
   *
   * Line breaks are explicit rather than left to text wrapping: each line is a
   * separate reveal block with its own sweeping bars, so where the break falls
   * is a design decision, not a side effect of the container width.
   */
  /**
   * ⚠️ Placeholder. The brief says the hero is "still thinking here", so this
   * states the brief's positioning until the client sends their own line.
   */
  headingLines: ["Custom Software & AI to", "Grow Portco EBITDA"],

  /**
   * The break moves on mobile, where the wider first line no longer fits. Given
   * explicitly rather than left to wrapping, for the same reason as above: each
   * line is its own reveal block, so where it breaks is a design decision.
   */
  headingLinesMobile: ["Custom Software & AI", "to Grow Portco EBITDA"],
  subheading:
    "We build custom software and AI employees for private equity portfolio companies — cutting software and fulfillment costs, and growing revenue.",
  primaryCta: { label: "Book a Call", href: ctaHref("/contact") } satisfies CtaLink,
  secondaryCta: { label: "See Our Work", href: "/case-study" } satisfies CtaLink,
} as const;

/** The brief's "Problem" section, as the statement that rides over the hero. */
export const aboutContent = {
  eyebrow: "Sound Familiar?",

  /**
   * One entry per visual line, as in the hero and for the same reason: each
   * line is its own reveal block with its own bars, so where the statement
   * breaks is a design decision rather than a side effect of the container
   * width. Breaks follow the owner's desktop layout.
   *
   * Joined with spaces these read as the original sentence, which is what
   * reaches assistive tech.
   */
  bodyLines: [
    "Your portcos are doing work",
    "that should be automated —",
    "paying for software they work",
    "around, losing leads, and gluing",
    "legacy tools together by hand.",
  ],

  /**
   * The desktop breaks are far too wide for a phone, so the statement is
   * re-broken rather than left to wrap — a wrapped block would put one bar
   * across two visual lines and lose the line-by-line reveal entirely.
   */
  bodyLinesMobile: [
    "Your portcos are",
    "doing work that",
    "should be automated —",
    "paying for software",
    "they work around,",
    "losing leads, and",
    "gluing legacy tools",
    "together by hand.",
  ],
} as const;

/**
 * The feature strip — six cards travelling left on a continuous marquee.
 *
 * The set is listed once here. The row renders it twice so the loop has
 * somewhere to hand off to, which is a rendering concern rather than content.
 */
export const featuresContent = {
  /**
   * The brief's "Solution": EBITDA grows from both sides — costs down, revenue
   * up — and each card is one lever from it.
   */
  headingLines: ["We Grow EBITDA From", "Both Sides of the P&L"],

  /**
   * Six cards, each with its own pastel. Order is the reading order and the
   * order they pass through the marquee.
   *
   * `image` names the artwork rather than importing it — content stays plain
   * data with no bundler imports, and a card whose art has not landed yet is
   * simply a key the artwork map does not answer, which the card renders as a
   * placeholder instead of failing.
   *
   * `tone` follows `image`, not the card's position: each picture was drawn
   * for one tint (coin/peach, database/magenta, arrows/lavender, bolt/green,
   * robot/blue, puzzle/rose). Move a picture and its tone moves with it.
   */
  cards: [
    {
      title: "Cut Software Spend",
      body: "Replace the stack of SaaS tools your teams work around with one system you own.",
      image: "revenue",
      tone: "peach",
    },
    {
      title: "Lower Fulfillment Costs",
      body: "Automate the data entry and back-office work your people do by hand every day.",
      image: "data",
      tone: "magenta",
    },
    {
      title: "Automated Follow-Up",
      body: "Every lead and missed call gets an instant, consistent follow-up, around the clock.",
      image: "improvement",
      tone: "lavender",
    },
    {
      title: "Inbound That Converts",
      body: "AI responders answer, qualify and book inbound leads the moment they arrive.",
      image: "workflow",
      tone: "green",
    },
    {
      title: "Outbound That Scales",
      body: "AI SDRs prospect and follow up, so pipeline grows without adding headcount.",
      image: "agents",
      tone: "blue",
    },
    {
      title: "Custom Software Moats",
      body: "Own your data and workflows, and ship new features without waiting on vendors.",
      image: "integrations",
      tone: "rose",
    },
  ],
} as const;

/** Keys the feature cards use to pick their artwork. */
export type FeatureImage = (typeof featuresContent.cards)[number]["image"];

/** Which pastel a card is filled with. */
export type FeatureTone = (typeof featuresContent.cards)[number]["tone"];

/**
 * How It Works — the brief's process, as a pinned scroll: the step number and
 * its picture hold still while each step's words scroll past.
 *
 * The five steps are the brief's own: "a full Audit (visual maps and SOPs),
 * Identify bottlenecks and opportunities, build, deploy and train, then keep
 * improving." The sentences under them borrow from the client's current
 * site's "How it works" where it says the same thing.
 *
 * `image` names one of the six 3D pictures the feature strip also uses, and
 * `tone` is the tint that picture was drawn for — the same pairing as the
 * feature cards, so the two sections read as one set.
 */
export const howItWorksContent = {
  headingLines: ["How It Works"],
  subheading:
    "We don’t guess. We map how your portcos actually run, build what moves the numbers, and stay on to keep improving it. Most clients are live in 4–8 weeks.",
  steps: [
    {
      title: "Audit",
      body: "A full audit of how the business runs — visual process maps and SOPs for every workflow, so you see exactly where time and money go.",
      image: "data",
      tone: "magenta",
    },
    {
      title: "Identify",
      body: "We pinpoint the bottlenecks and the biggest opportunities: the software and fulfillment costs to cut, and the revenue being left on the table.",
      image: "integrations",
      tone: "rose",
    },
    {
      title: "Build",
      body: "Custom software, AI employees and automations, scoped to the business and built in sprints. Working software along the way, no surprises.",
      image: "workflow",
      tone: "green",
    },
    {
      title: "Deploy & Train",
      body: "We launch it, train your people on the systems and on Claude, ChatGPT and Unstack, and make sure it works in the real world — not just in a demo.",
      image: "agents",
      tone: "blue",
    },
    {
      title: "Keep Improving",
      body: "As the business changes, the systems should too. We stay on, track the gains, and keep making it better.",
      image: "improvement",
      tone: "lavender",
    },
  ],
} as const satisfies {
  headingLines: readonly string[];
  subheading: string;
  steps: readonly {
    title: string;
    body: string;
    image: FeatureImage;
    tone: FeatureTone;
  }[];
};

/**
 * AI Employees — the brief's fifth section: "the roles we set up (inbound
 * responder, follow-up agent, outbound SDR, ops coordinator, back-office
 * assistant, etc.)".
 *
 * A bento of six tiles: the brief's five roles, then a sixth that stands for
 * the "etc." and carries the call to action. Order is the grid's reading
 * order — the component places each role by its position, so moving a role
 * here moves it in the grid.
 *
 * `image` names one of the 3D pictures. It is set loose in the tile's corner
 * rather than on a tint, so no `tone` is needed.
 */
export const aiEmployeesContent = {
  headingLines: ["AI Employees That", "Never Clock Out"],
  subheading:
    "Not chatbots. Trained AI employees that work inside your portcos’ own systems, around the clock — answering leads, following up and taking the manual work off your team.",
  roles: [
    {
      title: "Inbound Responder",
      body: "Answers every call, form and chat in seconds, qualifies the lead and books the meeting — nights and weekends included.",
      image: "workflow",
    },
    {
      title: "Follow-Up Agent",
      body: "Chases every quote, missed call and quiet thread until it closes. No lead goes cold because someone forgot.",
      image: "improvement",
    },
    {
      title: "Outbound SDR",
      body: "Researches accounts, writes personal outreach and books meetings, so pipeline grows without adding headcount.",
      image: "revenue",
    },
    {
      title: "Ops Coordinator",
      body: "Keeps jobs, schedules and hand-offs moving between teams, and flags what’s stuck before it costs you.",
      image: "integrations",
    },
    {
      title: "Back-Office Assistant",
      body: "Takes over the data entry, invoicing and reconciliation your people do by hand every day.",
      image: "data",
    },
  ],
  /**
   * The sixth tile, standing for the "etc.": every role the five above don't
   * name. A heading and a button, nothing else.
   */
  custom: {
    title: "Create Your Own AI Employee",
    cta: { label: "Book a Call", href: ctaHref("/contact") } satisfies CtaLink,
  },
} as const satisfies {
  headingLines: readonly string[];
  subheading: string;
  roles: readonly {
    title: string;
    body: string;
    image: FeatureImage;
  }[];
  custom: {
    title: string;
    cta: CtaLink;
  };
};

/**
 * Portfolio dashboards — the brief's sixth section: "a dashboard for every
 * portco so the fund can see exactly where each company stands and exactly
 * where the savings and revenue gains are coming from. This is a big selling
 * point, so give it real visual weight."
 *
 * Four files that stack as the reader scrolls, each a dashboard under its own
 * tab, after the owner's folder idea.
 *
 * ⚠️ Illustrative data, labelled on the page. The figures are built to agree
 * with each other and with the Before/After bridge — Portco 01 is that
 * bridge's company (+$1.35M, 12% → 17.7%):
 *
 *   fund EBITDA lift 4.2M = Portco 01 1.35M + 02 1.6M + 03 1.25M
 *                         = cost savings 1.6M + new revenue 5.2M × 50%
 *
 * and the savings' four lines add up to 1.6M. Confirm with the client before
 * launch (see HANDOFF.md).
 */
export const portfolioDashboardsContent = {
  eyebrow: "Portfolio dashboards",
  headingLines: ["Every Portco.", "One File Each."],
  subheading:
    "A live dashboard for every company in the fund: where each one stands, and exactly where the savings and the revenue gains are coming from.",
  note: "Illustrative data.",
  overview: {
    tab: "Fund overview",
    label: "EBITDA lift across the fund",
    total: 4_200_000,
    rows: [
      { name: "Portco 01", status: "live", lift: 1_350_000 },
      { name: "Portco 02", status: "live", lift: 1_600_000 },
      { name: "Portco 03", status: "live", lift: 1_250_000 },
      { name: "Portco 04", status: "building", lift: null },
      { name: "Portco 05", status: "audit", lift: null },
    ],
    statuses: { live: "Live", building: "Building", audit: "Audit" },
    caption: "See where every company stands, live.",
  },
  drilldown: {
    tab: "Portco drilldown",
    label: "Portco 01 · EBITDA margin",
    before: 0.12,
    after: 0.177,
    /** Twelve months of margin; the first `liveFrom` are before go-live. */
    months: [0.118, 0.121, 0.119, 0.12, 0.131, 0.142, 0.151, 0.158, 0.164, 0.169, 0.173, 0.177],
    liveFrom: 4,
    legend: { before: "Before go-live", after: "After" },
    caption: "Every number for one company, before and after go-live.",
  },
  savings: {
    tab: "Cost savings",
    label: "Saved per year, across the fund",
    parts: [
      { label: "Software", value: 600_000 },
      { label: "Fulfillment", value: 500_000 },
      { label: "Calls", value: 300_000 },
      { label: "Data entry", value: 200_000 },
    ],
    caption: "Every dollar saved, traced to the line it came off.",
  },
  revenue: {
    tab: "Revenue gains",
    label: "Revenue added by AI employees",
    total: 5_200_000,
    funnel: [
      { label: "Leads answered", value: 3_400 },
      { label: "Followed up", value: 2_900 },
      { label: "Booked", value: 1_100 },
      { label: "Won", value: 420 },
    ],
    caption: "From first answer to closed deal, $2.6M of it to EBITDA.",
  },
} as const satisfies {
  eyebrow: string;
  headingLines: readonly string[];
  subheading: string;
  note: string;
  overview: {
    tab: string;
    label: string;
    total: number;
    rows: readonly { name: string; status: "live" | "building" | "audit"; lift: number | null }[];
    statuses: Record<"live" | "building" | "audit", string>;
    caption: string;
  };
  drilldown: {
    tab: string;
    label: string;
    before: number;
    after: number;
    months: readonly number[];
    liveFrom: number;
    legend: { before: string; after: string };
    caption: string;
  };
  savings: {
    tab: string;
    label: string;
    parts: readonly { label: string; value: number }[];
    caption: string;
  };
  revenue: {
    tab: string;
    label: string;
    total: number;
    funnel: readonly { label: string; value: number }[];
    caption: string;
  };
};

/**
 * Trust section — "Why Top Companies Trust Us".
 *
 * Four statistics, then a strip of client marks. Each statistic splits its
 * figure from its unit because the two are set at different sizes: 98 large
 * with a small %, $ small with a large 25 and a small M. Storing "98%" as one
 * string would make that a parsing problem in the component.
 *
 * `value` is a number, not a string: it is the end of a count-up, so the
 * component needs to be able to do arithmetic on it.
 */
export const trustContent = {
  /** The brief's "Why us". */
  headingLines: ["Why Operators Trust Us"],
  /** The owner tightens the heading on a phone rather than wrapping it. */
  headingLinesMobile: ["Why We\u2019re Trusted"],
  subheading:
    "Our in-house platform, Unstack, gets systems live in weeks \u2014 and when a portco needs something fully custom, we build that too.",
  /** Each figure is from the named client's case study on the current site. */
  stats: [
    {
      label: "Cost Reduction",
      prefix: "",
      value: 30,
      unit: "%",
      body: "Happy Endings replaced its external software with one system it owns \u2014 and can sell with the business.",
      tone: "peach",
    },
    {
      label: "More Estimates",
      prefix: "",
      value: 40,
      unit: "%",
      body: "Mike\u2019s Fences booked more estimates once an AI agent answered and qualified every lead instantly.",
      tone: "green",
    },
    {
      label: "Raise Managed",
      prefix: "$",
      value: 20,
      unit: "m",
      body: "Investor tracking and automated document sends for SunMed Growers\u2019 $20M debt round.",
      tone: "blue",
    },
    {
      label: "Daily Users",
      prefix: "",
      value: 200,
      unit: "+",
      body: "Neighbors Bank\u2019s underwriters get answers in seconds from a RAG-powered Slack bot.",
      tone: "magenta",
    },
  ],
  /**
   * The strip's caption, broken where the owner's file breaks it rather than
   * where the measure happens to run out. Two lines at every width: it sits
   * beside a marquee whose height it sets, and a third line on a narrow
   * laptop pushed the row out of true.
   */
  logosCaptionLines: [
    "Trusted by operators in finance,",
    "healthcare, retail and services.",
  ],
  /**
   * Client marks. `mark` names the file and the strip imports it, from the one
   * set both this row and the contact page's row draw on.
   *
   * The thirteen on the client's current site, in its order. `name` is what a
   * screen reader gets, since a mark in a marquee says nothing on its own.
   */
  logos: clientLogos,
} as const;

/** Which pastel a statistic panel is filled with. */
export type TrustTone = (typeof trustContent.stats)[number]["tone"];

/**
 * Tech stack — the brief's "Training" section.
 *
 * Six tools laid out as a checkerboard. Order is the layout: the section fills
 * alternating cells in sequence, so moving an entry here moves its tile.
 *
 * The first three are what the brief says Harmon trains teams on; the other
 * three are what their case studies are built with.
 */
export const techStackContent = {
  /** No phone variant here, so each line has to fit a 360 phone (318px). */
  headingLines: ["Tools We Build With", "and Train Teams On"],
  /**
   * `mark` keys the artwork, which the section imports — the same split the
   * feature cards use, so this file stays free of imports and the build can
   * hash and serve the files it can see.
   */
  tools: [
    { name: "Claude", tone: "rose", mark: "claude" },
    { name: "ChatGPT", tone: "green", mark: "chatgpt" },
    { name: "Unstack", tone: "magenta", mark: "unstack" },
    { name: "Airtable", tone: "peach", mark: "airtable" },
    { name: "n8n", tone: "blue", mark: "n8n" },
    { name: "Make", tone: "lavender", mark: "make" },
  ],
} as const;

/** Which pastel a tech stack tile is filled with. */
export type ToolTone = (typeof techStackContent.tools)[number]["tone"];

/** Keys the tiles use to pick their mark. */
export type ToolMark = (typeof techStackContent.tools)[number]["mark"];

/**
 * Testimonials — the quote carousel.
 *
 * One card at a time with the next peeking past the right gutter, advanced by
 * the pair of arrows beside the heading.
 *
 * `photo` is optional and names a cut-out in `public/uploads/images` that the
 * section imports; the cut-out sits on the card's own fill. A quote without one
 * takes the card's full width rather than standing beside an empty column.
 *
 * The four quotes are verbatim from the client's current site. Where the site
 * credits a role rather than a person, `name` carries the role.
 */
type TestimonialItem = {
  quote: string;
  name: string;
  role: string;
  tone: "blue" | "green" | "yellow";
  photo?: string;
};

export const testimonialsContent = {
  headingLines: ["Testimonials"],
  subheading:
    "What operators say once the systems are live and the manual work is gone.",
  /** Labels for the two arrows. Never shown — they are the buttons' names. */
  controls: { previous: "Previous testimonial", next: "Next testimonial" },
  items: [
    {
      quote:
        "Isaac came in, mapped out our workflows, and built us a custom platform that handles what used to take hours. Our team can actually focus on growing the business instead of putting out fires.",
      name: "George Zimny",
      role: "Co-Founder @ ProducifyX",
      tone: "blue",
    },
    {
      quote:
        "Our underwriters used to spend an hour a day just looking things up. Now they ask the bot and get answers in seconds. It’s like having a senior analyst available 24/7.",
      name: "Operations Lead",
      role: "Neighbors Bank",
      tone: "green",
    },
    {
      quote:
        "We went from losing orders every week to never missing one. The system just works. And it costs us less than our old software.",
      name: "Owner",
      role: "Happy Endings",
      tone: "yellow",
    },
    {
      quote:
        "I used to spend half my day on the phone playing phone tag. Now I show up, give the estimate, and close the deal. The AI handles everything else.",
      name: "Mike",
      role: "Owner @ Mike’s Fences",
      tone: "blue",
    },
  ] as TestimonialItem[],
} as const;

/** Which pastel a testimonial card is filled with. */
export type TestimonialTone = TestimonialItem["tone"];

/** Which cut-out stands beside a quote. */
export type TestimonialPhoto = NonNullable<TestimonialItem["photo"]>;

/**
 * Before vs After.
 *
 * Two pinned panels: the three words, which split apart and fade as the page
 * moves under them, and then the pair of cards that slides up over them.
 */
export const beforeAfterContent = {
  /** Each word transforms on its own, so they are stored apart. */
  headingBefore: "Before",
  headingJoin: "vs",
  headingAfter: "After",
  /**
   * The brief's "Before and after" — how EBITDA changes. Written as the cost
   * and revenue story for now; the brief allows a static example and says it
   * may become a calculator later, which would be a design change, not copy.
   */
  columns: [
    {
      title: "Before working with us",
      body: "Margin leaks through software sprawl, manual work and revenue nobody follows up on.",
      tone: "dark",
      items: [
        {
          title: "Software Sprawl",
          body: "Six tools glued together, and teams still filling the gaps by hand.",
        },
        {
          title: "Manual Fulfillment",
          body: "Skilled people stuck on data entry and repetitive back-office work.",
        },
        {
          title: "Leaking Revenue",
          body: "Leads go cold and calls go unanswered when the team is busy.",
        },
      ],
    },
    {
      title: "After working with us",
      body: "One owned system that cuts costs, captures revenue and shows the fund where the gains come from.",
      tone: "light",
      items: [
        {
          title: "Leaner Cost Base",
          body: "Redundant subscriptions retired and manual work automated away.",
        },
        {
          title: "Revenue Captured",
          body: "Every lead answered and followed up, inbound and outbound.",
        },
        {
          title: "Clear Visibility",
          body: "Live dashboards show where each portco stands and why.",
        },
      ],
    },
  ],
} as const;

/** Which side of the comparison a column is. */
export type CompareTone = (typeof beforeAfterContent.columns)[number]["tone"];

/**
 * Before / After EBITDA — the brief's "show how EBITDA changes before and after
 * working with us. A static example is fine for now; it may become a
 * calculator later." It replaces `beforeAfterContent` on the home page; that
 * one stays above, with its component, as the fallback.
 *
 * A white section split in two: a big "Before" on the left that rolls to
 * "After" as the reader scrolls, over the EBITDA it comes to; on the right an
 * EBITDA bridge — the portco's EBITDA before, each source of the gain stacked
 * on it, and the EBITDA after.
 *
 * ⚠️ Illustrative figures, approved by the owner as a placeholder: one made-up
 * portco, labelled as an example on the page. Confirm with the client before
 * launch (see HANDOFF.md).
 *
 * Amounts are plain numbers in dollars; the component formats and draws them.
 * Keep them consistent: the steps must add up to the EBITDA difference
 *
 *   2.4M + 0.35M + 0.4M + 0.25M + 0.2M + 0.15M = 3.75M
 *
 * where the three revenue steps are the new revenue (1.2M) at a 50%
 * contribution margin. The margin and the enterprise value are worked out
 * from these, never typed in.
 */
export const beforeAfterEbitdaContent = {
  /** What the section is called for assistive tech; the eye gets the roll. */
  heading: "Before and after working with us",
  /** The word that rolls from one to the other, and the line under it. */
  state: { before: "Before", after: "After", tail: "working with us." },
  /** The line over the chart, its second half a step back. */
  lead: "Cut the costs, capture the revenue that slipped away,",
  tail: "and see what it does to EBITDA.",
  example: "Illustrative portco · $20M revenue",
  ebitda: { label: "EBITDA", before: 2_400_000, after: 3_750_000 },
  /** Only for the margin under the EBITDA figure. */
  revenue: { before: 20_000_000, after: 21_200_000 },
  marginLabel: "margin",
  /** The two lines that arrive with the last column: "+$1.35M EBITDA a year", "≈ +$10.8M in enterprise value at 8×". */
  gainLabel: "EBITDA a year",
  valueLabel: "in enterprise value at",
  bars: { before: "EBITDA before", after: "EBITDA after" },
  steps: [
    { label: "Software", value: 350_000 },
    { label: "Manual work", value: 400_000 },
    { label: "Inbound", value: 250_000 },
    { label: "Follow-up", value: 200_000 },
    { label: "Outbound", value: 150_000 },
  ],
  /** The EBITDA multiple the enterprise value is worked out at. */
  multiple: 8,
  footnote:
    "Illustrative example, not a client result. New revenue counted at a 50% contribution margin; enterprise value at an 8× EBITDA multiple.",
} as const satisfies {
  heading: string;
  state: { before: string; after: string; tail: string };
  lead: string;
  tail: string;
  example: string;
  ebitda: { label: string; before: number; after: number };
  revenue: { before: number; after: number };
  marginLabel: string;
  gainLabel: string;
  valueLabel: string;
  bars: { before: string; after: string };
  steps: readonly { label: string; value: number }[];
  multiple: number;
  footnote: string;
};
