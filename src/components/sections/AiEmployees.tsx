import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { StaggerGroup, StaggerItem } from "@/components/motion/StaggerGroup";
import { TextReveal } from "@/components/motion/TextReveal";
import { Button } from "@/components/ui/Button";
import { featureArtwork } from "@/components/ui/featureArtwork";
import { sectionTextRevealDynamic } from "@/config/animation";
import type { FeatureImage, FeatureTone, aiEmployeesContent } from "@/content/home";
import { cn } from "@/lib/cn";

/**
 * AI Employees — a bento of the roles Harmon sets up, after the owner's
 * references.
 *
 * Six tiles on a four-column grid. The first two roles take the top row at two
 * columns each, with their picture large on the right; the other three take a
 * column each below, picture small in the corner; and the sixth tile, in the
 * accent, is every role the five don't name — the section's call to action.
 * Tablet is two columns and a phone one, every tile in the small layout.
 *
 * Each tile is the same grid: roster number top left, picture top right, the
 * words across the foot. A wide tile only sets its picture and title larger,
 * so one set of markup covers both.
 *
 * The tiles paint their own fills — the dark one the Before/After panel uses,
 * and the accent — so their ink is fixed. Only the heading and the line beside
 * it sit on the page, and those follow the crossfade (`data-bg="green"`).
 */

/** Picture squares — the tech stack's tints, as How It Works uses them. */
const tints: Record<FeatureTone, string> = {
  blue: "bg-tool-blue",
  magenta: "bg-tool-magenta",
  green: "bg-tool-green",
  rose: "bg-tool-rose",
  lavender: "bg-tool-lavender",
  peach: "bg-tool-peach",
};

/**
 * The grid every tile shares; see the note above. A quarter of the desktop row
 * is about 260px, so the small tiles there go back to the phone's padding.
 */
function tile(wide: boolean) {
  return cn(
    "grid h-full w-full grid-cols-[1fr_auto] grid-rows-[auto_1fr] gap-x-6 p-6 tablet:min-h-[380px] tablet:p-8",
    !wide && "desktop:p-6",
  );
}

/** "/01" — the roster number, as How It Works numbers its steps. */
function rosterNumber(index: number) {
  return `/${String(index + 1).padStart(2, "0")}`;
}

function Picture({
  image,
  tone,
  wide = false,
}: {
  image: FeatureImage;
  tone: FeatureTone;
  wide?: boolean;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "relative col-start-2 row-start-1 size-24 overflow-clip tablet:size-28",
        wide ? "desktop:size-44" : "desktop:size-24",
        tints[tone],
      )}
    >
      <Image
        src={featureArtwork[image]}
        alt=""
        sizes={wide ? "176px" : "112px"}
        className="absolute inset-0 size-full object-cover"
      />
    </div>
  );
}

type Role = (typeof aiEmployeesContent.roles)[number];

function RoleTile({ role, index, wide }: { role: Role; index: number; wide: boolean }) {
  return (
    <article className={cn(tile(wide), "border border-fg/10 bg-bg-raised text-fg")}>
      <span className="col-start-1 row-start-1 font-ui text-body-sm">
        {rosterNumber(index)}
      </span>

      <Picture image={role.image} tone={role.tone} wide={wide} />

      <div className={cn("col-span-2 row-start-2 self-end pt-10", wide && "desktop:max-w-[44ch]")}>
        <h3
          className={cn(
            "text-heading-lg leading-(--leading-heading) font-normal",
            wide && "desktop:text-display-md",
          )}
        >
          {role.title}
        </h3>
        <p className="mt-3 font-body text-body-md">{role.body}</p>
      </div>
    </article>
  );
}

function CustomTile({ custom }: { custom: typeof aiEmployeesContent.custom }) {
  return (
    <article className={cn(tile(false), "bg-accent text-fg-on-light")}>
      <span className="col-start-1 row-start-1 font-ui text-label tracking-(--tracking-label) whitespace-nowrap uppercase">
        {custom.eyebrow}
      </span>

      <Picture image={custom.image} tone={custom.tone} />

      <div className="col-span-2 row-start-2 self-end pt-10">
        <h3 className="text-heading-lg leading-(--leading-heading) font-normal">
          {custom.title}
        </h3>
        <p className="mt-3 font-body text-body-md">{custom.body}</p>
        {/* Full width of the tile: at a quarter of the desktop row it is
            narrower than the site's 267px button. Secondary, because the
            primary's white body would sit on the accent with nothing to hold
            it apart. */}
        <Button
          href={custom.cta.href}
          variant="secondary"
          withArrow
          className="mt-6 w-full"
        >
          {custom.cta.label}
        </Button>
      </div>
    </article>
  );
}

type AiEmployeesProps = {
  content: typeof aiEmployeesContent;
};

export function AiEmployees({ content }: AiEmployeesProps) {
  return (
    <section data-bg="green" className="bg-bg py-20 tablet:py-30">
      <Container>
        <div className="flex flex-col gap-8 tablet:flex-row tablet:items-start tablet:justify-between">
          <TextReveal
            as="h2"
            lines={content.headingLines}
            settings={sectionTextRevealDynamic}
            className="flex flex-col items-start gap-(--space-heading-line) text-display-lg leading-(--leading-display) tracking-(--tracking-display) font-normal"
          />
          <p className="text-ink-dynamic max-w-[42ch] font-body text-body-md tablet:pt-2">
            {content.subheading}
          </p>
        </div>

        {/* 10 between tiles on a phone, 20 from tablet up — the case studies'
            spacing. */}
        <StaggerGroup
          as="ul"
          className="mt-15 grid grid-cols-1 gap-2.5 tablet:grid-cols-2 tablet:gap-5 desktop:grid-cols-4"
        >
          {content.roles.map((role, i) => (
            <StaggerItem
              key={role.title}
              as="li"
              className={cn("flex", i < 2 && "desktop:col-span-2")}
            >
              <RoleTile role={role} index={i} wide={i < 2} />
            </StaggerItem>
          ))}
          <StaggerItem as="li" className="flex">
            <CustomTile custom={content.custom} />
          </StaggerItem>
        </StaggerGroup>
      </Container>
    </section>
  );
}
