import Image from "next/image";

import ornamentLeft from "@public/uploads/icons/badge-ornament-left.svg";
import ornamentRight from "@public/uploads/icons/badge-ornament-right.svg";
import { Container } from "@/components/layout/Container";
import { TextReveal } from "@/components/motion/TextReveal";
import { sectionTextReveal } from "@/config/animation";
import type { aboutContent } from "@/content/home";

/**
 * About — the white wrapper directly below the hero.
 *
 * A kicker flanked by two ornaments and one long statement. It used to carry
 * the 3D mark under the statement; the client asked for no 3D artwork
 * anywhere, so the statement now stands alone.
 *
 * The statement is an `h2`, not an `h1`: the hero above already carries the
 * page's only `h1`, and a second would leave the document with two competing
 * top-level headings.
 */

type AboutProps = {
  content: typeof aboutContent;
};

export function About({ content }: AboutProps) {
  return (
    // `sticky` and `z-10`: it rides up over the hero it is pinned with.
    //
    // It also keeps its own fill, unlike the sections below it: pinned over the
    // hero, a transparent panel would show the hero through it the whole time
    // it is riding up. It still declares the surface, so the page background is
    // already white by the time it takes over.
    <section
      data-bg="white"
      data-bg-keep=""
      // As much below the statement as above it, now that nothing hangs
      // under it. `px-0` on a phone, `px-10` from tablet up.
      //
      // 40 a side is the desktop inset, and on a phone it was costing the
      // statement 80px of the little width there is — the site's own gutter is
      // 20 at that size, so this section was holding its words in a column
      // narrower than every other section's. The statement is eight authored
      // lines, each its own reveal block, and a line that does not fit wraps
      // inside its own block: the bars then run across two visual lines and
      // the line-by-line reveal is gone. Measured at 360, six of the eight
      // were wrapping.
      className="sticky top-0 z-10 bg-bg-white px-0 py-20 text-fg-on-light tablet:px-10"
    >
      {/* A viewport tall on desktop, where the statement is the whole screen.
          Below that it takes the height it needs: a forced 100vh holds the
          section open past its content, and centring splits the difference
          above and below into empty stretches. */}
      {/* The Container's own gutter is the inset here, and `px-0` used to be on
          this line trying to cancel it. It never did: `px-gutter` is a custom
          spacing key, the class merge does not recognise it as a padding-x
          rule, and so both survived with the gutter winning. The section was
          therefore paying its inset twice — its own 40 a side plus the
          gutter's 21 — and on a 360px phone that left the statement a 278px
          column for lines that need 298. Six of eight wrapped, and a wrapped
          line takes its reveal bars across two visual rows.

          So the doubling is gone rather than papered over: nothing here adds
          horizontal padding below tablet, and the gutter is the measure, which
          is what it is for. Above tablet the section keeps its own 40 and the
          desktop inset is what it always was. */}
        <Container className="relative flex flex-col items-center justify-center gap-10 lg:min-h-screen">
        <p className="flex items-center justify-center gap-2 text-body-md">
          <Image src={ornamentLeft} alt="" aria-hidden className="h-8 w-auto" />
          {content.eyebrow}
          <Image
            src={ornamentRight}
            alt=""
            aria-hidden
            className="h-8 w-auto"
          />
        </p>

        <TextReveal
          as="h2"
          lines={content.bodyLines}
          mobileLines={content.bodyLinesMobile}
          settings={sectionTextReveal}
          lineStagger={sectionTextReveal.lineStagger}
          className="flex flex-col items-center gap-(--space-heading-line) text-center text-display-xl leading-(--leading-display) tracking-(--tracking-display) font-normal"
        />
      </Container>
    </section>
  );
}
