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
 * terms: one large card with a client's words on the left — their mark, the
 * quote, who said it and the call to book — and their video filling the right
 * half; three cards under it, mark, quote and who said it. Every card its own
 * colour, from the testimonial family, chosen in content (`tone`).
 *
 * The heading and its line are centred over the cards, as How It Works sets
 * its own, each on one line from tablet up. The section crossfades with the page on the dark surface, so those
 * are in the dynamic ink; the cards keep fixed dark ink on their tints.
 */

export type QuoteTone = "blue" | "green" | "yellow" | "lavender";

type Testimonial = {
  mark: ClientMark;
  tone: QuoteTone;
  quote: string;
  name: string;
  role: string;
};

type VideoTestimonialProps = {
  content: {
    headingLines: readonly string[];
    /** The heading as a phone breaks it, where one line will not fit. */
    headingLinesMobile?: readonly string[];
    subheading: string;
    featured: Testimonial & {
      video: { src: string; poster?: StaticImageData | string; title: string };
    };
    items: readonly Testimonial[];
  };
  cta: { label: string; href: string };
};

/** Fills come from theme.css; the section never names a colour itself. */
const tints: Record<QuoteTone, string> = {
  blue: "bg-quote-blue",
  green: "bg-quote-green",
  yellow: "bg-quote-yellow",
  lavender: "bg-quote-lavender",
};

/** "George Zimny" → "GZ"; a role-only credit ("Operations Lead") the same. */
function initials(name: string) {
  return name
    .split(/\s+/)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

/** Who said it: the name over the company, both in Geist. */
function Credit({ name, role }: { name: string; role: string }) {
  return (
    <span className="flex flex-col gap-1 font-ui">
      <span className="text-body-md">{name}</span>
      <span className="text-body-sm text-fg-on-light-muted">{role}</span>
    </span>
  );
}

export function VideoTestimonial({ content, cta }: VideoTestimonialProps) {
  const { featured } = content;

  return (
    <section data-bg="green" className="bg-bg py-20 tablet:py-30">
      <Container>
        <TextReveal
          as="h2"
          lines={content.headingLines}
          mobileLines={content.headingLinesMobile}
          settings={sectionTextRevealDynamic}
          className="flex flex-col items-center gap-(--space-heading-line) text-center text-display-lg leading-(--leading-display) tracking-(--tracking-display) font-normal"
        />
        <p className="text-ink-dynamic mt-6 text-center font-body text-body-md">
          {content.subheading}
        </p>

        <figure
          className={cn(
            "mt-12 grid text-fg-on-light tablet:mt-15 desktop:grid-cols-2",
            tints[featured.tone],
          )}
        >
          <div className="flex flex-col p-6 tablet:p-10 desktop:p-12">
            <Image src={clientMarks[featured.mark]} alt="" className="h-5 w-auto self-start" />
            <blockquote className="mt-10 font-display text-heading-lg leading-(--leading-heading) tracking-(--tracking-display)">
              {`“${featured.quote}”`}
            </blockquote>

            <div className="mt-auto flex flex-col gap-6 pt-12 tablet:flex-row tablet:items-end tablet:justify-between">
              <figcaption className="flex items-center gap-4">
                <span
                  aria-hidden="true"
                  className="flex size-12 shrink-0 items-center justify-center bg-bg font-ui text-body-sm text-fg"
                >
                  {initials(featured.name)}
                </span>
                <Credit name={featured.name} role={featured.role} />
              </figcaption>
              <Link
                href={cta.href}
                className="inline-flex items-center gap-2 font-ui text-body-sm transition-opacity hover:opacity-60"
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
              className="absolute inset-0 h-full"
            />
          </div>
        </figure>

        {/* 10 between the cards, every way, per the owner. */}
        <ul className="mt-2.5 grid gap-2.5 tablet:grid-cols-3">
          {content.items.map((item) => (
            <li key={item.name}>
              <figure
                className={cn(
                  "flex h-full flex-col p-6 text-fg-on-light tablet:p-8",
                  tints[item.tone],
                )}
              >
                <Image src={clientMarks[item.mark]} alt="" className="h-5 w-auto self-start" />
                <blockquote className="mt-6 font-body text-body-md">
                  {`“${item.quote}”`}
                </blockquote>
                <figcaption className="mt-auto pt-8">
                  <Credit name={item.name} role={item.role} />
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
