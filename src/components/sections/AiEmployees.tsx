import type { CSSProperties } from "react";
import { Container } from "@/components/layout/Container";
import { TextReveal } from "@/components/motion/TextReveal";
import { Button } from "@/components/ui/Button";
import {
  featureMarquee,
  sectionTextRevealDynamic,
  statHover,
} from "@/config/animation";
import type { TrustTone, aiEmployeesContent } from "@/content/home";
import { cn } from "@/lib/cn";
import { hoverRectBox, hoverRectFrom } from "@/lib/hoverRect";

/**
 * AI Employees — a ticker of the roles Harmon sets up.
 *
 * Two rows of badges travelling in opposite directions, full bleed, on the
 * dark green. Each badge is a role: its department and roster number across
 * the head, its title and one line of what it does at the foot.
 *
 * Built from parts the site already has: the feature strip's marquee (set
 * rendered more than once, track slid by exactly one copy), the statistics'
 * four tints and the blocks that slide into them on hover. A row stops while
 * the pointer is over it, so a badge can be read — and its blocks land on a
 * badge that is still there.
 *
 * The section crossfades with the page (`data-bg="green"`, no keep), so the
 * heading uses the dynamic reveal and the copy on the page the dynamic ink.
 * Inside a badge the ink is fixed: its own fill never changes.
 *
 * A server component: the marquee is CSS, and the heading declares its own
 * client boundary.
 */

/** Fills come from theme.css; the section never names a colour itself. */
const tones: Record<TrustTone, string> = {
  peach: "bg-stat-peach",
  green: "bg-stat-green",
  blue: "bg-stat-blue",
  magenta: "bg-stat-magenta",
};

/**
 * Badge geometry, in px, matching the `w-[360px]` and `gap-5` below. The
 * travel is derived from these rather than measured, so the markup is the
 * same on the server and the client and the rows move from the first frame.
 */
const BADGE_WIDTH = 360;
const BADGE_GAP = 20;

/**
 * How many times each row's set is laid down. One lap is one copy; the rest
 * are there so the row still reaches the far edge at the end of a lap on a
 * screen wider than a single copy (five badges are 1900px).
 */
const COPIES = 3;

type Role = (typeof aiEmployeesContent.roles)[number];

/** "/01" — the roster number, as How It Works numbers its steps. */
function rosterNumber(index: number) {
  return `/${String(index + 1).padStart(2, "0")}`;
}

function Badge({ role, index }: { role: Role; index: number }) {
  return (
    <article
      style={
        {
          "--mh-stat-shape": `var(--color-stat-shape-${role.tone})`,
          "--mh-stat-duration": `${statHover.duration}ms`,
        } as CSSProperties
      }
      className={cn(
        "group relative flex h-[220px] w-[360px] shrink-0 flex-col overflow-clip p-6 text-fg-on-light",
        tones[role.tone],
      )}
    >
      {/* Decorative: the statistics' hover blocks, each tint its own
          arrangement. Behind the words, so a block passes under them. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        {statHover.rects[role.tone].map((rect, r) => (
          <span
            key={r}
            className="mh-stat-block"
            style={
              {
                ...hoverRectBox(rect),
                "--mh-stat-from": hoverRectFrom(rect),
              } as CSSProperties
            }
          />
        ))}
      </div>

      <div className="relative flex h-full flex-col">
        <div className="flex items-center justify-between font-ui text-label tracking-(--tracking-label) uppercase">
          <span>{role.department}</span>
          <span>{rosterNumber(index)}</span>
        </div>

        <div className="mt-auto">
          <h3 className="text-heading-lg leading-(--leading-heading) font-normal">
            {role.title}
          </h3>
          <p className="mt-2 font-body text-body-sm text-fg-on-light-muted">
            {role.body}
          </p>
        </div>
      </div>
    </article>
  );
}

type AiEmployeesProps = {
  content: typeof aiEmployeesContent;
};

export function AiEmployees({ content }: AiEmployeesProps) {
  // First half on top, second half underneath; the roster number stays the
  // role's place in the full list.
  const half = Math.ceil(content.roles.length / 2);
  const rows = [
    content.roles.slice(0, half).map((role, i) => ({ role, index: i })),
    content.roles.slice(half).map((role, i) => ({ role, index: half + i })),
  ];

  return (
    <section data-bg="green" className="bg-bg py-20 tablet:py-30">
      <Container className="flex flex-col items-center text-center">
        <TextReveal
          as="h2"
          lines={content.headingLines}
          settings={sectionTextRevealDynamic}
          lineStagger={sectionTextRevealDynamic.lineStagger}
          className="flex flex-col items-center gap-(--space-heading-line) text-center text-display-lg leading-(--leading-display) tracking-(--tracking-display) font-normal"
        />
        <p className="text-ink-dynamic mt-6 max-w-[56ch] font-body text-body-md">
          {content.subheading}
        </p>
      </Container>

      {/* Full bleed, outside the container's gutter. The second row runs the
          same keyframes backwards. */}
      <div className="mt-10 flex flex-col gap-5 tablet:mt-15">
        {rows.map((row, r) => {
          const cycle = row.length * (BADGE_WIDTH + BADGE_GAP);
          const duration = Math.round((cycle / featureMarquee.speed) * 1000);

          return (
            <div
              key={r}
              className="mh-marquee-frame no-scrollbar w-full overflow-hidden"
            >
              <div
                className={cn(
                  "mh-marquee mh-marquee-pause flex w-max items-center gap-5",
                  r % 2 === 1 && "mh-marquee-reverse",
                )}
                style={
                  {
                    "--mh-marquee-cycle": `${cycle}px`,
                    "--mh-marquee-duration": `${duration}ms`,
                  } as CSSProperties
                }
              >
                {Array.from({ length: COPIES }, (_, copy) => (
                  // Every copy after the first is the same badges again, there
                  // only to make the loop seamless, so it is hidden from
                  // assistive tech — the roster is announced once.
                  <ul
                    key={copy}
                    aria-hidden={copy > 0 ? true : undefined}
                    className="flex items-center gap-5"
                  >
                    {row.map(({ role, index }) => (
                      <li key={role.title}>
                        <Badge role={role} index={index} />
                      </li>
                    ))}
                  </ul>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <Container className="mt-10 flex justify-center tablet:mt-15">
        <Button
          href={content.cta.href}
          withArrow
          className="w-full tablet:w-[267px]"
        >
          {content.cta.label}
        </Button>
      </Container>
    </section>
  );
}
