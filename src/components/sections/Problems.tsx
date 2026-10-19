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
 * A server component. The drawings are inline SVG, computed here in isometric
 * from a few boxes and rings, and drawn in the ink so they follow the section.
 */

export type ProblemDrawing = "stack" | "funnel" | "repeat" | "portcos";
export type ProblemTone = "peach" | "blue" | "green" | "magenta";

type ProblemsProps = {
  content: {
    eyebrow: string;
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
            <p className={cn("flex items-center gap-2", label)}>
              <span aria-hidden="true" className="size-2 bg-fg-on-light" />
              {content.eyebrow}
            </p>
            <TextReveal
              as="h2"
              lines={content.headingLines}
              settings={sectionTextReveal}
              lineStagger={sectionTextReveal.lineStagger}
              className="mt-6 flex flex-col items-start gap-(--space-heading-line) text-display-lg leading-(--leading-display) tracking-(--tracking-display) font-normal"
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
  /** Fill for the top face; the sides stay the ground's white. */
  tint?: string;
  /** Drawn in outline only, dashed: the box that is not there yet, or unseen. */
  dashed?: boolean;
};

/** A box, its three visible faces filled so a later box covers an earlier one. */
function Box({ o, x, y, z, w, d, h, tint, dashed }: BoxProps) {
  const p = (a: number, b: number, c: number) => point(o, a, b, c);
  const faces = [
    // The face toward the bottom left, the one toward the bottom right, the top.
    [p(x, y + d, z), p(x + w, y + d, z), p(x + w, y + d, z + h), p(x, y + d, z + h)],
    [p(x + w, y, z), p(x + w, y + d, z), p(x + w, y + d, z + h), p(x + w, y, z + h)],
    [p(x, y, z + h), p(x + w, y, z + h), p(x + w, y + d, z + h), p(x, y + d, z + h)],
  ];

  return (
    <g strokeDasharray={dashed ? "3 3" : undefined}>
      {faces.map((face, i) => (
        <polygon
          key={i}
          points={face.join(" ")}
          fill={dashed ? "none" : i === 2 && tint ? tint : "var(--color-bg-white)"}
        />
      ))}
    </g>
  );
}

/** An isometric circle on a level plane: an ellipse √2·cos30 wide, √2/2 tall. */
function ring(o: Origin, r: number, z: number) {
  return { cx: o[0], cy: o[1] - z, rx: r * Math.SQRT2 * COS, ry: r * Math.SQRT1_2 };
}

/** A lead: a small square, in the ink or the tint. */
function Dot({ x, y, fill = "currentColor" }: { x: number; y: number; fill?: string }) {
  return <rect x={x - 3} y={y - 3} width={6} height={6} fill={fill} stroke="none" />;
}

function Drawing({ name, tone }: { name: ProblemDrawing; tone: ProblemTone }) {
  const tint = `var(--color-stat-shape-${tone})`;

  let art: ReactNode;
  switch (name) {
    // Software: three tools stacked, and a fourth on its way on top.
    case "stack": {
      const o: Origin = [120, 150];
      art = (
        <>
          {[0, 22, 44].map((z, i) => (
            <Box key={z} o={o} x={-40} y={-40} z={z} w={80} d={80} h={10} tint={i === 2 ? tint : undefined} />
          ))}
          <Box o={o} x={-40} y={-40} z={80} w={80} d={80} h={10} dashed />
        </>
      );
      break;
    }

    // Leads: a funnel, two leads falling in and through, two glancing off.
    case "funnel": {
      const o: Origin = [120, 156];
      const top = ring(o, 50, 72);
      const neck = ring(o, 10, 24);
      const foot = ring(o, 10, 0);
      art = (
        <>
          <ellipse {...top} fill="var(--color-bg-white)" />
          <ellipse cx={top.cx} cy={top.cy} rx={top.rx - 8} ry={top.ry - 4.6} fill={tint} stroke="none" />
          <path
            d={`M${top.cx - top.rx} ${top.cy} L${neck.cx - neck.rx} ${neck.cy} V${foot.cy} M${top.cx + top.rx} ${top.cy} L${neck.cx + neck.rx} ${neck.cy} V${foot.cy}`}
            fill="none"
          />
          <path
            d={`M${foot.cx - foot.rx} ${foot.cy} A${foot.rx} ${foot.ry} 0 0 0 ${foot.cx + foot.rx} ${foot.cy}`}
            fill="none"
          />
          <Dot x={112} y={14} />
          <Dot x={127} y={32} />
          <Dot x={120} y={176} />
          {/* The two that miss: off the rim and away, on a dashed line. */}
          <path d="M184 78 C 200 70, 214 100, 216 140" fill="none" strokeDasharray="3 3" />
          <Dot x={216} y={150} fill="var(--color-bg-white)" />
          <path d="M56 78 C 40 70, 28 96, 26 128" fill="none" strokeDasharray="3 3" />
          <Dot x={26} y={138} fill="var(--color-bg-white)" />
        </>
      );
      break;
    }

    // Manual work: the same job done three times, and round again.
    case "repeat": {
      const o: Origin = [120, 120];
      art = (
        <>
          <path
            d="M178 72 C 176 20, 84 4, 60 40"
            fill="none"
            strokeDasharray="3 3"
          />
          <path d="M58 30 L60 40 L70 37" fill="none" />
          {[-80, -20, 40].map((x, i) => (
            <Box key={x} o={o} x={x} y={-20} z={0} w={40} d={40} h={40} tint={i === 1 ? tint : undefined} />
          ))}
        </>
      );
      break;
    }

    // Visibility: four portcos on one floor, and only one of them in view.
    case "portcos": {
      const o: Origin = [120, 112];
      const floor = [point(o, -64, -64, 0), point(o, 64, -64, 0), point(o, 64, 64, 0), point(o, -64, 64, 0)];
      art = (
        <>
          <polygon points={floor.join(" ")} fill="none" strokeDasharray="3 3" />
          <Box o={o} x={-48} y={-48} z={0} w={36} d={36} h={44} dashed />
          <Box o={o} x={12} y={-48} z={0} w={36} d={36} h={64} tint={tint} />
          <Box o={o} x={-48} y={12} z={0} w={36} d={36} h={28} dashed />
          <Box o={o} x={12} y={12} z={0} w={36} d={36} h={52} dashed />
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
      strokeWidth={1.25}
      strokeLinejoin="round"
      strokeLinecap="round"
    >
      {art}
    </svg>
  );
}
