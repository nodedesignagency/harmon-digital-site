import type { CSSProperties, ReactNode } from "react";
import { Container } from "@/components/layout/Container";
import { TextReveal } from "@/components/motion/TextReveal";
import { sectionTextReveal } from "@/config/animation";
import { cn } from "@/lib/cn";

/**
 * Problems — /vsl's "Sound Familiar?", the four things a portco is paying for.
 *
 * A heading over a ruled grid of four cells, after Heron AI's problem grid on
 * Mobbin: each cell a small label with its number, a line drawing on a faint
 * grid, and the problem in a sentence with a line under it. Hairlines rather
 * than cards, so the four read as one sheet.
 *
 * On /vsl it rides up over the pinned opening, so it keeps its own white fill
 * and the fixed light reveal (see AGENTS.md, "A section that paints itself
 * needs fixed ink"), and it marks itself as where the header turns light. The
 * page puts those attributes on it; this stays a plain section otherwise.
 *
 * A server component. The drawings are inline SVG, built here in isometric from
 * one primitive — a box — lit from the upper left: the top face in the ground
 * colour or the cell's tint, the face toward the reader a step darker, the
 * face to the right a step darker again, and a soft footprint on the floor.
 * One idea per drawing, one tint per drawing, and dashed outline only ever
 * for the thing that is missing.
 */

export type ProblemDrawing = "stack" | "conveyor" | "systems" | "portcos";
export type ProblemTone = "peach" | "blue" | "green" | "magenta";

type ProblemsProps = {
  content: {
    headingLines: readonly string[];
    subheading: string;
    items: readonly {
      tag: string;
      title: string;
      body: string;
      drawing: ProblemDrawing;
      tone: ProblemTone;
    }[];
  };
  className?: string;
} & Record<`data-${string}`, string>;

/** Each cell's marker square, and the face of its drawing that takes the tint. */
const swatches: Record<ProblemTone, string> = {
  peach: "bg-stat-shape-peach",
  blue: "bg-stat-shape-blue",
  green: "bg-stat-shape-green",
  magenta: "bg-stat-shape-magenta",
};

const label = "font-ui text-label tracking-(--tracking-label) uppercase";

export function Problems({ content, className, ...attributes }: ProblemsProps) {
  return (
    <section
      {...attributes}
      className={cn("bg-bg-white py-20 text-fg-on-light tablet:py-25", className)}
    >
      <Container>
        <div className="flex flex-col gap-6 desktop:flex-row desktop:items-end desktop:justify-between desktop:gap-16">
          <div>
            <TextReveal
              as="h2"
              lines={content.headingLines}
              settings={sectionTextReveal}
              lineStagger={sectionTextReveal.lineStagger}
              className="flex flex-col items-start gap-(--space-heading-line) text-display-lg leading-(--leading-display) tracking-(--tracking-display) font-normal"
            />
          </div>
          <p className="max-w-[40ch] font-body text-body-md desktop:pb-1">
            {content.subheading}
          </p>
        </div>

        {/* The sheet: every cell draws its right and bottom rule, and the list
            the top and left, so the lines are single wherever the grid wraps. */}
        <ul className="mt-12 grid border-t border-l border-border-on-light tablet:mt-15 tablet:grid-cols-2 desktop:grid-cols-4">
          {content.items.map((item, i) => (
            <li
              key={item.tag}
              className="flex flex-col border-r border-b border-border-on-light"
            >
              <div className={cn("flex items-center justify-between px-5 py-4", label)}>
                <span className="flex items-center gap-2">
                  <span aria-hidden="true" className={cn("size-2", swatches[item.tone])} />
                  {item.tag}
                </span>
                <span className="text-fg-label">{`[${String(i + 1).padStart(2, "0")}]`}</span>
              </div>

              <Plate>
                <Drawing name={item.drawing} tone={item.tone} />
              </Plate>

              <div className="flex flex-1 flex-col gap-3 border-t border-border-on-light px-5 pt-6 pb-8">
                <h3 className="font-display text-heading-lg leading-(--leading-heading) tracking-(--tracking-display) font-normal">
                  {item.title}
                </h3>
                <p className="font-body text-body-sm text-fg-on-light-muted">
                  {item.body}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

/**
 * The drawing's ground: a faint 20px grid with a cross at each corner, as a
 * drafting sheet has.
 */
function Plate({ children }: { children: ReactNode }) {
  const grid: CSSProperties = {
    backgroundImage:
      "linear-gradient(var(--color-border-on-light) 1px, transparent 1px), linear-gradient(90deg, var(--color-border-on-light) 1px, transparent 1px)",
    backgroundSize: "20px 20px",
    backgroundPosition: "-1px -1px",
  };
  const corners = ["top-3 left-3", "top-3 right-3", "bottom-3 left-3", "bottom-3 right-3"];

  return (
    <div className="relative border-t border-border-on-light">
      <div aria-hidden="true" className="absolute inset-0 opacity-50" style={grid} />
      {corners.map((corner) => (
        <span
          key={corner}
          aria-hidden="true"
          className={cn("absolute size-2.5", corner)}
        >
          <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-fg-on-light/40" />
          <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-fg-on-light/40" />
        </span>
      ))}
      <div className="relative px-6 py-8">{children}</div>
    </div>
  );
}

/* ---------------------------------------------------------------------------
 * The drawings. Isometric: x runs down to the right, y down to the left, z up.
 * ------------------------------------------------------------------------- */

const COS = Math.cos(Math.PI / 6);
const INK = "var(--color-fg-on-light)";
const WHITE = "var(--color-bg-white)";

/** A face's fill: the base colour with this much of the ink mixed in. */
function shade(base: string, ink: number) {
  return ink === 0 ? base : `color-mix(in srgb, ${INK} ${ink}%, ${base})`;
}

type Origin = readonly [number, number];

function point(o: Origin, x: number, y: number, z: number) {
  return `${(o[0] + (x - y) * COS).toFixed(1)},${(o[1] + (x + y) / 2 - z).toFixed(1)}`;
}

type BoxProps = {
  o: Origin;
  x: number;
  y: number;
  z: number;
  w: number;
  d: number;
  h: number;
  /** The box's colour; white when unset. Its sides are this, shaded. */
  fill?: string;
  /** Outline only, dashed: the box that is missing. */
  ghost?: boolean;
  /** Heights at which a rule runs round the two front faces — rack slots. */
  rules?: readonly number[];
};

/**
 * A box: the face toward the reader, the face to the right, then the top, so
 * each covers what it should, and a later box covers an earlier one.
 */
function Box({ o, x, y, z, w, d, h, fill = WHITE, ghost, rules = [] }: BoxProps) {
  const p = (a: number, b: number, c: number) => point(o, a, b, c);
  const faces = [
    { pts: [p(x, y + d, z), p(x + w, y + d, z), p(x + w, y + d, z + h), p(x, y + d, z + h)], ink: 7 },
    { pts: [p(x + w, y, z), p(x + w, y + d, z), p(x + w, y + d, z + h), p(x + w, y, z + h)], ink: 16 },
    { pts: [p(x, y, z + h), p(x + w, y, z + h), p(x + w, y + d, z + h), p(x, y + d, z + h)], ink: 0 },
  ];

  if (ghost) {
    return (
      <g strokeDasharray="2.5 3" opacity={0.7}>
        {faces.map((face, i) => (
          <polygon key={i} points={face.pts.join(" ")} fill="none" />
        ))}
      </g>
    );
  }

  return (
    <g>
      {faces.map((face, i) => (
        <polygon key={i} points={face.pts.join(" ")} fill={shade(fill, face.ink)} />
      ))}
      {rules.map((r) => (
        <polyline
          key={r}
          points={[p(x, y + d, z + r), p(x + w, y + d, z + r), p(x + w, y, z + r)].join(" ")}
          fill="none"
          strokeOpacity={0.45}
        />
      ))}
    </g>
  );
}

/** The soft footprint a box leaves on the floor, cast down and to the right. */
function Shadow({ o, x, y, w, d }: { o: Origin; x: number; y: number; w: number; d: number }) {
  const s = 7;
  const pts = [point(o, x + s, y, 0), point(o, x + w + s, y, 0), point(o, x + w + s, y + d, 0), point(o, x + s, y + d, 0)];
  return <polygon points={pts.join(" ")} fill={shade(WHITE, 8)} stroke="none" />;
}

/** Small squares laid flat on a top face: a window's controls, a tool's badge. */
function Pips({ o, x, y, z, n, tint }: { o: Origin; x: number; y: number; z: number; n: number; tint: string }) {
  return (
    <>
      {Array.from({ length: n }, (_, i) => {
        const px = x + i * 8;
        const pts = [point(o, px, y, z), point(o, px + 5, y, z), point(o, px + 5, y + 5, z), point(o, px, y + 5, z)];
        return <polygon key={i} points={pts.join(" ")} fill={i === 0 ? tint : WHITE} />;
      })}
    </>
  );
}

function Drawing({ name, tone }: { name: ProblemDrawing; tone: ProblemTone }) {
  const tint = `var(--color-stat-shape-${tone})`;

  let art: ReactNode;
  switch (name) {
    // Software: tool on tool, and one more on its way down onto the pile.
    case "stack": {
      const o: Origin = [120, 150];
      art = (
        <>
          <Shadow o={o} x={-40} y={-40} w={80} d={80} />
          {[0, 16, 32].map((z, i) => (
            <Box key={z} o={o} x={-40} y={-40} z={z} w={80} d={80} h={10} fill={i === 2 ? tint : WHITE} />
          ))}
          <Pips o={o} x={-32} y={-33} z={42} n={3} tint={WHITE} />
          <Box o={o} x={-40} y={-40} z={62} w={80} d={80} h={10} ghost />
        </>
      );
      break;
    }

    // Leads: a line of them carried along, and the one that fell off the end.
    case "conveyor": {
      const o: Origin = [126, 124];
      const legs = [-80, 34].flatMap((x) => [-12, 6].map((y) => ({ x, y })));
      art = (
        <>
          <Shadow o={o} x={-84} y={-14} w={128} d={28} />
          {legs.map((leg) => (
            <Box key={`${leg.x}${leg.y}`} o={o} x={leg.x} y={leg.y} z={0} w={6} d={6} h={24} />
          ))}
          <Box o={o} x={-84} y={-14} z={24} w={128} d={28} h={8} rules={[4]} />
          {[-76, -48, -20].map((x) => (
            <Box key={x} o={o} x={x} y={-8} z={32} w={16} d={16} h={16} fill={tint} />
          ))}
          <Box o={o} x={62} y={-8} z={0} w={16} d={16} h={16} ghost />
        </>
      );
      break;
    }

    // Manual work: two systems, and the same record carried between them.
    case "systems": {
      const o: Origin = [117, 130];
      const rack = { y: -15, z: 0, w: 30, d: 30, h: 56, rules: [14, 28, 42] };
      art = (
        <>
          <Shadow o={o} x={-88} y={-15} w={30} d={30} />
          <Shadow o={o} x={64} y={-15} w={30} d={30} />
          <Box o={o} x={-88} {...rack} />
          {[-46, -22, 2, 26].map((x) => (
            <Box key={x} o={o} x={x} y={-6} z={0} w={12} d={12} h={12} fill={tint} />
          ))}
          <Box o={o} x={64} {...rack} />
        </>
      );
      break;
    }

    // Visibility: four portcos on one board, and only one of them in view.
    case "portcos": {
      const o: Origin = [120, 116];
      art = (
        <>
          <Shadow o={o} x={-64} y={-64} w={128} d={128} />
          <Box o={o} x={-64} y={-64} z={0} w={128} d={128} h={5} />
          <Box o={o} x={-48} y={-48} z={5} w={36} d={36} h={44} ghost />
          <Box o={o} x={12} y={-48} z={5} w={36} d={36} h={64} fill={tint} rules={[16, 32, 48]} />
          <Box o={o} x={-48} y={12} z={5} w={36} d={36} h={28} ghost />
          <Box o={o} x={12} y={12} z={5} w={36} d={36} h={52} ghost />
        </>
      );
      break;
    }
  }

  return (
    <svg
      viewBox="0 0 240 200"
      aria-hidden="true"
      className="mx-auto block h-auto w-full max-w-[240px]"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.1}
      strokeLinejoin="round"
      strokeLinecap="round"
    >
      {art}
    </svg>
  );
}
