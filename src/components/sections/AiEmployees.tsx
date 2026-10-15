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
 * Every role tile is the same: the words at the foot and its 3D picture loose
 * in the top-right corner — no tint behind it, set large and pushed past the
 * tile's edges so the tile crops it, which is what gives the picture its
 * depth. The picture is sized to fill the space above the words rather than
 * leave a band of empty tile. The strip is a heading and a button, on one line
 * from tablet up.
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
  "tablet:col-span-2",
  "",
  // The tall tile, down the left of the lower two rows.
  "desktop:row-span-2",
  "",
  "",
];

/**
 * Picture size and how far it is pushed past the corner — about a quarter of
 * its size, enough to clear the transparent margin the artwork carries and
 * crop into the shape itself. The wide tile's and the tall one's are the
 * largest; the tall one only from desktop, where it is tall.
 */
const pictures = {
  wide: "size-52 -top-11 -right-11 tablet:size-80 tablet:-top-16 tablet:-right-16 desktop:size-90 desktop:-top-18 desktop:-right-18",
  tall: "size-52 -top-11 -right-11 tablet:size-64 tablet:-top-14 tablet:-right-14 desktop:size-96 desktop:-top-20 desktop:-right-20",
  narrow:
    "size-52 -top-11 -right-11 tablet:size-64 tablet:-top-14 tablet:-right-14",
} as const;

/** The light tile every role and the strip share. */
const tile = "relative overflow-clip bg-bg-light p-6 text-fg-on-light tablet:p-8";

type Role = (typeof aiEmployeesContent.roles)[number];

function RoleTile({ role, index }: { role: Role; index: number }) {
  const shape = index === 0 ? "wide" : index === 2 ? "tall" : "narrow";

  return (
    <article
      className={cn(tile, "flex min-h-[340px] w-full flex-col tablet:min-h-[360px]")}
    >
      <Image
        src={featureArtwork[role.image]}
        alt=""
        aria-hidden="true"
        sizes={shape === "narrow" ? "256px" : "384px"}
        className={cn(
          "pointer-events-none absolute object-contain",
          pictures[shape],
        )}
      />

      {/* `relative`: above the picture, should a long title reach under it. */}
      <div className={cn("relative mt-auto pt-10", shape === "wide" && "tablet:max-w-[44ch]")}>
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
          <p className="text-ink-dynamic max-w-[42ch] font-body text-body-md tablet:pt-2">
            {content.subheading}
          </p>
        </div>

        {/* 6 between tiles at every size, per the owner: tight enough that
            the tiles read as one block rather than six cards. */}
        <StaggerGroup
          as="ul"
          className="mt-15 grid grid-cols-1 gap-1.5 tablet:grid-cols-2 desktop:grid-cols-3"
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
