import testimonialPoster from "@public/uploads/images/vsl-testimonial-poster.jpg";
import { Container } from "@/components/layout/Container";
import { PageChrome } from "@/components/layout/PageChrome";
import { PageSurface } from "@/components/layout/PageSurface";
import { PatternField } from "@/components/motion/PatternField";
import { PinAtFoot } from "@/components/motion/PinAtFoot";
import { CaseStudies } from "@/components/sections/CaseStudies";
import { Faq } from "@/components/sections/Faq";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Problems } from "@/components/sections/Problems";
import { ClientLogoRow } from "@/components/sections/Trust";
import { VideoTestimonial } from "@/components/sections/VideoTestimonial";
import { WhatYouGet } from "@/components/sections/WhatYouGet";
import { Button } from "@/components/ui/Button";
import { VideoPlayer } from "@/components/ui/VideoPlayer";
import { buildMetadata } from "@/config/seo";
import { ctaHref } from "@/config/site.config";
import { faqContent } from "@/content/faq";
import {
  howItWorksContent,
  portfolioDashboardsContent,
  testimonialsContent,
  trustContent,
} from "@/content/home";
import { getCaseStudies } from "@/lib/case-studies";

/* ---------------------------------------------------------------------------
 * The page's content — every word on /vsl, in one place.
 *
 * Kept here rather than in src/content/ on purpose: a landing page is edited
 * as one thing, and its copy is short. Swap a video in by giving its `src` a
 * file URL (.mp4) or an embed URL; empty shows the placeholder frame. The
 * booking link is the site's own — set `booking` in src/config/site.config.ts
 * and every "Book a Call" here (and across the site) follows it.
 * ------------------------------------------------------------------------- */

const vsl = {
  meta: {
    title: "How PE Firms Grow Portco EBITDA With AI",
    description:
      "Watch how Harmon Digital cuts software and manual costs and captures missed revenue across a portfolio. Then book a call.",
  },

  /** Every call to action on the page. */
  booking: { label: "Book a Call", href: ctaHref("/contact") },

  hero: {
    heading: "How PE Firms Grow Portco EBITDA With AI",
    subheading:
      "Watch how we cut software and manual costs across a portfolio, and capture the revenue that slips through.",
    video: {
      src: "",
      poster: "",
      title: "How PE firms grow portco EBITDA with AI",
    },
  },

  /** Four pain points, one cell each. `drawing` picks the line drawing. */
  problem: {
    headingLines: ["Your Portcos Are Doing Work", "That Should Be Automated"],
    subheading:
      "Each of these takes a bite out of EBITDA, and every one of them can be fixed.",
    items: [
      {
        tag: "Software",
        title: "Too much spent on software.",
        body: "Six tools glued together, and still waiting on someone else\u2019s roadmap for the feature you need.",
        drawing: "stack",
        tone: "peach",
      },
      {
        tag: "Leads",
        title: "Leads lost before anyone calls.",
        body: "Calls go unanswered and follow-ups never happen, so revenue walks out the door.",
        drawing: "conveyor",
        tone: "blue",
      },
      {
        tag: "Manual work",
        title: "Teams stuck on manual work.",
        body: "Skilled people retyping the same data between systems, day after day.",
        drawing: "systems",
        tone: "green",
      },
      {
        tag: "Visibility",
        title: "No clear view across portcos.",
        body: "Guessing where each company stands, from data you don\u2019t even own.",
        drawing: "portcos",
        tone: "magenta",
      },
    ],
  },

  /**
   * One card per thing the fund gets: the words on white on the left, and on
   * the right the matching home page dashboard file, figures and all, on its
   * tint (`tone`). `includes` runs along the foot of the words, each point
   * with its own small icon (`icon`).
   */
  offer: {
    headingLines: ["What You Get"],
    subheading:
      "Lower costs, more revenue, and a live view of both across the fund.",
    items: [
      {
        title: "Cut Costs",
        body: "We retire the software you work around and automate the manual work, so the savings land on the P&L.",
        includes: [
          { label: "Software retired", icon: "layers" },
          { label: "Manual work automated", icon: "bolt" },
          { label: "Systems you own", icon: "key" },
        ],
        preview: "savings",
        tone: "lavender",
      },
      {
        title: "Grow Revenue",
        body: "AI employees answer, follow up and book every lead, day and night.",
        includes: [
          { label: "Inbound Responder", icon: "phone" },
          { label: "Follow-Up Agent", icon: "repeat" },
          { label: "Outbound SDR", icon: "send" },
        ],
        preview: "revenue",
        tone: "peach",
      },
      {
        title: "Portco Dashboards",
        body: "A live dashboard for every portco, showing exactly where each gain comes from.",
        includes: [
          { label: "Every portco, one screen", icon: "grid" },
          { label: "Savings by line", icon: "trendDown" },
          { label: "Revenue by source", icon: "trendUp" },
        ],
        preview: "overview",
        tone: "blue",
      },
    ],
  },

  proof: {
    headingLines: ["Proof From", "Real Operators"],
    subheading: "Two of the businesses we have built for, and what changed.",
    /** Not shown: the index link is off here. Kept to fill the section's shape. */
    cta: { label: "See All Work", href: "/case-study" },
    /** How many case study cards. */
    count: 2,
  },

  /**
   * One large card with the client's video, three under it, each its own
   * colour (`tone`). The words are the home page's testimonials, picked by
   * `name`; the marks are this page's.
   *
   * The video's poster is the still the client sent with it. Who is in it is
   * not confirmed (see HANDOFF.md): the featured quote beside it is George
   * Zimny's until it is, and should be swapped for the speaker's own.
   */
  testimonial: {
    headingLines: ["Hear It From Our Clients"],
    headingLinesMobile: ["Hear It From", "Our Clients"],
    subheading:
      "What operators say once the systems are live and the manual work is gone.",
    featured: {
      name: "George Zimny",
      mark: "producifyx",
      tone: "blue",
      video: { src: "", poster: testimonialPoster, title: "Client testimonial" },
    },
    items: [
      { name: "Operations Lead", mark: "neighborsBank", tone: "green" },
      { name: "Owner", mark: "happyEndings", tone: "yellow" },
      { name: "Mike", mark: "mikesFences", tone: "lavender" },
    ],
  },

  /** Four of the home page's questions, by their wording there. */
  faqQuestions: [
    "How long until we see results?",
    "Can you work across a whole portfolio?",
    "What if it doesn’t work?",
    "Do our teams need to be technical?",
  ],
} as const;

/* ------------------------------------------------------------------------- */

export const metadata = buildMetadata({
  title: vsl.meta.title,
  description: vsl.meta.description,
  path: "/vsl",
});

/** The FAQ section, holding only the four questions this page asks. */
const faq = {
  ...faqContent,
  items: faqContent.items.filter((item) =>
    (vsl.faqQuestions as readonly string[]).includes(item.question),
  ),
};

/** A testimonial's words, looked up from the home page's by `name`. */
function said(name: string) {
  const item = testimonialsContent.items.find((t) => t.name === name);
  if (!item) throw new Error(`/vsl: no testimonial by "${name}" on the home page`);
  return { quote: item.quote, name: item.name, role: item.role };
}

/** The testimonial section, with its words filled in. */
const testimonial = {
  ...vsl.testimonial,
  featured: { ...vsl.testimonial.featured, ...said(vsl.testimonial.featured.name) },
  items: vsl.testimonial.items.map((item) => ({ ...item, ...said(item.name) })),
};

/**
 * /vsl — the video sales letter. One goal: book a call.
 *
 * The header and footer drop their navigation here (PageChrome), so the only
 * ways on are the booking buttons; the footer's closing panel ("Ready to Grow
 * Portco EBITDA?") is the page's final call to action.
 *
 * Surfaces, top to bottom: the dark opening (hero, video and client marks)
 * pinned while the white problems ride up over it, as the home page hands
 * over; the white offer and its coloured cards; the dark proof and testimonials;
 * the beige process and questions; the dark footer.
 */
export default async function VslPage() {
  const studies = await getCaseStudies();

  return (
    <>
      {/* Dark over the opening, light once the problems have ridden up over it
          — the strip flips at the section marked `data-surface-flip`. */}
      <PageSurface value="hero" />
      <PageChrome value="landing" />

      <div data-scroll-stack>
        {/* 1. The opening, in the case study page's shape: the pattern band
            under the header, the heading left and the call to action right,
            the video at the full measure, and the client marks at its foot,
            on the same green. It paints its own fill (`data-bg-keep`), so it
            is green from the first frame rather than fading in from white,
            and its words are in the fixed light ink. Taller than the screen,
            so it pins by its foot — see PinAtFoot.

            Its `data-bg` is the white base under it, not its own colour, as
            the home page's hero does. Declared green, the page behind stayed
            dark while the problems rode up and only crossfaded to white as
            What You Get scrolled in — that section arrived green and faded
            light. Declared white, the page is white from the start and
            nothing changes until the dark proof. */}
        <PinAtFoot
          data-bg="white"
          data-bg-keep=""
          className="overflow-hidden bg-bg pt-[calc(var(--header-height)+9rem)] pb-16 text-fg tablet:pb-20"
        >
          <PatternField
            side="top"
            orientation="horizontal"
            thickness={26}
            className="top-header"
          />

          <Container className="relative">
            <div className="grid items-end gap-8 desktop:grid-cols-[8fr_5fr] desktop:gap-20">
              <div>
                <h1 className="font-display text-display-xl leading-[calc(1em+var(--space-heading-line))] tracking-(--tracking-display) font-normal text-fg">
                  {vsl.hero.heading}
                </h1>
                <p className="mt-6 max-w-[52ch] font-body text-body-md text-fg">
                  {vsl.hero.subheading}
                </p>
              </div>
              <div className="desktop:justify-self-end">
                <Button
                  href={vsl.booking.href}
                  withArrow
                  className="w-full tablet:w-[267px]"
                >
                  {vsl.booking.label}
                </Button>
              </div>
            </div>

            <VideoPlayer {...vsl.hero.video} className="mt-12 tablet:mt-20" />

            <ClientLogoRow
              content={trustContent}
              tone="dark"
              className="mt-16 tablet:mt-20"
            />
          </Container>
        </PinAtFoot>

        {/* The hold: once the opening has pinned, this much more scrolling
            before the problems start to cover it. Clear, so the pinned
            opening shows through it the whole way. */}
        <div aria-hidden="true" className="h-[15svh]" />

        {/* 2. The problems, riding up over the pinned opening: positioned,
            above it, and opaque in its own white. A screen tall from desktop
            up, so it has covered the opening by the time the two leave. */}
        <Problems
          content={vsl.problem}
          data-bg="white"
          data-bg-keep=""
          data-surface-flip=""
          className="relative z-10 flex flex-col justify-center desktop:min-h-svh"
        />
      </div>

      {/* 3. What you get: a coloured card each, with its dashboard. */}
      <WhatYouGet
        content={vsl.offer}
        dashboards={portfolioDashboardsContent}
        cta={vsl.booking}
      />

      {/* 4. Proof: two case studies. The section's own link to the full index
          is off, so it does not lead off the page. */}
      <CaseStudies
        content={vsl.proof}
        studies={studies}
        limit={vsl.proof.count}
        showIndexLink={false}
        subheadingAside
      />

      {/* 5. The client's video in a large card, three more under it. */}
      <VideoTestimonial content={testimonial} cta={vsl.booking} />

      {/* 6. How it works: the home page's section, as it is there. */}
      <HowItWorks content={howItWorksContent} />

      {/* 7. Four questions. Its strategy-call card books the same call. */}
      <Faq content={faq} />

      {/* 8. The final call to action is the footer's own panel. */}
    </>
  );
}
