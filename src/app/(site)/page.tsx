import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Features } from "@/components/sections/Features";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { CaseStudies } from "@/components/sections/CaseStudies";
import { Trust } from "@/components/sections/Trust";
import { TechStack } from "@/components/sections/TechStack";
import { Testimonials } from "@/components/sections/Testimonials";
import { BeforeAfter } from "@/components/sections/BeforeAfter";
import { Pricing } from "@/components/sections/Pricing";
import { Faq } from "@/components/sections/Faq";
import { PageSurface } from "@/components/layout/PageSurface";
import { Preloader, PreloaderScript } from "@/components/motion/Preloader";
import {
  aboutContent,
  beforeAfterContent,
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
      <CaseStudies content={caseStudiesContent} studies={studies} />
      <Trust content={trustContent} />
      <TechStack content={techStackContent} />
      <Testimonials content={testimonialsContent} />
      <BeforeAfter content={beforeAfterContent} />
      <Pricing content={pricingContent} />
      <Faq content={faqContent} />
    </>
  );
}
