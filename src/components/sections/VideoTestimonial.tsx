import type { StaticImageData } from "next/image";
import { Container } from "@/components/layout/Container";
import { TextReveal } from "@/components/motion/TextReveal";
import { VideoPlayer } from "@/components/ui/VideoPlayer";
import { sectionTextRevealDynamic } from "@/config/animation";
import { cn } from "@/lib/cn";

/**
 * Video testimonial — /vsl's "Hear It From Our Clients".
 *
 * A client's video beside written word from two more, after the video-and-quote
 * testimonials on Mobbin (Grain, monday.com): the clip is the proof a reader
 * can watch, the quotes the proof they can skim. The clip is portrait — the
 * client's poster is a phone recording — so it stands in a tall frame to the
 * right rather than letterboxed across the page.
 *
 * Crossfades with the page on the dark surface, so the words are in the
 * dynamic ink.
 */

type VideoTestimonialProps = {
  content: {
    eyebrow: string;
    headingLines: readonly string[];
    subheading: string;
    video: {
      src: string;
      poster?: StaticImageData | string;
      title: string;
      /** Under the frame: who is speaking, once that is known. */
      caption: string;
    };
    quotes: readonly { quote: string; name: string; role: string }[];
  };
};

const label = "font-ui text-label tracking-(--tracking-label) uppercase";

export function VideoTestimonial({ content }: VideoTestimonialProps) {
  return (
    <section data-bg="green" className="bg-bg py-20 tablet:py-30">
      <Container className="text-ink-dynamic">
        <div className="grid gap-12 desktop:grid-cols-[7fr_5fr] desktop:items-center desktop:gap-20">
          <div>
            <p className={cn("flex items-center gap-2", label)}>
              <span aria-hidden="true" className="size-2 bg-accent" />
              {content.eyebrow}
            </p>
            <TextReveal
              as="h2"
              lines={content.headingLines}
              settings={sectionTextRevealDynamic}
              className="mt-6 flex flex-col items-start gap-(--space-heading-line) text-display-lg leading-(--leading-display) tracking-(--tracking-display) font-normal"
            />
            <p className="mt-6 max-w-[44ch] font-body text-body-md">
              {content.subheading}
            </p>

            <ul className="mt-10 border-b border-border tablet:mt-12">
              {content.quotes.map((item) => (
                <li key={item.name} className="border-t border-border py-8">
                  <figure>
                    <blockquote className="font-display text-heading-lg leading-(--leading-heading)">
                      {`“${item.quote}”`}
                    </blockquote>
                    <figcaption className="mt-5 flex flex-wrap gap-x-3 font-ui text-body-sm">
                      <span>{item.name}</span>
                      <span className="opacity-60">{item.role}</span>
                    </figcaption>
                  </figure>
                </li>
              ))}
            </ul>
          </div>

          <figure className="mx-auto w-full max-w-[420px] desktop:mx-0 desktop:justify-self-end">
            <VideoPlayer
              src={content.video.src}
              poster={content.video.poster}
              title={content.video.title}
              aspect="portrait"
            />
            <figcaption className={cn("mt-4 flex items-center gap-2", label)}>
              <span aria-hidden="true" className="size-2 bg-accent" />
              {content.video.caption}
            </figcaption>
          </figure>
        </div>
      </Container>
    </section>
  );
}
