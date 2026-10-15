import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Features } from "@/components/sections/Features";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { AiEmployees } from "@/components/sections/AiEmployees";
import { CaseStudies } from "@/components/sections/CaseStudies";
import { Trust } from "@/components/sections/Trust";
import { TechStack } from "@/components/sections/TechStack";
import { Testimonials } from "@/components/sections/Testimonials";
import { BeforeAfterEbitda } from "@/components/sections/BeforeAfterEbitda";
import { Pricing } from "@/components/sections/Pricing";
import { Faq } from "@/components/sections/Faq";
import { PageSurface } from "@/components/layout/PageSurface";
import { Preloader, PreloaderScript } from "@/components/motion/Preloader";
import {
  aboutContent,
  aiEmployeesContent,
  beforeAfterEbitdaContent,
  featuresContent,
  heroContent,
  howItWorksContent,
  techStackContent,
  testimonialsContent,
  trustContent,
} from "@/content/home";
import { faqContent } from "@/content/faq";
import { pricingContent } from "@/content/pricing";
import { caseStudiesContent } from "@/content/case-studies";
import { getCaseStudies } from "@/lib/case-studies";

/**
 * Home page.
 *
 * Sections are added one at a time, in the order of the original template:
 * Hero -> About -> Features -> How It Works -> Case Studies -> Stats ->
 * Tech Stack -> Testimonials -> Before/After -> Pricing -> FAQ -> CTA.
 *
 * How It Works is Harmon Digital's addition, the brief's fourth section: a
 * beige band between the white features and the dark case studies, so the
 * background runs white -> beige -> green there.
 *
 * AI Employees, the brief's fifth, follows it on the dark green: a ticker of
 * the roles Harmon sets up, ahead of the case studies.
 */
export default async function HomePage() {
  const studies = await getCaseStudies();

  return (
    <>
      {/* First, and blocking: it decides before the body paints whether the
          preloader runs at all, and the sheet must not flash at a reader who
          asked for less motion. Home only — a preloader on the fifth page a
          reader opens is a door held shut on someone already inside — but
          every time home is opened, including through a link back to it. */}
      <PreloaderScript />
      <Preloader />

      {/* Dark over the hero, light from the moment the reader is past it. */}
      <PageSurface value="hero" />

      {/* Hero and About share one stack: both stick to the top, so About rides
          up over the pinned hero rather than pushing it off. The stack's height
          is what decides how long each stays pinned. */}
      <div data-scroll-stack>
        <Hero content={heroContent} />
        <About content={aboutContent} />
      </div>
      <Features content={featuresContent} />
      <HowItWorks content={howItWorksContent} />
      <AiEmployees content={aiEmployeesContent} />
      <CaseStudies content={caseStudiesContent} studies={studies} />
      <Trust content={trustContent} />
      <TechStack content={techStackContent} />
      <Testimonials content={testimonialsContent} />
      {/* The brief's EBITDA before and after. The earlier Before vs After
          (components/sections/BeforeAfter.tsx, `beforeAfterContent`) is kept
          as the fallback: swap these two lines back to restore it. */}
      <BeforeAfterEbitda content={beforeAfterEbitdaContent} />
      <Pricing content={pricingContent} />
      <Faq content={faqContent} />
    </>
  );
}
