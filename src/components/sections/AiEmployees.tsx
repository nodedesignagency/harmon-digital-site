import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { StaggerGroup, StaggerItem } from "@/components/motion/StaggerGroup";
import { TextReveal } from "@/components/motion/TextReveal";
import { Button } from "@/components/ui/Button";
import { featureArtwork } from "@/components/ui/featureArtwork";
import { sectionTextRevealDynamic } from "@/config/animation";
import type { aiEmployeesContent } from "@/content/home";
import { cn } from "@/lib/cn";

/**
 * AI Employees — a bento of the roles Harmon sets up, after the owner's
 * reference (a five-tile bento, taken as the base and extended to six).
 *
 * On desktop, three columns:
 *
 *   | 01 · · · · · · | 02 · · |
 *   | 03 · | 04 · · | 05 · · |
 *   | 03 · | call to action · |
 *
 * a wide tile and a narrow one on top; below, a tall tile down the left with
 * two tiles beside it and a slim call-to-action strip under those. Tablet is
 * two columns, the first tile and the strip running the full width; a phone
 * stacks them.
 *
 * Every role tile is the same: roster number top left, the words at the foot,
 * and its 3D picture loose in the top-right corner — no tint behind it, set
 * large and pushed past the tile's edges so the tile crops it, which is what
 * gives the picture its depth. The strip is a heading and a button.
 *
 * The tiles paint their own light fill, so their ink is fixed. Only the
 * heading and the line beside it sit on the page, and those follow the
 * crossfade (`data-bg="green"`).
 */

/**
 * Where each role sits on the desktop grid, by its position in content. Written
 * out because Tailwind only generates classes it can read in the source.
 */
const placements = [
  // The wide tile: full width on tablet too.
  "tablet:col-span-2 desktop:min-h-[420px]",
  "desktop:min-h-[420px]",
  // The tall tile, down the left of the lower two rows.
  "desktop:row-span-2",
  "desktop:min-h-[390px]",
  "desktop:min-h-[390px]",
];

/**
 * Picture size and how far it is pushed past the corner — about a quarter of
 * its size, enough to clear the transparent margin the artwork carries and
 * crop into the shape itself. The wide tile's and the tall one's are the
 * largest; the tall one only from desktop, where it is tall.
 */
const pictures = {
  wide: "size-48 -top-10 -right-10 tablet:size-72 tablet:-top-16 tablet:-right-16 desktop:size-80 desktop:-top-18 desktop:-right-18",
  tall: "size-48 -top-10 -right-10 tablet:size-56 tablet:-top-13 tablet:-right-13 desktop:size-80 desktop:-top-18 desktop:-right-18",
  narrow:
    "size-48 -top-10 -right-10 tablet:size-56 tablet:-top-13 tablet:-right-13",
} as const;

/** "/01" — the roster number, as How It Works numbers its steps. */
function rosterNumber(index: number) {
  return `/${String(index + 1).padStart(2, "0")}`;
}

/** The light tile every role and the strip share. */
const tile = "relative overflow-clip bg-bg-light p-6 text-fg-on-light tablet:p-8";

type Role = (typeof aiEmployeesContent.roles)[number];

function RoleTile({ role, index }: { role: Role; index: number }) {
  const shape = index === 0 ? "wide" : index === 2 ? "tall" : "narrow";

  return (
    <article
      className={cn(tile, "flex min-h-[340px] w-full flex-col tablet:min-h-[380px]")}
    >
      <Image
        src={featureArtwork[role.image]}
        alt=""
        aria-hidden="true"
        sizes={shape === "narrow" ? "224px" : "320px"}
        className={cn(
          "pointer-events-none absolute object-contain",
          pictures[shape],
        )}
      />

      {/* Above the picture, should a long title ever reach under it. */}
      <span className="relative font-ui text-body-sm">{rosterNumber(index)}</span>

      <div className={cn("relative mt-auto pt-10", shape === "wide" && "tablet:max-w-[44ch]")}>
        <h3 className="text-display-md leading-(--leading-heading) font-normal">
          {role.title}
        </h3>
        <p className="mt-3 font-body text-body-md text-fg-on-light-muted">
          {role.body}
        </p>
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
          className="mt-15 grid grid-cols-1 gap-2.5 tablet:grid-cols-2 tablet:gap-5 desktop:grid-cols-3"
        >
          {content.roles.map((role, i) => (
            <StaggerItem key={role.title} as="li" className={cn("flex", placements[i])}>
              <RoleTile role={role} index={i} />
            </StaggerItem>
          ))}

          {/* The strip: under the two tiles beside the tall one. */}
          <StaggerItem as="li" className="flex tablet:col-span-2 desktop:col-start-2">
            <div
              className={cn(
                tile,
                "flex w-full flex-col gap-6 tablet:flex-row tablet:items-center tablet:justify-between",
              )}
            >
              <h3 className="text-display-md leading-(--leading-heading) font-normal">
                {content.custom.title}
              </h3>
              {/* `plan`: the dark body with the white arrow box, drawn for a
                  light card. The primary's white body would vanish here. */}
              <Button
                href={content.custom.cta.href}
                variant="plan"
                withArrow
                className="w-full shrink-0 tablet:w-[267px]"
              >
                {content.custom.cta.label}
              </Button>
            </div>
          </StaggerItem>
        </StaggerGroup>
      </Container>
    </section>
  );
}
