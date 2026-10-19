import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { TextReveal } from "@/components/motion/TextReveal";
import { ButtonArrow } from "@/components/ui/SiteIcons";
import { VideoPlayer } from "@/components/ui/VideoPlayer";
import { clientMarks } from "@/components/ui/clientMarks";
import { sectionTextRevealDynamic } from "@/config/animation";
import type { ClientMark } from "@/content/clients";
import { cn } from "@/lib/cn";

/**
 * Testimonials — /vsl's "Hear It From Our Clients".
 *
 * The owner's reference (Giga's customers section on Mobbin), in the site's
 * terms: one large card with a client's words on the left — their mark and
 * line of business, the quote, who said it and the call to book — and their
 * video filling the right half; three plain cards under it, mark, quote and
 * name. Square corners, the raised dark fill, Geist for every name and label.
 *
 * Crossfades with the page on the dark surface; the cards paint the raised
 * fill and keep fixed light ink.
 */

type Testimonial = {
  mark: ClientMark;
  category: string;
  quote: string;
  name: string;
  role: string;
};

type VideoTestimonialProps = {
  content: {
    headingLines: readonly string[];
    subheading: string;
    featured: Testimonial & {
      video: { src: string; poster?: StaticImageData | string; title: string };
    };
    items: readonly Testimonial[];
  };
  cta: { label: string; href: string };
};

const label = "font-ui text-label tracking-(--tracking-label) uppercase";

/** "George Zimny" → "GZ"; a role-only credit ("Operations Lead") the same. */
function initials(name: string) {
  return name
    .split(/\s+/)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

/** The client's mark, knocked out to white, and what they do beside it. */
function Byline({ mark, category }: { mark: ClientMark; category: string }) {
  return (
    <p className="flex items-center gap-4">
      <Image
        src={clientMarks[mark]}
        alt=""
        className="h-5 w-auto brightness-0 invert"
      />
      <span className={cn(label, "opacity-60")}>{category}</span>
    </p>
  );
}

export function VideoTestimonial({ content, cta }: VideoTestimonialProps) {
  const { featured } = content;

  return (
    <section data-bg="green" className="bg-bg py-20 tablet:py-30">
      <Container>
        <div className="text-ink-dynamic flex flex-col gap-6 tablet:flex-row tablet:items-end tablet:justify-between tablet:gap-16">
          <TextReveal
            as="h2"
            lines={content.headingLines}
            settings={sectionTextRevealDynamic}
            className="flex flex-col items-start gap-(--space-heading-line) text-display-lg leading-(--leading-display) tracking-(--tracking-display) font-normal"
          />
          <p className="max-w-[40ch] font-body text-body-md tablet:pb-1">
            {content.subheading}
          </p>
        </div>

        <figure className="mt-12 grid border border-border bg-bg-raised text-fg tablet:mt-15 desktop:grid-cols-2">
          <div className="flex flex-col p-6 tablet:p-10 desktop:p-12">
            <Byline mark={featured.mark} category={featured.category} />
            <blockquote className="mt-10 font-display text-heading-lg leading-(--leading-heading) tracking-(--tracking-display)">
              {`“${featured.quote}”`}
            </blockquote>

            <div className="mt-auto flex flex-col gap-6 pt-12 tablet:flex-row tablet:items-end tablet:justify-between">
              <figcaption className="flex items-center gap-4">
                <span
                  aria-hidden="true"
                  className="flex size-12 shrink-0 items-center justify-center bg-accent font-ui text-body-sm text-accent-fg"
                >
                  {initials(featured.name)}
                </span>
                <span className="flex flex-col font-ui">
                  <span className="text-body-md">{featured.name}</span>
                  <span className="text-body-sm opacity-60">{featured.role}</span>
                </span>
              </figcaption>
              <Link
                href={cta.href}
                className="inline-flex items-center gap-2 font-ui text-body-sm transition-colors hover:text-accent"
              >
                {cta.label}
                <ButtonArrow className="size-3" />
              </Link>
            </div>
          </div>

          {/* The video fills its half at whatever height the words give it,
              and never less than a screen's worth of face on a phone. */}
          <div className="relative min-h-[26rem]">
            <VideoPlayer
              src={featured.video.src}
              poster={featured.video.poster}
              title={featured.video.title}
              aspect="fill"
              className="absolute inset-0 h-full border-0"
            />
          </div>
        </figure>

        <ul className="mt-5 grid gap-5 tablet:grid-cols-3">
          {content.items.map((item) => (
            <li key={item.name}>
              <figure className="flex h-full flex-col border border-border bg-bg-raised p-6 text-fg tablet:p-8">
                <Byline mark={item.mark} category={item.category} />
                <blockquote className="mt-6 font-body text-body-md">
                  {`“${item.quote}”`}
                </blockquote>
                <figcaption className="mt-auto flex flex-wrap gap-x-3 pt-6 font-ui text-body-sm">
                  <span>{item.name}</span>
                  <span className="opacity-60">{item.role}</span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
