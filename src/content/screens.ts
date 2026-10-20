/**
 * The small product screens that stand where the 3D pictures used to — on the
 * home page's feature cards, in How It Works and in the AI Employees bento.
 *
 * The client's direction: no 3D icons, and in their place "small product
 * screens instead of illustrations, like chats, tables, dashboards and status
 * pills", after Retool's site before its redesign. Drawn in this site's terms
 * rather than as screenshots: a white sheet with hairlines, square corners and
 * no shadow, Geist small capitals for labels, a tinted square for a status,
 * grey bars where a real screen would have text nobody needs to read — the
 * same language as the portfolio dashboard files.
 *
 * Every word and figure on a screen is here, one object per screen; the
 * drawings are `ProductScreen`. The figures are illustrative, like the
 * dashboards': they show the kind of thing each screen tracks, not a client's
 * numbers. A status names its fill: `tone` (the screen's tint), `ink`
 * (settled, the one that matters) or `open` (an outline: pending, not done).
 */

export type ScreenStatus = "tone" | "ink" | "open";

export const screens = {
  /* ---- Feature cards ---------------------------------------------------- */

  /** Cut Software Spend: the tools retired, and the one system in their place. */
  spend: {
    label: "Software spend",
    aside: "Per month",
    /** Struck through: what goes. Names are drawn as bars; amounts in $. */
    retired: [1140, 480, 350],
    own: { label: "One system", amount: 790 },
    saved: "Saved",
  },

  /** Lower Fulfillment Costs: orders entering themselves. */
  orders: {
    label: "Orders",
    status: "Live",
    kpis: [
      { label: "Manual entry", value: "0 hrs" },
      { label: "Orders today", value: "148" },
    ],
    rows: [
      { id: "#4821", status: "Entered", fill: "tone" },
      { id: "#4822", status: "Invoiced", fill: "tone" },
      { id: "#4823", status: "Picking", fill: "open" },
      { id: "#4824", status: "Shipped", fill: "ink" },
    ],
  },

  /** Automated Follow-Up: one lead, from missed call to meeting. */
  followUp: {
    label: "Lead · Dana R.",
    status: "Booked",
    events: [
      { text: "Missed call", time: "2:14 PM" },
      { text: "Text sent by AI", time: "2:14 PM" },
      { text: "Lead replied", time: "2:31 PM" },
      { text: "Quote sent", time: "2:33 PM" },
      { text: "Meeting booked", time: "Thu 10:00" },
    ],
    footer: { label: "Response time", value: "8 sec" },
  },

  /**
   * Inbound That Converts: a chat that ends in a booking. The visitor's and the
   * AI's messages are drawn as bars; the last, the offer of a time, is words.
   */
  chat: {
    label: "Web chat",
    aside: "Reply in 0:08",
    offer: "Tue 2 PM or Wed 9 AM?",
    statuses: [
      { text: "Qualified", fill: "tone" },
      { text: "Booked", fill: "ink" },
    ],
  },

  /** Outbound That Scales: what the AI SDR did this quarter. */
  outbound: {
    label: "Outbound",
    status: "Running",
    kpis: [
      { label: "Contacted", value: "412" },
      { label: "Replies", value: "38" },
      { label: "Meetings", value: "11" },
    ],
    chart: "Meetings / week",
    /** Ten weeks, oldest first. Only their proportions are drawn. */
    weeks: [18, 26, 22, 34, 30, 41, 47, 44, 55, 61],
  },

  /** Custom Software Moats: the business's own app. */
  app: {
    label: "Your system",
    aside: "v2.4",
    nav: ["Jobs", "Inventory", "Customers", "Reports", "Settings"],
    columns: ["Job", "Status"],
    rows: [
      { id: "1182", status: "Scheduled", fill: "open" },
      { id: "1183", status: "In progress", fill: "tone" },
      { id: "1184", status: "Complete", fill: "ink" },
      { id: "1185", status: "Quoted", fill: "tone" },
    ],
    footer: "Your data · your roadmap",
  },

  /* ---- How It Works ----------------------------------------------------- */

  /** Audit: the process as it runs today, manual steps marked. */
  audit: {
    label: "Process map",
    aside: "Current state",
    nodes: ["Lead in", "Quote", "Schedule", "Invoice", "Follow-up"],
    /** Which of the nodes, by position, are done by hand. */
    manual: [1, 3],
    legend: "Manual step",
  },

  /** Identify: the opportunities, ranked by what they are worth a year. */
  identify: {
    label: "Opportunities",
    aside: "Per year",
    rows: [
      { text: "Manual quoting", value: 84 },
      { text: "Missed calls", value: 62 },
      { text: "Duplicate tools", value: 28 },
      { text: "Re-keyed orders", value: 21 },
    ],
    total: "Total",
  },

  /** Build: three sprints, the work in each. */
  build: {
    label: "Build plan",
    status: "Week 3 of 6",
    sprints: [
      { name: "Sprint 1", tasks: [["Data model", "ink"], ["Orders", "ink"], ["Invoicing", "ink"]] },
      { name: "Sprint 2", tasks: [["Quotes", "ink"], ["Portal", "tone"], ["Sync", "tone"]] },
      { name: "Sprint 3", tasks: [["AI intake", "open"], ["Reports", "open"], ["Training", "open"]] },
    ],
    progress: { label: "Progress", value: 0.55 },
  },

  /** Deploy & Train: the go-live checklist. */
  deploy: {
    label: "Go-live",
    status: "Live",
    rows: [
      { text: "Data migrated", note: "Done", done: true },
      { text: "Team trained", note: "12/12", done: true },
      { text: "SOPs published", note: "Done", done: true },
      { text: "Old tools shut off", note: "Fri", done: false },
      { text: "Go-live review", note: "Mon", done: false },
    ],
  },

  /** Keep Improving: a number that keeps going up. */
  improve: {
    label: "Quotes closed",
    status: "+18%",
    value: "78",
    unit: "This month",
    /** Twelve months, oldest first. Only their proportions are drawn. */
    months: [42, 40, 46, 44, 51, 55, 53, 60, 64, 69, 72, 78],
    axis: ["Jan", "Jun", "Dec"],
  },

  /* ---- AI Employees ----------------------------------------------------- */

  /** Inbound Responder: last night's calls. */
  calls: {
    label: "Calls · overnight",
    status: "24/7",
    rows: [
      { initials: "MS", name: "Mark S.", time: "9:12 PM", status: "Booked", fill: "ink" },
      { initials: "JL", name: "Jen L.", time: "9:40 PM", status: "Qualified", fill: "tone" },
      { initials: "AK", name: "Ali K.", time: "11:03 PM", status: "Booked", fill: "ink" },
      { initials: "RT", name: "Rosa T.", time: "6:15 AM", status: "Not a fit", fill: "open" },
    ],
  },

  /** Follow-Up Agent: open quotes, each on its cadence. */
  sequence: {
    label: "Open quotes",
    aside: "Auto follow-up",
    rows: [
      { id: "Q-2291", step: 1, status: "Day 1 · Email", fill: "open" },
      { id: "Q-2288", step: 2, status: "Day 3 · Text", fill: "tone" },
      { id: "Q-2284", step: 3, status: "Day 7 · Call", fill: "tone" },
      { id: "Q-2279", step: 3, status: "Won", fill: "ink" },
    ],
  },

  /** Outbound SDR: a first email, one line written for this prospect. */
  email: {
    label: "Draft · step 1",
    status: "Personalized",
    to: "To",
    subject: "Subject",
    send: "Send",
  },

  /** Ops Coordinator: today's jobs across the crews, one stuck. */
  dispatch: {
    label: "Dispatch · Tue",
    status: "1 stuck",
    hours: ["8", "10", "12", "2", "4"],
    /** Each crew's jobs, as start and end in hours from 8:00. */
    crews: [
      { name: "Crew A", jobs: [[0, 2.5], [5, 7]] },
      { name: "Crew B", jobs: [[2.5, 4.5]] },
      { name: "Crew C", jobs: [[1, 3], [5.5, 7.5]] },
      { name: "Crew D", jobs: [[0.5, 2]], stuck: [6, 8] },
    ],
    stuck: "Parts",
  },

  /** Back-Office Assistant: invoices matched against payments. */
  reconcile: {
    label: "Reconciliation",
    status: "248/250",
    rows: [
      { id: "INV-901", amount: "$2,140", status: "Matched", fill: "tone" },
      { id: "INV-902", amount: "$880", status: "Matched", fill: "tone" },
      { id: "INV-903", amount: "$1,320", status: "Review", fill: "open" },
      { id: "INV-904", amount: "$410", status: "Matched", fill: "tone" },
    ],
    progress: { label: "Matched", value: 248 / 250 },
  },
} as const;

/** Which screen a card, step or role shows. */
export type ScreenName = keyof typeof screens;
