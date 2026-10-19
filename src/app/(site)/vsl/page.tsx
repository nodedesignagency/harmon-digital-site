import { Container } from "@/components/layout/Container";
import { PageChrome } from "@/components/layout/PageChrome";
import { PageSurface } from "@/components/layout/PageSurface";
import { PatternField } from "@/components/motion/PatternField";
import { About } from "@/components/sections/About";
import { CaseStudies } from "@/components/sections/CaseStudies";
import { Faq } from "@/components/sections/Faq";
import { Features } from "@/components/sections/Features";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Trust } from "@/components/sections/Trust";
import { Button } from "@/components/ui/Button";
import { VideoPlayer } from "@/components/ui/VideoPlayer";
import { buildMetadata } from "@/config/seo";
import { ctaHref } from "@/config/site.config";
import { faqContent } from "@/content/faq";
import { trustContent } from "@/content/home";
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

  /** The home page's statement, cut to four pain points. */
  problem: {
    eyebrow: "Sound Familiar?",
    bodyLines: [
      "Too much spent on software.",
      "Leads lost before anyone calls.",
      "Teams stuck on manual work.",
      "No clear view across portcos.",
    ],
    bodyLinesMobile: [
      "Too much spent",
      "on software.",
      "Leads lost before",
      "anyone calls.",
      "Teams stuck on",
      "manual work.",
      "No clear view",
      "across portcos.",
    ],
  },

  /** Three cards in the home page's feature-card style. */
  offer: {
    headingLines: ["What You Get"],
    cards: [
      {
        title: "Cut Costs",
        body: "Retire the software you work around and automate the manual work.",
        image: "revenue",
        tone: "peach",
      },
      {
        title: "Grow Revenue",
        body: "AI employees answer, follow up and book every lead, day and night.",
        image: "workflow",
        tone: "green",
      },
      {
        title: "Portco Dashboards",
        body: "A dashboard for every portco, showing where each gain comes from.",
        image: "data",
        tone: "magenta",
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
    testimonial: {
      heading: "Hear It From a Client",
      video: { src: "", poster: "", title: "Client testimonial" },
    },
  },

  howItWorks: {
    headingLines: ["How It Works"],
    subheading:
      "We map how your portcos run, build what moves the numbers, and keep improving it.",
    steps: [
      {
        title: "Audit",
        body: "Every workflow mapped, with visual process maps and SOPs.",
        image: "data",
        tone: "magenta",
      },
      {
        title: "Identify",
        body: "The costs to cut and the revenue being missed.",
        image: "integrations",
        tone: "rose",
      },
      {
        title: "Build",
        body: "Custom software and AI employees, built in sprints.",
        image: "workflow",
        tone: "green",
      },
      {
        title: "Deploy & Train",
        body: "We launch it and train your teams to use it.",
        image: "agents",
        tone: "blue",
      },
      {
        title: "Keep Improving",
        body: "We track the gains and keep making it better.",
        image: "improvement",
        tone: "lavender",
      },
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

/** The site's call-to-action button, at its 267 from tablet up. */
function BookCall({ className }: { className?: string }) {
  return (
    <Button
      href={vsl.booking.href}
      withArrow
      className={className ?? "w-full tablet:w-[267px]"}
    >
      {vsl.booking.label}
    </Button>
  );
}

/**
 * /vsl — the video sales letter. One goal: book a call.
 *
 * Built from the home page's sections, each through a prop rather than a fork,
 * and the case study page's opening for the hero. The header and footer drop
 * their navigation here (PageChrome), so the only ways on are the booking
 * buttons; the footer's closing panel ("Ready to Grow Portco EBITDA?") is the
 * page's final call to action.
 *
 * Surfaces, top to bottom: the dark hero, the white logo strip, statement and
 * cards, the dark proof, the beige process and questions, the dark footer.
 */
export default async function VslPage() {
  const studies = await getCaseStudies();

  return (
    <>
      {/* Dark over the hero, light once past it, as the home page. */}
      <PageSurface value="hero" />
      <PageChrome value="landing" />

      {/* 1. The hero, in the case study page's opening: the pattern band under
          the header, the heading left and the call to action right, then the
          video at the full measure and the button again under it. */}
      <section
        data-bg="green"
        className="relative overflow-hidden bg-bg pt-[calc(var(--header-height)+9rem)] pb-20 text-fg tablet:pb-30"
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
              <h1 className="font-display text-display-xl leading-[calc(1em+var(--space-heading-line))] tracking-(--tracking-display) font-normal text-ink-dynamic">
                {vsl.hero.heading}
              </h1>
              <p className="text-ink-dynamic mt-6 max-w-[52ch] font-body text-body-md">
                {vsl.hero.subheading}
              </p>
            </div>
            <div className="desktop:justify-self-end">
              <BookCall />
            </div>
          </div>

          <VideoPlayer {...vsl.hero.video} className="mt-12 tablet:mt-20" />

          <div className="mt-10 flex justify-center">
            <BookCall />
          </div>
        </Container>
      </section>

      {/* 2. The client marks, without the statistics above them. */}
      <Trust content={trustContent} variant="logos" />

      {/* 3. The problem: the home page's statement, shorter and without the
          mark. Wrapped so its stickiness has nothing to stick through — on the
          home page it rides over the pinned hero; here it simply sits. */}
      <div>
        <About content={vsl.problem} showMark={false} />
      </div>

      {/* 4. What you get: three of the feature cards, standing still. */}
      <Features content={vsl.offer} layout="row" />

      {/* 5. Proof: two case studies, the testimonial video under them, then
          the button. The section's own link to the full index is off, so it
          does not lead off the page. */}
      <CaseStudies
        content={vsl.proof}
        studies={studies}
        limit={vsl.proof.count}
        showIndexLink={false}
      />
      <section data-bg="green" className="bg-bg pb-20 tablet:pb-30">
        <Container>
          <h2 className="text-ink-dynamic font-display text-display-md leading-(--leading-heading) tracking-(--tracking-display) font-normal">
            {vsl.proof.testimonial.heading}
          </h2>
          <VideoPlayer
            {...vsl.proof.testimonial.video}
            className="mt-8 tablet:mt-10"
          />
          <div className="mt-10 flex justify-center">
            <BookCall />
          </div>
        </Container>
      </section>

      {/* 6. How it works, at a glance rather than pinned. */}
      <HowItWorks content={vsl.howItWorks} compact />

      {/* 7. Four questions. Its strategy-call card books the same call. */}
      <Faq content={faq} />

      {/* 8. The final call to action is the footer's own panel. */}
    </>
  );
}
