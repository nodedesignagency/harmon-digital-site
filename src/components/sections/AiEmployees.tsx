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
 * On desktop, six columns:
 *
 *   | 01 · · · · · | 02 · · · · · |
 *   | 03 · | 04 · · | 05 · · · · |
 *   | 03 · | call to action · · · |
 *
 * two tiles of equal width on top; below, a tall tile down the left with two
 * tiles beside it and a slim call-to-action strip under those. Tablet is two
 * columns, the fifth tile and the strip running the full width; a phone
 * stacks them.
 *
 * The two rows carry their pictures differently, as the owner's reference
 * does. On top, the 3D picture sits loose in the top-right corner — no tint
 * behind it, set large and pushed past the tile's edges so the tile crops it,
 * which is what gives it depth. Below, the picture stands whole in the
 * top-left corner, above the words. The words are at the foot of every tile.
 * The strip is a heading and a button, on one line from tablet up.
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
  "desktop:col-span-3",
  "desktop:col-span-3",
  // The tall tile, down the left of the lower two rows.
  "desktop:col-span-2 desktop:row-span-2",
  "desktop:col-span-2",
  // Alone on its row on tablet, so it takes the row.
  "tablet:col-span-2 desktop:col-span-2",
];

/** How many of the roles take the top row. */
const TOP = 2;

/**
 * The top row's picture: its size, and how far it is pushed past the corner —
 * about a fifth of its size, enough to clear the transparent margin the
 * artwork carries and crop into the drawing itself.
 */
const cornerPicture =
  "absolute size-52 -top-11 -right-11 tablet:size-64 tablet:-top-14 tablet:-right-14 desktop:size-72 desktop:-top-14 desktop:-right-14";

/**
 * The lower row's: whole, in the top-left corner. Nudged up and left by about
 * the artwork's transparent margin, so the drawing lines up with the words
 * rather than sitting inset from them.
 */
const standingPicture = "relative -mt-2 -ml-2 size-32 tablet:size-36 desktop:size-40";

/** The light tile every role and the strip share. */
const tile = "relative overflow-clip bg-bg-light p-6 text-fg-on-light tablet:p-8";

type Role = (typeof aiEmployeesContent.roles)[number];

function RoleTile({ role, index }: { role: Role; index: number }) {
  const top = index < TOP;

  return (
    <article
      className={cn(tile, "flex min-h-[340px] w-full flex-col tablet:min-h-[360px]")}
    >
      <Image
        src={featureArtwork[role.image]}
        alt=""
        aria-hidden="true"
        sizes={top ? "288px" : "160px"}
        className={cn(
          "pointer-events-none object-contain",
          top ? cornerPicture : standingPicture,
        )}
      />

      {/* `relative`: above the picture, should a long title reach under it. */}
      <div className={cn("relative mt-auto pt-10", top && "tablet:max-w-[44ch]")}>
        <h3 className="text-heading-lg leading-(--leading-heading) font-normal">
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
          {/* The small size, and level with the heading's foot from tablet up,
              so the line reads as a caption to the heading rather than a block
              running on below it. */}
          <p className="text-ink-dynamic max-w-[48ch] font-body text-body-sm tablet:self-end">
            {content.subheading}
          </p>
        </div>

        {/* 6 between tiles at every size, per the owner: tight enough that
            the tiles read as one block rather than six cards. */}
        <StaggerGroup
          as="ul"
          className="mt-15 grid grid-cols-1 gap-1.5 tablet:grid-cols-2 desktop:grid-cols-6"
        >
          {content.roles.map((role, i) => (
            <StaggerItem key={role.title} as="li" className={cn("flex", placements[i])}>
              <RoleTile role={role} index={i} />
            </StaggerItem>
          ))}

          {/* The strip: under the two tiles beside the tall one. */}
          <StaggerItem
            as="li"
            className="flex tablet:col-span-2 desktop:col-span-4 desktop:col-start-3"
          >
            <div
              className={cn(
                tile,
                "flex w-full flex-col gap-6 tablet:flex-row tablet:items-center tablet:justify-between tablet:py-6",
              )}
            >
              {/* One line from tablet up, which is what keeps the strip slim:
                  at the tiles' heading size it fits beside the 267px button
                  with room to spare. */}
              <h3 className="text-heading-lg leading-(--leading-heading) font-normal tablet:whitespace-nowrap">
                {content.custom.title}
              </h3>
              {/* `plan`: the dark body with the white arrow box, drawn for a
                  light card. The primary's white body would vanish here.
                  240 rather than the site's 267, per the owner: at full width
                  it crowded the heading on the one line they share. */}
              <Button
                href={content.custom.cta.href}
                variant="plan"
                withArrow
                className="w-full shrink-0 tablet:w-[240px]"
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
