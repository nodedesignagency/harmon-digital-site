import type { ReactNode } from "react";
import {
  AppWindow,
  CreditCard,
  Mail,
  MessageSquare,
  Package,
  Phone,
  Receipt,
  Repeat,
  Rocket,
  Route,
  Search,
  Send,
  TrendingUp,
  Truck,
  UserRound,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import type { FeatureTone } from "@/content/home";
import { screens, type ScreenName, type ScreenStatus } from "@/content/screens";
import { cn } from "@/lib/cn";

/**
 * A small product screen, drawn — what stands in a card, a step or a role where
 * the 3D pictures used to.
 *
 * After the client's reference, Retool's site before its redesign, and the
 * schematic cards Attio and Retool draw on Mobbin: a little of a real screen,
 * simplified until it reads at a glance. Built in this site's own terms, the
 * portfolio dashboard files' rather than an app's: one white sheet, square
 * corners, hairlines and no shadow; a label in Geist small capitals beside a
 * line icon for what the screen is; statuses as a tinted square and a word,
 * never a pill; figures in Geist; grey bars where a real screen would have
 * text no one needs to read.
 *
 * The header carries an icon, in the ink, rather than a square in the tint.
 * It used to be a square, and a square in the same tint as the statuses and
 * bars below it read as one more of them — the title looked like a status.
 * So squares mean one thing on these screens: a status. Dashed construction lines run off the sheet's edges and a
 * small square marks each corner — the drafting marks the Partners panels and
 * the VSL drawings carry — so it reads as a drawing of software, not a
 * screenshot of it.
 *
 * One tint per screen (`tone`, the card's or step's own): the `tool-shape`
 * step for marks and bars, the `tool` step for a selected row, and the ink for
 * the one thing that matters most. Every word is in `content/screens.ts`.
 *
 * Inline SVG on a fixed 240×168 sheet, so it scales to whatever it is set in —
 * a 265 card, a 320 tile, a phone — and stays one drawing. Decorative: the
 * card or step it sits in says what it shows.
 */

const INK = "var(--color-fg-on-light)";
const WHITE = "var(--color-bg-white)";

/** The screen's tint at two depths. Values are theme tokens. */
type Paint = { field: string; shape: string };

const paints: Record<FeatureTone, Paint> = {
  blue: { field: "var(--color-tool-blue)", shape: "var(--color-tool-shape-blue)" },
  magenta: { field: "var(--color-tool-magenta)", shape: "var(--color-tool-shape-magenta)" },
  green: { field: "var(--color-tool-green)", shape: "var(--color-tool-shape-green)" },
  rose: { field: "var(--color-tool-rose)", shape: "var(--color-tool-shape-rose)" },
  lavender: { field: "var(--color-tool-lavender)", shape: "var(--color-tool-shape-lavender)" },
  peach: { field: "var(--color-tool-peach)", shape: "var(--color-tool-shape-peach)" },
};

/** The sheet, and the margin the construction lines run into. */
const W = 240;
const H = 168;
const M = 16;
/** The header band's height, and the sheet's inner padding. */
const HEAD = 26;
const PAD = 12;
const RIGHT = W - PAD;

/** Type sizes, in the sheet's units: a label, a line, a figure. */
const LABEL = 7.2;
const TEXT = 8.2;
const FIGURE = 16;

/** Roughly how wide a label is: Geist capitals plus the label tracking. */
function labelWidth(text: string) {
  return text.length * LABEL * 0.73;
}

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

/* ---------------------------------------------------------------------------
 * Pieces.
 * ------------------------------------------------------------------------- */

type TextProps = {
  x: number;
  y: number;
  children: ReactNode;
  anchor?: "start" | "middle" | "end";
  muted?: boolean;
  size?: number;
  weight?: number;
  fill?: string;
};

/** A line of words or a figure, in Geist (the root sets the family). */
function Text({ x, y, children, anchor = "start", muted, size = TEXT, weight, fill = INK }: TextProps) {
  return (
    <text
      x={x}
      y={y}
      fontSize={size}
      fontWeight={weight}
      textAnchor={anchor}
      fill={fill}
      fillOpacity={muted ? 0.55 : 1}
    >
      {children}
    </text>
  );
}

/** Small capitals, as the site's labels are set. */
function Label({ children, ...props }: Omit<TextProps, "children"> & { children: string }) {
  return (
    <Text size={LABEL} {...props}>
      <tspan letterSpacing="0.08em">{children.toUpperCase()}</tspan>
    </Text>
  );
}

/** A hairline. */
function Rule({ x1 = 0, x2 = W, y1, y2 = y1 }: { x1?: number; x2?: number; y1: number; y2?: number }) {
  return (
    <line
      x1={x1}
      x2={x2}
      y1={y1}
      y2={y2}
      stroke={INK}
      strokeOpacity={0.1}
      vectorEffect="non-scaling-stroke"
    />
  );
}

/** Where a real screen would have words: a grey bar. */
function Bar({ x, y, w, h = 4, o = 0.1 }: { x: number; y: number; w: number; h?: number; o?: number }) {
  return <rect x={x} y={y} width={w} height={h} fill={INK} fillOpacity={o} />;
}

function fillOf(status: ScreenStatus, paint: Paint) {
  return status === "tone" ? paint.shape : status === "ink" ? INK : WHITE;
}

/** A square in a status's fill, outlined as the dashboards' are. */
function Mark({ x, y, s = 6, fill, paint }: { x: number; y: number; s?: number; fill: ScreenStatus; paint: Paint }) {
  return (
    <rect
      x={x}
      y={y}
      width={s}
      height={s}
      fill={fillOf(fill, paint)}
      stroke={INK}
      strokeOpacity={fill === "open" ? 0.45 : 0.3}
      vectorEffect="non-scaling-stroke"
    />
  );
}

/** A status: its square, then the word, on the baseline given. */
function Status({ x, y, text, fill, paint }: { x: number; y: number; text: string; fill: ScreenStatus; paint: Paint }) {
  return (
    <>
      <Mark x={x} y={y - 5.6} fill={fill} paint={paint} />
      <Label x={x + 10} y={y}>
        {text}
      </Label>
    </>
  );
}

/** The header's right-hand end: a status, set to finish at the sheet's padding. */
function HeadStatus({ text, fill, paint }: { text: string; fill: ScreenStatus; paint: Paint }) {
  return <Status x={RIGHT - labelWidth(text) - 10} y={15.5} text={text} fill={fill} paint={paint} />;
}

/** …or a quieter note there instead. */
function Aside({ children }: { children: string }) {
  return (
    <Label x={RIGHT} y={15.5} anchor="end" muted>
      {children}
    </Label>
  );
}

/**
 * The sheet: construction lines off its four edges, the white sheet, its
 * header — the icon, the label, whatever stands at the right — and a square
 * on each corner.
 */
function Sheet({
  icon: Icon,
  label,
  right,
  children,
}: {
  icon: LucideIcon;
  label: string;
  right?: ReactNode;
  children: ReactNode;
}) {
  const corners = [
    [0, 0],
    [W, 0],
    [0, H],
    [W, H],
  ];

  return (
    <>
      <g stroke={INK} strokeOpacity={0.2} strokeDasharray="2 3">
        <line x1={-M} x2={W + M} y1={0} y2={0} vectorEffect="non-scaling-stroke" />
        <line x1={-M} x2={W + M} y1={H} y2={H} vectorEffect="non-scaling-stroke" />
        <line x1={0} x2={0} y1={-M} y2={H + M} vectorEffect="non-scaling-stroke" />
        <line x1={W} x2={W} y1={-M} y2={H + M} vectorEffect="non-scaling-stroke" />
      </g>
      <rect
        x={0}
        y={0}
        width={W}
        height={H}
        fill={WHITE}
        stroke={INK}
        strokeOpacity={0.14}
        vectorEffect="non-scaling-stroke"
      />

      {/* The icon set at the label's height, centred on the header band.

          Its height again as a style, and that is not redundant: globals.css
          gives every `svg` `height: auto` so media never overflows its column,
          and on an svg nested in this one a CSS height beats the attribute —
          the icon's box stretched to the whole sheet and the icon sat in the
          middle of it. In SVG content a CSS pixel is the sheet's own unit. */}
      <Icon
        x={PAD - 0.5}
        y={7}
        width={12}
        height={12}
        style={{ height: 12, maxWidth: "none" }}
        color={INK}
        strokeWidth={1.75}
      />
      <Label x={PAD + 16} y={15.5}>
        {label}
      </Label>
      {right}
      <Rule y1={HEAD} />

      {children}

      {corners.map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x - 1.5} y={y - 1.5} width={3} height={3} fill={INK} />
      ))}
    </>
  );
}

/* ---------------------------------------------------------------------------
 * The screens. Each takes its tint and draws from its own words.
 * ------------------------------------------------------------------------- */

type Drawing = (paint: Paint) => ReactNode;

/** Cut Software Spend: three tools struck out, one system in their place. */
const spend: Drawing = (paint) => {
  const s = screens.spend;
  const names = [72, 54, 86];
  const saved = s.retired.reduce((sum, n) => sum + n, 0) - s.own.amount;

  return (
    <Sheet icon={CreditCard} label={s.label} right={<Aside>{s.aside}</Aside>}>
      {s.retired.map((amount, i) => {
        const mid = HEAD + 16 + i * 20;
        const text = money.format(amount);
        return (
          <g key={amount}>
            <Mark x={PAD} y={mid - 3} fill="open" paint={paint} />
            <Bar x={PAD + 14} y={mid - 2} w={names[i]} o={0.08} />
            <Text x={RIGHT} y={mid + 2.9} anchor="end" muted>
              {text}
            </Text>
            <line
              x1={RIGHT - text.length * TEXT * 0.56 - 1}
              x2={RIGHT + 1}
              y1={mid - 0.2}
              y2={mid - 0.2}
              stroke={INK}
              strokeOpacity={0.6}
              vectorEffect="non-scaling-stroke"
            />
            <Rule y1={mid + 10} />
          </g>
        );
      })}

      <rect x={0} y={HEAD + 66} width={W} height={22} fill={paint.field} />
      <Mark x={PAD} y={HEAD + 74} fill="tone" paint={paint} />
      <Label x={PAD + 14} y={HEAD + 80}>
        {s.own.label}
      </Label>
      <Text x={RIGHT} y={HEAD + 80.6} anchor="end" weight={500}>
        {money.format(s.own.amount)}
      </Text>
      <Rule y1={HEAD + 88} />

      <Label x={PAD} y={H - 16} muted>
        {s.saved}
      </Label>
      <Text x={RIGHT} y={H - 14} anchor="end" size={FIGURE + 4} weight={300}>
        {`−${money.format(saved)}`}
      </Text>
    </Sheet>
  );
};

/** Lower Fulfillment Costs: two figures, then orders entering themselves. */
const orders: Drawing = (paint) => {
  const s = screens.orders;
  const bars = [64, 50, 72, 58];
  const cell = (W - PAD * 3) / 2;

  return (
    <Sheet icon={Package} label={s.label} right={<HeadStatus text={s.status} fill="tone" paint={paint} />}>
      {s.kpis.map((kpi, i) => {
        const x = PAD + i * (cell + PAD);
        return (
          <g key={kpi.label}>
            <rect x={x} y={34} width={cell} height={40} fill="none" stroke={INK} strokeOpacity={0.12} vectorEffect="non-scaling-stroke" />
            <Label x={x + 8} y={47} muted>
              {kpi.label}
            </Label>
            <Text x={x + 8} y={66} size={FIGURE} weight={300}>
              {kpi.value}
            </Text>
          </g>
        );
      })}

      {s.rows.map((row, i) => {
        const mid = 92 + i * 20;
        return (
          <g key={row.id}>
            <Rule y1={mid - 10} x1={PAD} x2={RIGHT} />
            <Text x={PAD} y={mid + 2.9} muted>
              {row.id}
            </Text>
            <Bar x={PAD + 38} y={mid - 2} w={bars[i]} o={0.08} />
            <Status x={146} y={mid + 2.6} text={row.status} fill={row.fill} paint={paint} />
          </g>
        );
      })}
    </Sheet>
  );
};

/** Automated Follow-Up: one lead's timeline, missed call to meeting. */
const followUp: Drawing = (paint) => {
  const s = screens.followUp;
  const last = s.events.length - 1;

  return (
    <Sheet icon={UserRound} label={s.label} right={<HeadStatus text={s.status} fill="ink" paint={paint} />}>
      <line x1={PAD + 3.5} x2={PAD + 3.5} y1={42} y2={122} stroke={INK} strokeOpacity={0.18} vectorEffect="non-scaling-stroke" />
      {s.events.map((event, i) => {
        const y = 42 + i * 20;
        return (
          <g key={event.text}>
            <Mark x={PAD} y={y - 3.5} s={7} fill={i === last ? "ink" : "tone"} paint={paint} />
            <Text x={PAD + 16} y={y + 2.9} weight={i === last ? 500 : undefined}>
              {event.text}
            </Text>
            <Text x={RIGHT} y={y + 2.9} anchor="end" size={TEXT - 0.6} muted>
              {event.time}
            </Text>
          </g>
        );
      })}
      <Rule y1={138} />
      <Label x={PAD} y={156} muted>
        {s.footer.label}
      </Label>
      <Text x={RIGHT} y={156.4} anchor="end" weight={500}>
        {s.footer.value}
      </Text>
    </Sheet>
  );
};

/** Inbound That Converts: a chat, the visitor left and the AI right. */
const chat: Drawing = (paint) => {
  const s = screens.chat;
  const offerW = 116;

  return (
    <Sheet icon={MessageSquare} label={s.label} right={<Aside>{s.aside}</Aside>}>
      <rect x={PAD} y={36} width={132} height={24} fill={WHITE} stroke={INK} strokeOpacity={0.14} vectorEffect="non-scaling-stroke" />
      <Bar x={PAD + 8} y={42.5} w={104} />
      <Bar x={PAD + 8} y={50.5} w={70} />

      <rect x={RIGHT - 132} y={66} width={132} height={24} fill={paint.shape} />
      <Bar x={RIGHT - 124} y={72.5} w={110} o={0.16} />
      <Bar x={RIGHT - 124} y={80.5} w={62} o={0.16} />

      <rect x={PAD} y={96} width={104} height={16} fill={WHITE} stroke={INK} strokeOpacity={0.14} vectorEffect="non-scaling-stroke" />
      <Bar x={PAD + 8} y={102} w={80} />

      <rect x={RIGHT - offerW} y={118} width={offerW} height={18} fill={INK} />
      <Text x={RIGHT - offerW + 8} y={130} size={TEXT - 0.4} fill={WHITE}>
        {s.offer}
      </Text>

      {s.statuses.map((status, i) => (
        <Status
          key={status.text}
          x={PAD + i * 72}
          y={156}
          text={status.text}
          fill={status.fill}
          paint={paint}
        />
      ))}
    </Sheet>
  );
};

/** Outbound That Scales: three figures, and the meetings climbing week on week. */
const outbound: Drawing = (paint) => {
  const s = screens.outbound;
  const col = (W - PAD * 2) / 3;
  const top = Math.max(...s.weeks);
  const gap = 6;
  const bw = (W - PAD * 2 - gap * (s.weeks.length - 1)) / s.weeks.length;
  const base = 156;

  return (
    <Sheet icon={Send} label={s.label} right={<HeadStatus text={s.status} fill="tone" paint={paint} />}>
      {s.kpis.map((kpi, i) => {
        const x = PAD + i * col + (i ? 10 : 0);
        return (
          <g key={kpi.label}>
            {i > 0 && <Rule x1={PAD + i * col} x2={PAD + i * col} y1={36} y2={70} />}
            <Text x={x} y={54} size={FIGURE} weight={300}>
              {kpi.value}
            </Text>
            <Label x={x} y={66} muted size={LABEL - 0.6}>
              {kpi.label}
            </Label>
          </g>
        );
      })}
      <Rule y1={78} x1={PAD} x2={RIGHT} />
      <Label x={PAD} y={94} muted>
        {s.chart}
      </Label>
      {s.weeks.map((week, i) => {
        const h = (week / top) * 50;
        return (
          <rect
            key={i}
            x={PAD + i * (bw + gap)}
            y={base - h}
            width={bw}
            height={h}
            fill={i === s.weeks.length - 1 ? INK : paint.shape}
          />
        );
      })}
      <Rule y1={base} x1={PAD} x2={RIGHT} />
    </Sheet>
  );
};

/** Custom Software Moats: the business's own app — its menu and its jobs. */
const app: Drawing = (paint) => {
  const s = screens.app;
  const side = 66;
  const x0 = side + PAD;

  return (
    <Sheet icon={AppWindow} label={s.label} right={<Aside>{s.aside}</Aside>}>
      <Rule x1={side} x2={side} y1={HEAD} y2={H} />
      <rect x={0} y={HEAD + 6} width={side} height={17} fill={paint.field} />
      <rect x={0} y={HEAD + 6} width={2} height={17} fill={INK} />
      {s.nav.map((item, i) => (
        <Text key={item} x={PAD} y={HEAD + 17.6 + i * 19} size={TEXT - 0.6} muted={i > 0}>
          {item}
        </Text>
      ))}

      {s.columns.map((column, i) => (
        <Label key={column} x={i ? 150 : x0} y={44} muted>
          {column}
        </Label>
      ))}
      {s.rows.map((row, i) => {
        const mid = 60 + i * 20;
        return (
          <g key={row.id}>
            <Rule y1={mid - 10} x1={x0} x2={RIGHT} />
            <Text x={x0} y={mid + 2.9}>
              {row.id}
            </Text>
            <Status x={150} y={mid + 2.6} text={row.status} fill={row.fill} paint={paint} />
          </g>
        );
      })}
      <Rule y1={140} x1={x0} x2={RIGHT} />
      <Label x={x0} y={156} muted size={LABEL - 0.6}>
        {s.footer}
      </Label>
    </Sheet>
  );
};

/** Audit: the process as it runs, the steps done by hand filled in. */
const audit: Drawing = (paint) => {
  const s = screens.audit;
  const nw = 78;
  const nh = 20;
  const left = PAD + 4;
  const right = RIGHT - 4 - nw;
  const mid = (W - nw) / 2;
  const at = [
    [left, 40],
    [right, 40],
    [left, 78],
    [right, 78],
    [mid, 116],
  ];
  const cx = (i: number) => at[i][0] + nw / 2;
  const links = [
    `M${left + nw} 50H${right}`,
    `M${cx(0)} 60V78`,
    `M${cx(1)} 60V78`,
    `M${left + nw} 88H${right}`,
    `M${cx(2)} 98V126H${mid}`,
    `M${cx(3)} 98V126H${mid + nw}`,
  ];

  return (
    <Sheet icon={Route} label={s.label} right={<Aside>{s.aside}</Aside>}>
      <g fill="none" stroke={INK} strokeOpacity={0.4} strokeDasharray="2 2">
        {links.map((d) => (
          <path key={d} d={d} vectorEffect="non-scaling-stroke" />
        ))}
      </g>
      {s.nodes.map((node, i) => {
        const manual = (s.manual as readonly number[]).includes(i);
        return (
          <g key={node}>
            <rect
              x={at[i][0]}
              y={at[i][1]}
              width={nw}
              height={nh}
              fill={manual ? paint.shape : WHITE}
              stroke={INK}
              strokeOpacity={0.3}
              vectorEffect="non-scaling-stroke"
            />
            <Text x={cx(i)} y={at[i][1] + 13} anchor="middle" size={TEXT - 0.4}>
              {node}
            </Text>
          </g>
        );
      })}
      <Mark x={PAD} y={150.4} fill="tone" paint={paint} />
      <Label x={PAD + 10} y={156} muted>
        {s.legend}
      </Label>
    </Sheet>
  );
};

/** Identify: what each opportunity is worth a year, largest first. */
const identify: Drawing = (paint) => {
  const s = screens.identify;
  const top = Math.max(...s.rows.map((row) => row.value));
  const total = s.rows.reduce((sum, row) => sum + row.value, 0);
  const span = W - PAD * 2;

  return (
    <Sheet icon={Search} label={s.label} right={<Aside>{s.aside}</Aside>}>
      {s.rows.map((row, i) => {
        const y = 34 + i * 24;
        return (
          <g key={row.text}>
            <Text x={PAD} y={y + 8}>
              {row.text}
            </Text>
            <Text x={RIGHT} y={y + 8} anchor="end">
              {`$${row.value}K`}
            </Text>
            <rect x={PAD} y={y + 12} width={span} height={4} fill={INK} fillOpacity={0.07} />
            <rect x={PAD} y={y + 12} width={(row.value / top) * span} height={4} fill={i === 0 ? INK : paint.shape} />
          </g>
        );
      })}
      <Rule y1={134} />
      <Label x={PAD} y={154} muted>
        {s.total}
      </Label>
      <Text x={RIGHT} y={156} anchor="end" size={FIGURE} weight={300}>
        {`$${total}K`}
      </Text>
    </Sheet>
  );
};

/** Build: three sprints of work, and how far along it is. */
const build: Drawing = (paint) => {
  const s = screens.build;
  const cw = 68;
  const span = W - PAD * 2;
  const done = span * s.progress.value;

  return (
    <Sheet icon={Wrench} label={s.label} right={<HeadStatus text={s.status} fill="tone" paint={paint} />}>
      {s.sprints.map((sprint, c) => {
        const x = PAD + c * (cw + 6);
        return (
          <g key={sprint.name}>
            <Label x={x} y={43} muted>
              {sprint.name}
            </Label>
            {sprint.tasks.map(([task, fill], r) => {
              const y = 50 + r * 22;
              return (
                <g key={task}>
                  <rect x={x} y={y} width={cw} height={18} fill={WHITE} stroke={INK} strokeOpacity={0.14} vectorEffect="non-scaling-stroke" />
                  <Mark x={x + 6} y={y + 6} fill={fill} paint={paint} />
                  <Text x={x + 17} y={y + 12} size={TEXT - 0.6}>
                    {task}
                  </Text>
                </g>
              );
            })}
          </g>
        );
      })}
      <Label x={PAD} y={134} muted>
        {s.progress.label}
      </Label>
      <Text x={RIGHT} y={134.4} anchor="end">
        {`${Math.round(s.progress.value * 100)}%`}
      </Text>
      <rect x={PAD} y={142} width={span} height={5} fill={INK} fillOpacity={0.07} />
      <rect x={PAD} y={142} width={done} height={5} fill={paint.shape} />
      <rect x={PAD + done - 1} y={139} width={2} height={11} fill={INK} />
    </Sheet>
  );
};

/** Deploy & Train: the go-live checklist, three done and two to come. */
const deploy: Drawing = (paint) => {
  const s = screens.deploy;
  const last = s.rows.length - 1;

  return (
    <Sheet icon={Rocket} label={s.label} right={<HeadStatus text={s.status} fill="ink" paint={paint} />}>
      {s.rows.map((row, i) => {
        const mid = HEAD + 14 + i * 27;
        return (
          <g key={row.text}>
            <rect
              x={PAD}
              y={mid - 4.5}
              width={9}
              height={9}
              fill={row.done ? INK : WHITE}
              stroke={INK}
              strokeOpacity={row.done ? 1 : 0.45}
              vectorEffect="non-scaling-stroke"
            />
            {row.done && (
              <path
                d={`M${PAD + 2.2} ${mid}L${PAD + 4} ${mid + 1.8}L${PAD + 7} ${mid - 2}`}
                fill="none"
                stroke={WHITE}
                strokeWidth={1.2}
              />
            )}
            <Text x={PAD + 17} y={mid + 2.9}>
              {row.text}
            </Text>
            <Label x={RIGHT} y={mid + 2.6} anchor="end" muted>
              {row.note}
            </Label>
            {i < last && <Rule y1={mid + 13.5} x1={PAD} x2={RIGHT} />}
          </g>
        );
      })}
    </Sheet>
  );
};

/** Keep Improving: this month's figure and the year climbing to it. */
const improve: Drawing = (paint) => {
  const s = screens.improve;
  const lo = Math.min(...s.months) - 10;
  const hi = Math.max(...s.months);
  const base = 140;
  const span = W - PAD * 2;
  const step = span / (s.months.length - 1);
  const pts = s.months.map((m, i) => [PAD + i * step, base - ((m - lo) / (hi - lo)) * 60] as const);
  const line = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join("");
  const [endX, endY] = pts[pts.length - 1];

  return (
    <Sheet icon={TrendingUp} label={s.label} right={<HeadStatus text={s.status} fill="tone" paint={paint} />}>
      <Text x={PAD} y={62} size={FIGURE + 8} weight={300}>
        {s.value}
      </Text>
      <Label x={PAD + 34} y={61} muted>
        {s.unit}
      </Label>
      <path d={`${line}L${RIGHT} ${base}L${PAD} ${base}Z`} fill={paint.shape} />
      <path d={line} fill="none" stroke={INK} strokeWidth={1.25} strokeLinejoin="round" />
      <rect x={endX - 2.5} y={endY - 2.5} width={5} height={5} fill={INK} />
      <Rule y1={base} x1={PAD} x2={RIGHT} />
      {s.axis.map((month, i) => (
        <Label
          key={month}
          x={[PAD, PAD + 5 * step, RIGHT][i]}
          y={156}
          anchor={(["start", "middle", "end"] as const)[i]}
          muted
          size={LABEL - 0.6}
        >
          {month}
        </Label>
      ))}
    </Sheet>
  );
};

/** Inbound Responder: last night's calls, each answered and sorted. */
const calls: Drawing = (paint) => {
  const s = screens.calls;
  const last = s.rows.length - 1;

  return (
    <Sheet icon={Phone} label={s.label} right={<HeadStatus text={s.status} fill="tone" paint={paint} />}>
      {s.rows.map((row, i) => {
        const mid = HEAD + 18 + i * 32;
        return (
          <g key={row.initials}>
            <rect x={PAD} y={mid - 8} width={16} height={16} fill={paint.field} stroke={INK} strokeOpacity={0.14} vectorEffect="non-scaling-stroke" />
            <Text x={PAD + 8} y={mid + 2.2} anchor="middle" size={6} weight={600}>
              {row.initials}
            </Text>
            <Text x={PAD + 24} y={mid + 2.9}>
              {row.name}
            </Text>
            <Text x={104} y={mid + 2.9} size={TEXT - 0.6} muted>
              {row.time}
            </Text>
            <Status x={156} y={mid + 2.6} text={row.status} fill={row.fill} paint={paint} />
            {i < last && <Rule y1={mid + 16} x1={PAD} x2={RIGHT} />}
          </g>
        );
      })}
    </Sheet>
  );
};

/** Follow-Up Agent: open quotes, each partway through its cadence. */
const sequence: Drawing = (paint) => {
  const s = screens.sequence;
  const last = s.rows.length - 1;

  return (
    <Sheet icon={Repeat} label={s.label} right={<Aside>{s.aside}</Aside>}>
      {s.rows.map((row, i) => {
        const mid = HEAD + 18 + i * 32;
        return (
          <g key={row.id}>
            <Text x={PAD} y={mid + 2.9}>
              {row.id}
            </Text>
            {[0, 1, 2].map((k) => (
              <Mark
                key={k}
                x={70 + k * 10}
                y={mid - 3}
                fill={row.fill === "ink" ? "ink" : k < row.step ? "tone" : "open"}
                paint={paint}
              />
            ))}
            <Status x={128} y={mid + 2.6} text={row.status} fill={row.fill} paint={paint} />
            {i < last && <Rule y1={mid + 16} x1={PAD} x2={RIGHT} />}
          </g>
        );
      })}
    </Sheet>
  );
};

/** Outbound SDR: a first email, its one personal line marked in the tint. */
const email: Drawing = (paint) => {
  const s = screens.email;
  const sendW = 54;

  return (
    <Sheet icon={Mail} label={s.label} right={<HeadStatus text={s.status} fill="tone" paint={paint} />}>
      <Label x={PAD} y={44} muted>
        {s.to}
      </Label>
      <Bar x={PAD + 50} y={39.5} w={92} />
      <Rule y1={52} x1={PAD} x2={RIGHT} />
      <Label x={PAD} y={66} muted>
        {s.subject}
      </Label>
      <Bar x={PAD + 50} y={61.5} w={64} o={0.16} />
      <Rule y1={74} x1={PAD} x2={RIGHT} />

      <Bar x={PAD} y={88} w={28} />
      <rect x={PAD + 32} y={84} width={96} height={12} fill={paint.shape} />
      <Bar x={PAD + 36} y={88} w={88} o={0.22} />
      <Bar x={PAD + 132} y={88} w={52} />
      <Bar x={PAD} y={100} w={184} />
      <Bar x={PAD} y={112} w={150} />
      <Bar x={PAD} y={124} w={98} />

      <rect x={RIGHT - sendW} y={140} width={sendW} height={16} fill={INK} />
      <Label x={RIGHT - sendW / 2} y={150.6} anchor="middle" fill={WHITE}>
        {s.send}
      </Label>
    </Sheet>
  );
};

/** Ops Coordinator: today's jobs across four crews, one stuck. */
const dispatch: Drawing = (paint) => {
  const s = screens.dispatch;
  const x0 = 58;
  const hour = (RIGHT - x0) / 8;

  return (
    <Sheet icon={Truck} label={s.label} right={<HeadStatus text={s.status} fill="ink" paint={paint} />}>
      {s.hours.map((h, i) => {
        const x = x0 + i * 2 * hour;
        return (
          <g key={h}>
            <Label x={x} y={41} anchor="middle" muted size={LABEL - 0.6}>
              {h}
            </Label>
            <Rule x1={x} x2={x} y1={46} y2={158} />
          </g>
        );
      })}
      {s.crews.map((crew, i) => {
        const top = 52 + i * 27;
        return (
          <g key={crew.name}>
            <Label x={PAD} y={top + 10.5} muted>
              {crew.name}
            </Label>
            {crew.jobs.map(([a, b]) => (
              <rect
                key={a}
                x={x0 + a * hour}
                y={top}
                width={(b - a) * hour}
                height={14}
                fill={paint.shape}
                stroke={INK}
                strokeOpacity={0.2}
                vectorEffect="non-scaling-stroke"
              />
            ))}
            {"stuck" in crew && (
              <g>
                <rect
                  x={x0 + crew.stuck[0] * hour}
                  y={top}
                  width={(crew.stuck[1] - crew.stuck[0]) * hour}
                  height={14}
                  fill={WHITE}
                  stroke={INK}
                  strokeDasharray="2 2"
                  vectorEffect="non-scaling-stroke"
                />
                <rect x={x0 + crew.stuck[0] * hour + 4} y={top + 4.5} width={5} height={5} fill={INK} />
                <Label x={x0 + crew.stuck[0] * hour + 12} y={top + 9.6} size={LABEL - 1}>
                  {s.stuck}
                </Label>
              </g>
            )}
          </g>
        );
      })}
    </Sheet>
  );
};

/** Back-Office Assistant: invoices matched to payments, one left to check. */
const reconcile: Drawing = (paint) => {
  const s = screens.reconcile;
  const span = W - PAD * 2;

  return (
    <Sheet icon={Receipt} label={s.label} right={<HeadStatus text={s.status} fill="tone" paint={paint} />}>
      {s.rows.map((row, i) => {
        const mid = HEAD + 14 + i * 24;
        return (
          <g key={row.id}>
            <Text x={PAD} y={mid + 2.9}>
              {row.id}
            </Text>
            <Text x={128} y={mid + 2.9} anchor="end" muted>
              {row.amount}
            </Text>
            <Status x={146} y={mid + 2.6} text={row.status} fill={row.fill} paint={paint} />
            <Rule y1={mid + 12} x1={PAD} x2={RIGHT} />
          </g>
        );
      })}
      <Label x={PAD} y={146} muted>
        {s.progress.label}
      </Label>
      <Text x={RIGHT} y={146.4} anchor="end">
        {`${Math.round(s.progress.value * 100)}%`}
      </Text>
      <rect x={PAD} y={152} width={span} height={4} fill={INK} fillOpacity={0.07} />
      <rect x={PAD} y={152} width={span * s.progress.value} height={4} fill={paint.shape} />
    </Sheet>
  );
};

const drawings: Record<ScreenName, Drawing> = {
  spend,
  orders,
  followUp,
  chat,
  outbound,
  app,
  audit,
  identify,
  build,
  deploy,
  improve,
  calls,
  sequence,
  email,
  dispatch,
  reconcile,
};

type ProductScreenProps = {
  screen: ScreenName;
  tone: FeatureTone;
  className?: string;
};

export function ProductScreen({ screen, tone, className }: ProductScreenProps) {
  return (
    <svg
      viewBox={`${-M} ${-M} ${W + M * 2} ${H + M * 2}`}
      aria-hidden="true"
      className={cn("block h-auto w-full font-ui", className)}
    >
      {drawings[screen](paints[tone])}
    </svg>
  );
}
